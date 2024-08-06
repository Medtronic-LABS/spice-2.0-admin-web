import { FormApi, Tools } from 'final-form';
import React, { useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';

import CountyForm from './CountyForm';
import FormContainer from '../../components/formContainer/FormContainer';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import { AppState } from '../../store/rootReducer';
import { createCountyRequest } from '../../store/county/actions';
import { ICountyPayload } from '../../store/county/types';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import CountyFormIcon from '../../assets/images/info-grey.svg';
import CountyAdminFormIcon from '../../assets/images/avatar-o.svg';
import Loader from '../../components/loader/Loader';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import { userDataSelector } from '../../store/user/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';

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

  const loading = useSelector((state: AppState) => state.county.loading);
  const userData = useSelector(userDataSelector);
  const countryId = userData?.id;
  const { county: countyModuleName } = NAME_CONSTANTS;

  const resetFields = useCallback(([subStrOfKey]: [string], state: any, utils: Tools<ICountyFormValues>) => {
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
      redirectTo = PROTECTED_ROUTES.CountyDashboard;
    } else {
      redirectTo = PROTECTED_ROUTES.countyByRegion
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
        users: countyUsers.map((user: any) => ({
          ...user,
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          username: user.email,
          countryCode: user.country.phoneNumberCode,
          country: { id: regionId },
          roleIds: [user.role[0].id],
          timezone: { id: Number(user.timezone.id) }
        })),
        countryId: Number(regionId),
        parentOrganizationId: Number(tenantId),
        tenantId: Number(tenantId)
      } as ICountyPayload;
      dispatch(
        createCountyRequest({
          data,
          successCb: () => {
            handleNavigation();
            toastCenter.success(
              APPCONSTANTS.SUCCESS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_CREATION_SUCCESS, countyModuleName)
            );
          },
          failureCb: (e: Error) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.COUNTY_CREATION_FAIL, countyModuleName)
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
        render={({ handleSubmit, form }: FormRenderProps<ICountyFormValues>) => {
          formInstance.current = form;
          return (
            <form onSubmit={handleSubmit}>
              <div className='row g-1dot25'>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${countyModuleName} Details`} icon={CountyFormIcon}>
                    <CountyForm form={formInstance.current} />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${countyModuleName} Admin`} icon={CountyAdminFormIcon}>
                    <UserForm
                      form={formInstance.current}
                      countryId={Number(regionId)}
                      isAdminForm={true}
                      defaultSelectedRole={APPCONSTANTS.ROLES.ACCOUNT_ADMIN}
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

export default CreateCounty;
