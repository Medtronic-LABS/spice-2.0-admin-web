import { FormApi, Tools } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React, { useCallback, useRef } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import DistrictAdminFormIcon from '../../assets/images/avatar-o.svg';
import DistrictFormIcon from '../../assets/images/info-grey.svg';
import FormContainer from '../../components/formContainer/FormContainer';
import Loader from '../../components/loader/Loader';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { createDistrictRequest } from '../../store/district/actions';
import { IDistrictPayload } from '../../store/district/types';
import { AppState } from '../../store/rootReducer';
import { countryIdSelector } from '../../store/user/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';
import { getAdminPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import DistrictForm from './DistrictForm';

interface IDistrictFormValues {
  district: {
    name: string;
    maxNoOfUsers?: number;
    clinicalWorkflow: number[];
    customizedWorkflow: number[];
  };
  users: IUserFormValues[];
}

/**
 * CreateDistrict Component
 * @returns {React.FC} - A React functional component for creating a district.
 */

const CreateDistrict: React.FC = () => {
  const history = useHistory();
  const { regionId, tenantId } = useParams<{ regionId: string; tenantId: string }>();
  const dispatch = useDispatch();
  const formInstance = useRef<FormApi<IDistrictFormValues> | undefined>(undefined);

  const loading = useSelector((state: AppState) => state.district.loading);
  const countryId = useSelector(countryIdSelector)?.id;
  const {
    appTypes,
    district: { s: districtSName }
  } = useAppTypeConfigs();

  /**
   * Resets the state of form fields that contain a specified substring in their key.
   *
   * @param {string} subStrOfKey - The substring to match in field keys.
   * @param {object} state - The current state of the form, containing field data.
   * @param {Tools<IChiefdomFormValues>} utils - Utility functions for managing form state.
   */
  const resetFields = useCallback(([subStrOfKey]: [string], state: any, utils: Tools<IDistrictFormValues>) => {
    try {
      Object.keys(state.fields).forEach((key: string) => {
        if (key.includes(subStrOfKey)) {
          utils.resetFieldState(key);
        }
      });
    } catch (e) {
      console.error('Error removing form', e);
    }
  }, []);

  /**
   * function for form submit navigation
   * @callback
   */
  const handleNavigation = useCallback(() => {
    let redirectTo: string;
    if (countryId) {
      redirectTo = PROTECTED_ROUTES.districtDashboard;
    } else {
      redirectTo = PROTECTED_ROUTES.districtByRegion
        .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
        .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID));
    }
    history.push(redirectTo);
  }, [countryId, history]);

  /**
   * function for submitting the create district form
   * @param {IDistrictFormValues.district} district- user entered ditrict form values
   * @param {IDistrictFormValues.users} users- user entered form values for district admin.
   */
  const onSubmit = useCallback(
    ({ district, users }: IDistrictFormValues) => {
      const data = {
        name: district.name.trim(),
        users: getAdminPayload({ userFormData: users, appTypes, isFromList: false, countryId: regionId }),
        countryId: Number(regionId),
        parentOrganizationId: Number(tenantId),
        tenantId: Number(tenantId)
      } as IDistrictPayload;
      dispatch(
        createDistrictRequest({
          data,
          successCb: () => {
            handleNavigation();
            toastCenter.success(
              APPCONSTANTS.SUCCESS,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_CREATION_SUCCESS, districtSName)
            );
          },
          failureCb: (e: Error) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_CREATION_FAIL, districtSName)
              )
            )
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, handleNavigation, regionId, tenantId]
  );

  return (
    <>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
          resetFields
        }}
        render={({ handleSubmit, form }: FormRenderProps<IDistrictFormValues>) => {
          formInstance.current = form;
          return (
            <form onSubmit={handleSubmit}>
              <div className='row g-1dot25'>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${districtSName} Details`} icon={DistrictFormIcon}>
                    <DistrictForm />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${districtSName} Admin`} icon={DistrictAdminFormIcon}>
                    <UserForm
                      form={formInstance.current}
                      countryId={Number(regionId)}
                      defaultSelectedRole={APPCONSTANTS.ROLES.DISTRICT_ADMIN}
                      enableAutoPopulate={true}
                      userFormParams={{ isCreateDistrict: true, isAdminForm: true }}
                    />
                  </FormContainer>
                </div>
              </div>
              <div className='col-12 mt-1dot25 d-flex'>
                <button
                  type='button'
                  className='btn secondary-btn me-0dot625 px-1dot125 ms-auto'
                  onClick={handleNavigation}
                >
                  Cancel
                </button>
                <button type='submit' className='btn primary-btn px-1dot75'>
                  Submit
                </button>
              </div>
              {loading && <Loader isFullScreen={loading} className='translate-x-minus50' />}
            </form>
          );
        }}
      />
    </>
  );
};

export default CreateDistrict;
