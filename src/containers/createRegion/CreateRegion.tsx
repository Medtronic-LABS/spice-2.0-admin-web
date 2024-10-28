import { Tools } from 'final-form';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';

import RegionForm from './RegionForm';
import FormContainer from '../../components/formContainer/FormContainer';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import { AppState } from '../../store/rootReducer';
import { createRegionRequest } from '../../store/region/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import RegionFormIcon from '../../assets/images/info-grey.svg';
import RegionAdminFormIcon from '../../assets/images/avatar-o.svg';
import Loader from '../../components/loader/Loader';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import { fetchCountryListRequest } from '../../store/healthFacility/actions';
import { getAdminPayload } from '../../utils/commonUtils';

export interface IRegionFormValues {
  region: {
    name: string;
    countryCode: string;
    appTypes: string[];
  };
  users: IUserFormValues[];
}

const CreateRegion: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.region.loading);

  /**
   * Resets form fields whose keys include the specified substring.
   *
   * @param {Object} utils - Utility functions for managing the form state.
   * @param {Function} utils.resetFieldState - Function to reset the state of a specific field.
   *
   * @returns {void}
   */
  const resetFields = useCallback(([subStrOfKey]: [string], state: any, utils: Tools<IRegionFormValues>) => {
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

  const onCancel = useCallback(() => {
    history.push(PROTECTED_ROUTES.regionDashboard);
  }, [history]);

  /**
   * Handle submission of the region form.
   *
   * @param {Object} formValues - The form values to submit.
   * @param {Object} formValues.region - The region information entered in the form.
   * @param {string} formValues.region.name - The name of the region, which will be trimmed.
   * @param {Array} formValues.users - List of users associated with the region.
   *
   * @returns {void}
   */
  const onSubmit = useCallback(
    ({ region, users }: IRegionFormValues) => {
      const data = {
        ...region,
        name: region.name?.trim(),
        users: getAdminPayload({ userFormData: users, isFromList: false })
      };
      dispatch(
        createRegionRequest({
          data,
          successCb: () => {
            dispatch(fetchCountryListRequest());
            history.push(PROTECTED_ROUTES.regionDashboard);
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.REGION_CREATION_SUCCESS);
          },
          failureCb: (e) =>
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.REGION_CREATION_ERROR))
        })
      );
    },
    [dispatch, history]
  );

  return (
    <>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
          resetFields
        }}
        render={({ handleSubmit, form }: FormRenderProps<IRegionFormValues>) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className='row g-1dot25'>
                <div className='col-lg-6 col-12'>
                  <FormContainer label='Region Details' icon={RegionFormIcon}>
                    <RegionForm />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label='Region Admin' icon={RegionAdminFormIcon}>
                    <UserForm
                      isRegionCreate={true}
                      isAdminForm={true}
                      form={form}
                      defaultSelectedRole={APPCONSTANTS.ROLES.REGION_ADMIN}
                      enableAutoPopulate={true}
                    />
                  </FormContainer>
                </div>
              </div>
              <div className='col-12 mt-1dot25 d-flex'>
                <button type='button' className='btn secondary-btn me-0dot625 px-1dot125 ms-auto' onClick={onCancel}>
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

export default CreateRegion;
