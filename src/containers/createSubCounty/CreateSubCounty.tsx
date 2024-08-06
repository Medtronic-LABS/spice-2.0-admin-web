import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import SubCountyForm from '../../components/subCountyForm/SubCountyForm';
import FormContainer from '../../components/formContainer/FormContainer';
import { PROTECTED_ROUTES } from '../../constants/route';
import Loader from '../../components/loader/Loader';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import { createSubCountyRequest } from '../../store/subCounty/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import SubCountyFormIcon from '../../assets/images/info-grey.svg';
import SubCountyAdminFormIcon from '../../assets/images/avatar-o.svg';
import { ICountyOption } from '../../store/county/types';
import { Tools } from 'final-form';
import { subCountyLoadingSelector } from '../../store/subCounty/selectors';
import { roleSelector } from '../../store/user/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useCountryId from '../../hooks/useCountryId';

export interface ISubCountyFormValues {
  subCounty: {
    name: string;
    county?: ICountyOption;
  };
  users: IUserFormValues[];
}

export interface IParams {
  regionId: string;
  tenantId: string;
  accountId: string;
}

/**
 * Provides a form for creating the operating unit with admin
 * @returns {React.ReactElement}
 */

const CreateSubCounty: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { regionId, tenantId, accountId } = useParams<IParams>();

  const loading = useSelector(subCountyLoadingSelector);
  const role = useSelector(roleSelector);
  const countryIdValue = useCountryId();

  const { subCounty: subCountyModuleName } = NAME_CONSTANTS;

  /**
   * Navigates back to the appropriate route based on available IDs and user role.
   */
  const navigateBack = () => {
    let redirectTo: string;
    if (regionId && tenantId) {
      redirectTo = PROTECTED_ROUTES.subCountyByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId);
    } else if (
      accountId &&
      tenantId &&
      (role === APPCONSTANTS.ROLES.REGION_ADMIN ||
        role === APPCONSTANTS.ROLES.SUPER_ADMIN ||
        role === APPCONSTANTS.ROLES.SUPER_USER)
    ) {
      redirectTo = PROTECTED_ROUTES.subCountyByCounty.replace(':accountId', accountId).replace(':tenantId', tenantId);
    } else {
      redirectTo = PROTECTED_ROUTES.SubCountyDashboard;
    }
    history.push(redirectTo);
  };

  /**
   * Resets the state of form fields that contain a specified substring in their key.
   *
   * @param {string} subStrOfKey - The substring to match in field keys.
   * @param {object} state - The current state of the form, containing field data.
   * @param {Tools<ISubCountyFormValues>} utils - Utility functions for managing form state.
   */
  const resetFields = ([subStrOfKey]: [string], state: any, utils: Tools<ISubCountyFormValues>) => {
    try {
      Object.keys(state.fields).forEach((key: string) => {
        if (key.includes(subStrOfKey)) {
          utils.resetFieldState(key);
        }
      });
    } catch (e) {
      console.error('Error removing form', e);
    }
  };

  /**
   * Handles the form submission for creating or updating an operating unit.
   *
   * @param {ISubCountyFormValues} formValues - The form values containing the operating unit and user data.
   */

  const onSubmit = ({ subCounty: { county, ...subCounty }, users }: ISubCountyFormValues) => {
    const payload = {
      ...subCounty,
      name: subCounty.name.trim(),
      users: users.map((user: any) => {
        return {
          ...user,
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
          gender: user.gender,
          username: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.country.phoneNumberCode,
          country: { id: countryIdValue },
          roleIds: [user.role[0].id],
          timezone: { id: Number(user.timezone?.id) }
        };
      }),
      countryId: countryIdValue,
      countyId: Number(county?.id) || Number(accountId),
      parentOrganizationId: accountId ? Number(tenantId) : Number(county?.tenantId),
      tenantId: (accountId ? tenantId : county?.tenantId) as string
    };

    dispatch(
      createSubCountyRequest({
        payload,
        successCb: () => {
          navigateBack();
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_CREATION_SUCCESS, subCountyModuleName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_CREATION_FAIL, subCountyModuleName)
            )
          )
      })
    );
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
          resetFields
        }}
        render={({ handleSubmit, form }: FormRenderProps<ISubCountyFormValues>) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className='row g-1dot25'>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${subCountyModuleName} Details`} icon={SubCountyFormIcon}>
                    <SubCountyForm form={form} nestingKey='subCounty' />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${subCountyModuleName} Admin`} icon={SubCountyAdminFormIcon}>
                    <UserForm
                      form={form}
                      countryId={countryIdValue}
                      isAdminForm={true}
                      defaultSelectedRole={APPCONSTANTS.ROLES.SUB_COUNTY_ADMIN}
                      enableAutoPopulate={true}
                    />
                  </FormContainer>
                </div>
              </div>
              <div className='col-12 mt-1dot25 d-flex'>
                <button
                  type='button'
                  className='btn secondary-btn me-0dot625 px-1dot125 ms-auto'
                  onClick={navigateBack}
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

export default CreateSubCounty;
