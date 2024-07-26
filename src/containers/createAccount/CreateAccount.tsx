import { FormApi, Tools } from 'final-form';
import React, { useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';

import AccountForm from './AccountForm';
import FormContainer from '../../components/formContainer/FormContainer';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import { AppState } from '../../store/rootReducer';
import { createAccountRequest } from '../../store/account/actions';
import { IAccountPayload } from '../../store/account/types';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import CountyFormIcon from '../../assets/images/info-grey.svg';
import CountyAdminFormIcon from '../../assets/images/avatar-o.svg';
import Loader from '../../components/loader/Loader';
import UserForm from '../../components/userForm/UserForm';
import sessionStorageServices from '../../global/sessionStorageServices';

export interface IUserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string | { countryCode: string };
  username: string;
  phoneNumber: string;
  timezone: { id: string; description: string };
  gender: string;
  country: { countryCode: string };
}

export interface ICountyFormValues {
  county: {
    name: string;
    maxNoOfUsers?: number;
    clinicalWorkflow: number[];
    customizedWorkflow: number[];
  };
  users: IUserFormValues[];
}

const CreateCounty: React.FC = () => {
  const history = useHistory();
  const { regionId, tenantId } = useParams<{ regionId: string; tenantId: string }>();
  const dispatch = useDispatch();
  const formInstance = useRef<FormApi<ICountyFormValues> | undefined>(undefined);

  const loading = useSelector((state: AppState) => state.account.loading);
  const countryId = useSelector((state: AppState) => state.user.user.countryId);
  const moduleName = NAME_CONSTANTS.county;

  const resetFields = useCallback(
    ([subStrOfKey]: [string], state: any, utils: Tools<ICountyFormValues>) => {
      try {
        Object.keys(state.fields).forEach((key: string) => {
          if (key.includes(subStrOfKey)) {
            utils.resetFieldState(key);
          }
        });
      } catch (e) {
        console.error('Error removing form', e);
      }
    },
    []
  );

  const handleNavigation = useCallback(() => {
    let redirectTo: string;
    if (countryId) {
      redirectTo = PROTECTED_ROUTES.accountDashboard;
    } else {
      redirectTo = PROTECTED_ROUTES.accountByRegion
        .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
        .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID));
    }
    history.push(redirectTo);
  }, [countryId, history]);

  const onSubmit = useCallback(
    ({ county, users }: ICountyFormValues) => {
      const countyUsers = [...users] as any;
      const data = {
        name: county.name.trim(),
        maxNoOfUsers: county.maxNoOfUsers ? Number(county.maxNoOfUsers) : undefined,
        clinicalWorkflow: county.clinicalWorkflow,
        customizedWorkflow: county.customizedWorkflow,
        countryId: Number(regionId),
        parentOrganizationId: Number(tenantId),
        tenantId: Number(tenantId),
        users: countyUsers.map((user: any) => ({
          ...user,
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
          username: user.email,
          timezone: { id: Number(user.timezone.id) },
          countryCode: user.countryCode.countryCode,
          country: regionId,
          tenantId: user
        }))
      } as IAccountPayload;

      dispatch(
        createAccountRequest({
          data,
          successCb: () => {
            handleNavigation();
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_CREATION_SUCCESS);
          },
          failureCb: (e: Error) =>
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ACCOUNT_CREATION_FAIL))
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
        render={({ handleSubmit, form }: FormRenderProps<ICountyFormValues>) => {
          formInstance.current = form;
          return (
            <form onSubmit={handleSubmit}>
              <div className='row g-1dot25'>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${moduleName} Details`} icon={CountyFormIcon}>
                    <AccountForm form={formInstance.current} />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${moduleName} Admin`} icon={CountyAdminFormIcon}>
                    <UserForm form={formInstance.current} countryId={Number(regionId)} />
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

export default CreateCounty;
