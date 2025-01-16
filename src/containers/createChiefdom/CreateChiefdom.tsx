import { Tools } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ChiefdomAdminFormIcon from '../../assets/images/avatar-o.svg';
import ChiefdomFormIcon from '../../assets/images/info-grey.svg';
import ChiefdomForm from '../../components/chiefdomForm/ChiefdomForm';
import FormContainer from '../../components/formContainer/FormContainer';
import Loader from '../../components/loader/Loader';
import UserForm, { IUserFormValues } from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import useCountryId from '../../hooks/useCountryId';
import { createChiefdomRequest } from '../../store/chiefdom/actions';
import { chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { IDistrictOption } from '../../store/district/types';
import { roleSelector } from '../../store/user/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';
import { getAdminPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';

export interface IChiefdomFormValues {
  chiefdom: {
    name: string;
    district?: IDistrictOption;
  };
  users: IUserFormValues[];
  village: string[];
}

export interface IParams {
  regionId: string;
  tenantId: string;
  districtId: string;
}

/**
 * Provides a form for creating the chiefdom with admin
 * @returns {React.ReactElement}
 */

const CreateChiefdom: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { regionId, tenantId, districtId } = useParams<IParams>();

  const loading = useSelector(chiefdomLoadingSelector);
  const role = useSelector(roleSelector);
  const countryIdValue = useCountryId();

  const {
    appTypes,
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

  /**
   * Navigates back to the appropriate route based on available IDs and user role.
   */
  const navigateBack = () => {
    let redirectTo: string;
    if (regionId && tenantId) {
      redirectTo = PROTECTED_ROUTES.chiefdomByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId);
    } else if (
      districtId &&
      tenantId &&
      (role === APPCONSTANTS.ROLES.REGION_ADMIN ||
        role === APPCONSTANTS.ROLES.SUPER_ADMIN ||
        role === APPCONSTANTS.ROLES.SUPER_USER)
    ) {
      redirectTo = PROTECTED_ROUTES.chiefdomByDistrict
        .replace(':districtId', districtId)
        .replace(':tenantId', tenantId);
    } else {
      redirectTo = PROTECTED_ROUTES.chiefdomDashboard;
    }
    history.push(redirectTo);
  };

  /**
   * Resets the state of form fields that contain a specified substring in their key.
   *
   * @param {string} subStrOfKey - The substring to match in field keys.
   * @param {object} state - The current state of the form, containing field data.
   * @param {Tools<IChiefdomFormValues>} utils - Utility functions for managing form state.
   */
  const resetFields = ([subStrOfKey]: [string], state: any, utils: Tools<IChiefdomFormValues>) => {
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
   * Handles the form submission for creating or updating an chiefdom.
   *
   * @param {IChiefdomFormValues} formValues - The form values containing the chiefdom and user data.
   */

  const onSubmit = ({ chiefdom: { district, ...chiefdom }, users, village }: IChiefdomFormValues) => {
    const payload = {
      ...chiefdom,
      name: chiefdom.name.trim(),
      villages: village?.map((e: string) => ({ name: e })) || [],
      users: getAdminPayload({ userFormData: users, appTypes, isFromList: false, countryId: countryIdValue }),
      countryId: countryIdValue,
      districtId: Number(district?.id) || Number(districtId),
      parentOrganizationId: districtId ? Number(tenantId) : Number(district?.tenantId),
      tenantId: (districtId ? tenantId : district?.tenantId) as string
    };
    dispatch(
      createChiefdomRequest({
        payload,
        successCb: () => {
          navigateBack();
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_CREATION_SUCCESS, chiefdomSName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_CREATION_FAIL, chiefdomSName)
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
        render={({ handleSubmit, form }: FormRenderProps<IChiefdomFormValues>) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className='row g-1dot25'>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${chiefdomSName} Details`} icon={ChiefdomFormIcon}>
                    <ChiefdomForm form={form} nestingKey='chiefdom' />
                  </FormContainer>
                </div>
                <div className='col-lg-6 col-12'>
                  <FormContainer label={`${chiefdomSName} Admin`} icon={ChiefdomAdminFormIcon}>
                    <UserForm
                      form={form}
                      countryId={countryIdValue}
                      defaultSelectedRole={APPCONSTANTS.ROLES.CHIEFDOM_ADMIN}
                      enableAutoPopulate={true}
                      userFormParams={{ isCreateChiefdom: true, isAdminForm: true }}
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

export default CreateChiefdom;
