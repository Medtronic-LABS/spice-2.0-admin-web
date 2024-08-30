import { FormApi, Tools } from 'final-form';
import React, { useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';

import DistrictForm from './DistrictForm';
import FormContainer from '../../components/formContainer/FormContainer';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import { AppState } from '../../store/rootReducer';
import { createDistrictRequest } from '../../store/district/actions';
import { IDistrictPayload } from '../../store/district/types';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import DistrictFormIcon from '../../assets/images/info-grey.svg';
import DistrictAdminFormIcon from '../../assets/images/avatar-o.svg';
import Loader from '../../components/loader/Loader';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import { countryIdSelector } from '../../store/user/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';
import { IRoles } from '../../store/user/types';

export interface IDistrictFormValues {
  district: {
    name: string;
    maxNoOfUsers?: number;
    clinicalWorkflow: number[];
    customizedWorkflow: number[];
  };
  users: IUserFormValues[];
}

const CreateDistrict: React.FC = () => {
  const history = useHistory();
  const { regionId, tenantId } = useParams<{ regionId: string; tenantId: string }>();
  const dispatch = useDispatch();
  const formInstance = useRef<FormApi<IDistrictFormValues> | undefined>(undefined);

  const loading = useSelector((state: AppState) => state.district.loading);
  const countryId = useSelector(countryIdSelector)?.id;
  const {
    district: { s: districtSName }
  } = NAME_CONSTANTS;

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

  const onSubmit = useCallback(
    ({ district, users }: IDistrictFormValues) => {
      const districtUsers = [...users] as any;
      const data = {
        name: district.name.trim(),
        users: districtUsers.map((user: any) => {
          let insightIds: number[] = [];
          if (user.roles) {
            insightIds = user.roles
              ?.filter((role: IRoles) => role.groupName === APPCONSTANTS.spiceRole.spiceInsights)
              ?.map((role: IRoles) => role.id);
          }
          return {
            ...user,
            firstName: user.firstName.trim(),
            lastName: user.lastName.trim(),
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            username: user.email,
            countryCode: user?.countryCode?.phoneNumberCode || user.country?.phoneNumberCode,
            country: { id: regionId },
            roleIds: [user.role[0].id, ...insightIds],
            timezone: { id: Number(user.timezone.id) }
          };
        }),
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
                    <DistrictForm form={formInstance.current} />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${districtSName} Admin`} icon={DistrictAdminFormIcon}>
                    <UserForm
                      form={formInstance.current}
                      countryId={Number(regionId)}
                      isAdminForm={true}
                      defaultSelectedRole={APPCONSTANTS.ROLES.DISTRICT_ADMIN}
                      enableAutoPopulate={true}
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
