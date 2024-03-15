import { FormApi } from 'final-form';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import TextInput from '../formFields/TextInput';
import {
  composeValidators,
  required,
  validateName,
  validateLastName,
  normalizePhone,
  validateMobile,
  convertToNumber
} from '../../utils/validation';
import BinIcon from '../../assets/images/bin.svg';
import ResetIcon from '../../assets/images/reset.svg';
import Radio from '../formFields/Radio';
import SelectInput from '../formFields/SelectInput';
import APPCONSTANTS from '../../constants/appConstants';
import PlusIcon from '../../assets/images/plus_blue.svg';
import EmailField from '../formFields/EmailField';
import { IUser } from '../../store/user/types';
import MultiSelect from '../multiSelect/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import { isUserRolesLoading, userRolesSelector } from '../../store/user/selectors';
import { fetchUserRolesAction } from '../../store/user/actions';
import toastCenter from '../../utils/toastCenter';
import { fetchHFListRequest, fetchPeerSupervisorListRequest } from '../../store/healthFacility/actions';
import { healthFacilityListSelector, healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';
import { IObjectData } from '../../store/healthFacility/types';

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

interface IUserFormProps {
  form: FormApi<any>;
  initialEditValue?: any;
  disableOptions?: boolean;
  isEdit?: boolean;
  isHF?: boolean;
  isHFCreate?: boolean;
  isRegionUser?: boolean;
  account?: { id: string; tenantId: string };
  isDropdownDisable?: boolean;
  entityName?: string;
  enableAutoPopulate?: boolean;
  data?: any[];
  countryId: number;
}

/**
 * Form for region admin creation
 * @param param0
 * @returns {React.ReactElement}
 */
const UserForm = ({
  form,
  initialEditValue,
  disableOptions = false,
  isEdit,
  isHF = false,
  isHFCreate = false,
  isDropdownDisable = false,
  entityName,
  enableAutoPopulate,
  countryId,
  data = []
}: IUserFormProps): React.ReactElement => {
  const idRefs = useRef([new Date().getTime()]);
  const formName = 'users';
  const dispatch = useDispatch();
  const rolesGrouped = useSelector(userRolesSelector);
  const isRolesLoading = useSelector(isUserRolesLoading);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const hfLoading = useSelector(healthFacilityLoadingSelector);

  const initialValue = useMemo<Array<Partial<any>>>(
    // memoizing the initial value to prevent infinite render cycles
    () => [
      {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        username: '',
        countryCode: '',
        roles: [],
        villageIds: [],
        supervisor: '',
        organizations: [],
        country: {}
      }
    ],
    []
  );

  const isFormInvalid = form?.getState()?.errors?.[formName]?.length;
  const initialEditData = useMemo<Array<Partial<any>>>(
    () => [
      {
        ...initialEditValue,
        hfTenantIds: isEdit ? (initialEditValue.organizations || []).map((org: any) => org.id) : [],
        hfIds: isEdit ? (initialEditValue.organizations || []).map((org: any) => org.formDataId) : {}
      }
    ],
    [initialEditValue, isEdit]
  );
  const resetAdminForm = useCallback(
    (fields, index: number) => {
      form.mutators?.resetFields?.(`${formName}[${index}]`);
      fields.update(index, { ...initialValue[0] });
    },
    [initialValue, form.mutators]
  );

  const formatCountryCode = (value: string) => (value ? `+${value}` : '');

  const [autoFetched, setAutoFetched] = useState<boolean[]>([]);

  const autoPopulateUserData = (user: any, index: number) => {
    const userData = {
      ...user
    };
    form.batch(() => {
      form.change(`${formName}[${index}].id`, userData.id);
      form.change(`${formName}[${index}].suiteAccess`, userData.suiteAccess);
      form.change(`${formName}[${index}].role`, userData.role);
      form.change(`${formName}[${index}].firstName`, userData.firstName);
      form.change(`${formName}[${index}].lastName`, userData.lastName);
      form.change(`${formName}[${index}].gender`, userData.gender);
      form.change(`${formName}[${index}].phoneNumber`, userData.phoneNumber);
      form.change(`${formName}[${index}].assignedHealthFacility`, userData.assignedHealthFacility);
      form.change(`${formName}[${index}].selectedPeerSupervisor`, userData.selectedPeerSupervisor);
      form.change(`${formName}[${index}].assignedVillages`, userData.assignedVillages);
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = true;
      setAutoFetched(newAutoFetched);
    });
  };

  useEffect(() => {
    if (!rolesGrouped.hasOwnProperty('SPICE')) {
      dispatch(
        fetchUserRolesAction({
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [dispatch, rolesGrouped]);

  const isError = (meta: any) => (meta.touched && meta.error) || undefined;

  const handleShowAddIcon = (isLastChild: boolean, fields: any) => {
    return (
      isLastChild && (
        <div
          className={`theme-text lh-1dot25 pointer d-flex align-items-center ${isFormInvalid ? 'not-allowed' : ''}`}
          onClick={
            isFormInvalid
              ? undefined
              : () => {
                  idRefs.current.push(new Date().getTime());
                  fields.push({ ...initialValue[0] });
                }
          }
        >
          <img className='me-0dot5' src={PlusIcon} alt='' />
          {'Add Another User'}
        </div>
      )
    );
  };

  const handleShowRemoveIcon = (fields: any, index: number) => {
    return (
      Number(fields?.length) > 1 && (
        <div
          className='danger-text lh-1dot25 pointer'
          onClick={() => {
            const newAutoFetched = [...autoFetched];
            newAutoFetched.splice(index, 1);
            setAutoFetched(newAutoFetched);
            idRefs.current = idRefs.current.filter((id) => idRefs.current[index] !== id);
            fields.remove(index);
          }}
        >
          <img className='me-0dot5' src={BinIcon} alt='' />
          {'Remove User'}
        </div>
      )
    );
  };

  const actionButtons = (fields: any, index: number, isLastChild: boolean, emailFieldRef: any) =>
    !disableOptions && (
      <div className={`col-12 d-flex justify-content-between mt-0dot5 ${isLastChild ? '' : 'mb-2'}`}>
        {handleShowAddIcon(isLastChild, fields)}
        {handleShowRemoveIcon(fields, index)}
        <div
          className='theme-text lh-1dot25 pointer'
          onClick={() => {
            const newAutoFetched = [...autoFetched];
            newAutoFetched[index] = false;
            setAutoFetched(newAutoFetched);
            emailFieldRef.current?.resetEmailField?.();
            resetAdminForm(fields, index);
          }}
        >
          <img className='me-0dot5' src={ResetIcon} alt='' />
          Reset Fields
        </div>
      </div>
    );

  const divider = (isLastChild: boolean) => {
    return !isLastChild && <div className='divider mx-neg-1dot25 mb-1dot5' />;
  };

  const peerSupervisorList = [{ name: 'Peer Supervisor 1', id: '1' }];
  const peerSupervisorLoading = false;
  const villageList = [{ name: 'Peer Supervisor 1', id: '1' }];
  const isVillageListLoading = false;
  const countryList = [{ countryCode: '232' }, { countryCode: '91' }, { countryCode: '+21' }];
  const isCountryListLoading = false;

  useEffect(() => {
    if (countryId && healthFacilityList.length) {
      dispatch(fetchHFListRequest({ countryId, skip: 0, limit: null }));
    }
  }, [countryId, dispatch, healthFacilityList.length]);

  // Peer Supervisor fetch
  useEffect(() => {
    if (isEdit) {
      const tenantIds = initialEditData[0].hfTenanatIds;
      if (tenantIds && !peerSupervisorList.length) {
        dispatch(fetchPeerSupervisorListRequest({ tenantIds }));
      }
    }
  }, [dispatch, initialEditData, isEdit, peerSupervisorList.length]);

  return (
    <FieldArray name={formName} initialValue={isEdit ? initialEditData : data.length ? data : initialValue}>
      {({ fields }) =>
        fields.map((name, index) => {
          const isLastChild = (fields?.length || 0) === index + 1;
          const isFirstChild = !index;
          const emailFieldRef = React.createRef<{ resetEmailField?: () => void }>();
          const suiteAccess = Object.keys(rolesGrouped)
            .map((role) => ({ name: role, id: role }))
            .sort();
          return (
            <span key={`form_${idRefs.current[index]}`}>
              <div className='row gx-1dot25'>
                <Field name={`${name}._id`} render={() => null} />{' '}
                {/** A hidden field to store user' id if user is auto populated */}
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.suiteAccess`}
                    type='text'
                    validate={required}
                    render={({ input, meta }) => (
                      <SelectInput
                        {...(input as any)}
                        label='SPICE Suite Access'
                        errorLabel='suite access'
                        labelKey='name'
                        valueKey='id'
                        defaultValue={(suiteAccess || []).find(
                          (value) => value?.name === (isEdit ? initialEditData : data)[index]?.roles[0]?.groupName
                        )}
                        options={suiteAccess || []}
                        loadingOptions={isRolesLoading}
                        error={isError(meta)}
                        isModel={true}
                      />
                    )}
                  />
                </div>
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.roles`}
                    type='text'
                    validate={required}
                    render={({ input, meta }) => {
                      const selectedSuiteAccess = form.getState().values.users[index]?.suiteAccess?.id;
                      const roles = rolesGrouped[selectedSuiteAccess] || [];
                      return (
                        <SelectInput
                          {...(input as any)}
                          label='Role'
                          errorLabel='role'
                          labelKey='displayName'
                          valueKey='id'
                          options={roles || []}
                          defaultValue={(roles || []).find(
                            (value) => value.id === (isEdit ? initialEditData : data)[index]?.roles[0]?.id
                          )}
                          loadingOptions={isRolesLoading}
                          error={isError(meta)}
                          isModel={true}
                        />
                      );
                    }}
                  />
                </div>
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.firstName`}
                    type='text'
                    validate={composeValidators(required, validateName)}
                    render={({ input, meta }) => (
                      <TextInput
                        {...input}
                        label='First Name'
                        errorLabel='first name'
                        maxLength={APPCONSTANTS.FIRST_NAME_LENGTH}
                        capitalize={true}
                        error={isError(meta)}
                      />
                    )}
                  />
                </div>
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.lastName`}
                    type='text'
                    validate={composeValidators(required, validateLastName)}
                    render={({ input, meta }) => (
                      <TextInput
                        {...input}
                        label='Last Name'
                        errorLabel='last name'
                        maxLength={APPCONSTANTS.LAST_NAME_LENGTH}
                        capitalize={true}
                        error={isError(meta)}
                      />
                    )}
                  />
                </div>
                <div className='col-12'>
                  <Field
                    name={`${name}.gender`}
                    render={(props) => (
                      <Radio {...props} fieldLabel='Gender' errorLabel='gender' options={APPCONSTANTS.GENDER_OPTIONS} />
                    )}
                  />
                </div>
                <div className={`col-12 ${isFirstChild ? '' : 'mt-1dot5'}`}>
                  <EmailField
                    ref={emailFieldRef}
                    formName={formName}
                    index={index}
                    name={name}
                    isEdit={isEdit}
                    form={form}
                    entityName={entityName}
                    enableAutoPopulate={enableAutoPopulate}
                    onFindExistingUser={(user: IUser) => autoPopulateUserData(user, index)}
                  />
                </div>
                {isDropdownDisable ? (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.countryCode`}
                      type='text'
                      validate={required}
                      parse={convertToNumber}
                      format={(value: string) => formatCountryCode(value)}
                      render={({ input, meta }) => (
                        <TextInput {...input} label='Country Code' errorLabel='country code' error={isError(meta)} />
                      )}
                    />
                  </div>
                ) : (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.countryCode`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => (
                        <SelectInput
                          {...(input as any)}
                          label='Country Code'
                          errorLabel='country code'
                          labelKey='countryCode'
                          valueKey='countryCode'
                          appendPlus={true}
                          options={countryList}
                          defaultValue={countryList.find(
                            (value) => value.countryCode === (isEdit ? initialEditData : data)[index]?.countryCode
                          )}
                          loadingOptions={isCountryListLoading}
                          error={isError(meta)}
                          isModel={true}
                        />
                      )}
                    />
                  </div>
                )}
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.phoneNumber`}
                    type='text'
                    validate={composeValidators(required, validateMobile)}
                    parse={normalizePhone}
                    render={({ input, meta }) => (
                      <TextInput {...input} label='Phone Number' errorLabel='phone number' error={isError(meta)} />
                    )}
                  />
                </div>
                {!isHFCreate && !isHF && !isEdit && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.assignedHealthFacility`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => (
                        <SelectInput
                          {...(input as any)}
                          label='Assigned Health Facility'
                          errorLabel='assigned health facility'
                          labelKey='name'
                          valueKey='id'
                          options={healthFacilityList}
                          defaultValue={healthFacilityList.find(
                            (value: IObjectData) =>
                              value.name === (isEdit ? initialEditData : data)[index]?.assignedHealthFacility?.name
                          )}
                          loadingOptions={hfLoading}
                          error={isError(meta)}
                          isModel={true}
                        />
                      )}
                    />
                  </div>
                )}
                {((isHF && isEdit) || !isHFCreate) && (
                  <>
                    <div className='col-sm-6 col-12'>
                      <Field
                        name={`${name}.supervisor`}
                        type='text'
                        validate={required}
                        render={({ input, meta }) => (
                          <SelectInput
                            {...(input as any)}
                            {...(meta as any)}
                            label='Selected Peer Supervisor'
                            errorLabel='selected peer supervisor'
                            labelKey='name'
                            valueKey='id'
                            options={peerSupervisorList}
                            defaultValue={(peerSupervisorList || []).find(
                              (value: any) =>
                                value.name === (isEdit ? initialEditData : data)[index]?.selectedPeerSupervisor
                            )}
                            loadingOptions={peerSupervisorLoading}
                            error={isError(meta)}
                            isModel={true}
                          />
                        )}
                      />
                    </div>
                    <div className='col-sm-6 col-12'>
                      <Field
                        name={`${name}.assignedVillages`}
                        type='text'
                        validate={required}
                        render={({ input, meta }) => (
                          <MultiSelect
                            {...(input as any)}
                            label='Assigned Villages'
                            errorLabel='assigned villages'
                            labelKey='name'
                            valueKey='id'
                            required={true}
                            isShowLabel={true}
                            isSelectAll={true}
                            menuPlacement={'bottom'}
                            isModel={true}
                            isMulti={true}
                            options={villageList}
                            loadingOptions={isVillageListLoading}
                            error={isError(meta)}
                          />
                        )}
                      />
                    </div>
                  </>
                )}
                {actionButtons(fields, index, isLastChild, emailFieldRef)}
              </div>
              {divider(isLastChild)}
            </span>
          );
        })
      }
    </FieldArray>
  );
};

export default UserForm;
