import { FormApi } from 'final-form';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import TextInput from '../formFields/TextInput';
import { composeValidators, required, validateName, validateLastName } from '../../utils/validation';
import BinIcon from '../../assets/images/bin.svg';
import ResetIcon from '../../assets/images/reset.svg';
import Radio from '../formFields/Radio';
import SelectInput from '../formFields/SelectInput';
import APPCONSTANTS from '../../constants/appConstants';
import PlusIcon from '../../assets/images/plus_blue.svg';
import EmailField from '../formFields/EmailField';
import { IRoles, IUser } from '../../store/user/types';
import MultiSelect from '../multiSelect/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import { isUserRolesLoading, roleSelector, userRolesSelector } from '../../store/user/selectors';
import { fetchUserRolesAction } from '../../store/user/actions';
import toastCenter from '../../utils/toastCenter';
import {
  fetchHFListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListFromHFRequest
} from '../../store/healthFacility/actions';
import {
  healthFacilityListSelector,
  healthFacilityLoadingSelector,
  peerSupervisorListSelector,
  peerSupervisorLoadingSelector,
  villagesFromHFListSelector,
  villagesFromHFLoadingSelector
} from '../../store/healthFacility/selectors';
import { IHealthFacility, IPeerSupervisor, IUserRole, IVillages } from '../../store/healthFacility/types';
import PhoneNumberField from '../formFields/PhoneNumberField';

interface IUserFormProps {
  form: FormApi<any>;
  initialEditValue?: any;
  disableOptions?: boolean;
  isProfile?: boolean;
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
  hfTenantId?: number;
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
  isProfile = false,
  isEdit,
  isHF = false,
  isHFCreate = false,
  entityName,
  enableAutoPopulate,
  countryId,
  hfTenantId,
  data = []
}: IUserFormProps): React.ReactElement => {
  const idRefs = useRef([new Date().getTime()]);
  const formName = 'users';
  const dispatch = useDispatch();
  const rolesGrouped = useSelector(userRolesSelector);
  const isRolesLoading = useSelector(isUserRolesLoading);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const hfLoading = useSelector(healthFacilityLoadingSelector);
  const peerSupervisorList = useSelector(peerSupervisorListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const villagesList = useSelector(villagesFromHFListSelector);
  const villagesLoading = useSelector(villagesFromHFLoadingSelector);
  const role = useSelector(roleSelector);
  const [peerSupervisors, setPeerSupervisors] = useState([[...peerSupervisorList.list]] as IPeerSupervisor[][]);
  const [villages, setVillages] = useState([[...villagesList.list]] as IVillages[][]);

  const [autoFetchData, setAutoFetchData] = useState([] as any[]);
  const [isCHWUser, setUserAsCHW] = useState([false]);
  const roleOptions = useRef<IRoles[][]>([]);

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
        villages: [],
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
        hfTenantIds: isEdit ? (initialEditValue?.organizations || []).map((org: any) => org.id) : []
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

  const [autoFetched, setAutoFetched] = useState<boolean[]>([]);
  const fetchedData = useRef([] as any[]);

  const autoPopulateUserData = (user: any, index: number) => {
    const userData = {
      ...user
    };
    userData.suiteAccess = userData.roles[0];
    userData.role = (userData.roles || []).filter((r: IRoles) => r.groupName === userData.suiteAccess.groupName) || [];
    userData.selectedRoles = [...(userData.roles || [])];
    userData.selectedVillages = [...(Array.isArray(userData.villages) ? userData.villages : [])];
    form.batch(() => {
      form.change(`${formName}[${index}].id`, userData.id || '');
      form.change(`${formName}[${index}].suiteAccess`, userData.suiteAccess || null);
      form.change(`${formName}[${index}].role`, userData.role || []);
      form.change(`${formName}[${index}].roles`, userData.roles || []);
      form.change(`${formName}[${index}].selectedRoles`, userData.selectedRoles || []);
      form.change(`${formName}[${index}].firstName`, userData?.firstName || '');
      form.change(`${formName}[${index}].lastName`, userData.lastName || '');
      form.change(`${formName}[${index}].gender`, userData.gender || '');
      form.change(`${formName}[${index}].country`, userData.country || {});
      form.change(`${formName}[${index}].countryCode`, userData.countryCode || '');
      form.change(`${formName}[${index}].phoneNumber`, userData.phoneNumber || '');
      form.change(`${formName}[${index}].supervisor`, userData.supervisor || '');
      form.change(`${formName}[${index}].villages`, userData.villages || []);
      form.change(`${formName}[${index}].organizations`, userData.organizations || []);
      form.change(`${formName}[${index}].selectedVillages`, userData.selectedVillages || []);
    });
    const newAutoFetched = [...autoFetched];
    newAutoFetched[index] = true;
    setAutoFetched(newAutoFetched);
    const newFetchedData = [...fetchedData.current];
    newFetchedData[index] = userData;
    fetchedData.current = newFetchedData;
    roleOptionSelection(userData.suiteAccess.groupName, index, userData.roles);
    isCHWUserSelectedFn(userData.role, index);
    if (isCHWSelected(userData.roles)) {
      const tenantIds = [...userData.organizations.map((v: any) => v.id), hfTenantId].filter((v: any) => v);
      fetchListWithConditions(selectedRoles(index), tenantIds, villagesList, 'village', index);
      fetchListWithConditions(selectedRoles(index), tenantIds, villagesList, 'supervisor', index);
    }
  };

  useEffect(() => {
    if (!rolesGrouped?.hasOwnProperty('SPICE') && !isProfile) {
      dispatch(
        fetchUserRolesAction({
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [dispatch, isProfile, rolesGrouped]);

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

  const countryList = [{ phoneNumberCode: '232', id: '232' }];
  const isCountryListLoading = false;

  // roles based CHW related utils
  const selectedRoles = useCallback((index: number) => form.getState().values.users[index]?.roles, [form]);
  const isCHWSelected = (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => userRole.name === 'CHW');
  const isCHWUserSelectedFn = useCallback(
    (roles: IRoles[], index: number) => {
      const newChWStatus = [...isCHWUser];
      newChWStatus[index] = isCHWSelected(roles);
      setUserAsCHW(newChWStatus);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Peer Supervisor fetch
  const fetchSupervisorList = useCallback(
    (tenantIds: number[], index: number) => {
      dispatch(
        fetchPeerSupervisorListRequest({
          tenantIds,
          successCb: ({ list }: { list: IPeerSupervisor[] }) => {
            const newSupervisors = [...peerSupervisors];
            newSupervisors[index] = list;
            setPeerSupervisors(newSupervisors);
          }
        })
      );
    },
    [dispatch, peerSupervisors]
  );
  // Villages fetch
  const fetchVillagesList = useCallback(
    (tenantIds: number[], index: number) => {
      dispatch(
        fetchVillagesListFromHFRequest({
          tenantIds,
          successCb: ({ list }: { list: IVillages[] }) => {
            const newVillages = [...villages];
            newVillages[index] = list;
            setVillages(newVillages);
          }
        })
      );
    },
    [dispatch, villages]
  );

  // Common function for the supervisor and village list fetch with conditions
  const fetchListWithConditions = (
    roles: IRoles[],
    tenantIds: number[] = [],
    listData: any = { list: [], hfTenantIds: [] },
    name: string,
    index: number
  ) => {
    const isTenantChanged =
      tenantIds.length >= (listData.hfTenantIds || []).length &&
      tenantIds.some((id: number) => !(listData.hfTenantIds || []).includes(id));
    if (isCHWSelected(roles) && tenantIds.length && (!listData.list.length || isTenantChanged)) {
      if (name === 'village') {
        return fetchVillagesList(tenantIds, index);
      } else {
        return fetchSupervisorList(tenantIds, index);
      }
    }
  };

  // HF List fetch
  useEffect(() => {
    if (countryId && !isHF && !isEdit && !healthFacilityList.length) {
      dispatch(
        fetchHFListRequest({
          countryId,
          skip: 0,
          limit: null,
          userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER)
        })
      );
    }
  }, [countryId, dispatch, healthFacilityList?.length, isEdit, isHF, role]);

  useEffect(() => {
    if (isEdit && !isProfile) {
      const tenantIds = [...initialEditData[0].hfTenantIds, hfTenantId].filter((v: number) => v);
      fetchListWithConditions(selectedRoles(0), tenantIds, villagesList, 'village', 0);
      fetchListWithConditions(selectedRoles(0), tenantIds, peerSupervisorList, 'supervisor', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEdit) {
      isCHWUserSelectedFn(form.getState().values.users[0]?.role, 0);
    }
  }, [form, isCHWUserSelectedFn, isEdit, isProfile, selectedRoles]);

  const roleOptionSelection = useCallback(
    (suite: string, index: number, mandatoryRoles?: IRoles[]) => {
      const newRoleOptions = [...roleOptions.current];
      newRoleOptions[index] =
        isHFCreate && (mandatoryRoles ? !isCHWSelected(mandatoryRoles) : true)
          ? (rolesGrouped[suite] || []).filter((r: IRoles) => r.name !== 'CHW')
          : rolesGrouped?.[suite];
      roleOptions.current = newRoleOptions;
    },
    [isHFCreate, rolesGrouped]
  );

  const initData = useCallback(() => {
    if (isEdit) {
      setAutoFetchData(initialEditData);
    } else if (data.length) {
      setAutoFetchData(data);
    } else {
      setAutoFetchData(initialValue);
    }
  }, [data, initialEditData, initialValue, isEdit]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <FieldArray name={formName} initialValue={autoFetchData}>
      {({ fields }) =>
        fields.map((name: string, index: number) => {
          const isLastChild = (fields?.length || 0) === index + 1;
          const isFirstChild = !index;
          const emailFieldRef = React.createRef<{ resetEmailField?: () => void }>();
          // SUITE options
          const suiteAccess = Object.keys(rolesGrouped || {})
            .map((userRole: any) => ({ groupName: userRole, id: userRole }))
            .sort();
          // Default Role options selection base on SUITE on initial Edit
          if (isEdit && !roleOptions.current[index]) {
            const selectedSuiteAccess = (isEdit ? initialEditData : data.length ? data : initialValue)[index]
              ?.suiteAccess?.groupName;
            roleOptionSelection(selectedSuiteAccess, index);
          }
          return (
            <span key={`form_${idRefs.current[index]}`}>
              <div className='row gx-1dot25'>
                <Field name={`${name}.id`} render={() => null} />{' '}
                {/** A hidden field to store user id if user is auto populated */}
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
                        labelKey='groupName'
                        valueKey='groupName'
                        options={suiteAccess || []}
                        disabled={isProfile}
                        loadingOptions={isRolesLoading}
                        error={isError(meta)}
                        isModel={true}
                        onChange={(value) => {
                          // Role option selection
                          roleOptionSelection(value.groupName, index);
                          // To store ALL ROLES
                          form.change(
                            `${formName}[${index}].role`,
                            selectedRoles(index).filter(
                              (userRole: IUserRole) => userRole.groupName === value.groupName
                            ) || []
                          );
                          // CHW User selection
                          isCHWUserSelectedFn(form.getState().values.users[index].role, index);
                          input.onChange(value);
                        }}
                      />
                    )}
                  />
                </div>
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.role`}
                    type='text'
                    validate={required}
                    render={({ input, meta }) => {
                      const mandatoryRoles = form.getState().values.users[index].selectedRoles || [];
                      return (
                        <MultiSelect
                          {...(input as any)}
                          label='Role'
                          errorLabel='Please select at least one role.'
                          labelKey='displayName'
                          valueKey='id'
                          isShowLabel={true}
                          isSelectAll={true}
                          menuPlacement={'bottom'}
                          isDisabled={isProfile}
                          placeholder=''
                          isModel={true}
                          isMulti={true}
                          isOptionDisabled={(option: any) => {
                            return autoFetched[index]
                              ? (mandatoryRoles || []).map((v: any) => v.id).includes(option.id)
                              : null;
                          }}
                          required={true}
                          options={roleOptions.current?.[index] || []}
                          mandatoryOptions={autoFetched[index] ? mandatoryRoles : []}
                          loading={isRolesLoading}
                          error={isError(meta) && !selectedRoles(index)?.length}
                          onChange={(values: any) => {
                            //  Store ALL ROLES on each update
                            const suiteAccessSelected = form.getState().values.users[index].suiteAccess?.groupName;
                            const remainingRoles = selectedRoles(index).filter(
                              (r: IUserRole) => r.groupName !== suiteAccessSelected
                            );
                            form.change(`${formName}[${index}].roles`, [...remainingRoles, ...values]);
                            // CHW User selection
                            isCHWUserSelectedFn(values, index);
                            // fetch HF list based on CHW selection
                            if (isCHWSelected(values)) {
                              if (!isEdit) {
                                // To clear the Selected village during Add User
                                form.change(`${formName}[${index}].villages`, {});
                              }
                              const tenantIds = [
                                ...initialEditData[index].hfTenantIds,
                                ...((fetchedData.current[index] || {}).organizations || []).map((v: any) => v.id),
                                hfTenantId
                              ].filter((v: number) => v);
                              fetchListWithConditions(selectedRoles(index), tenantIds, villagesList, 'village', index);
                              fetchListWithConditions(
                                selectedRoles(index),
                                tenantIds,
                                peerSupervisorList,
                                'supervisor',
                                index
                              );
                            }
                            input.onChange(values);
                          }}
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
                <div className='col-sm-6 col-12'>
                  <Field
                    name={`${name}.country`}
                    type='text'
                    validate={required}
                    render={({ input, meta }) => (
                      <SelectInput
                        {...(input as any)}
                        label='Country Code'
                        errorLabel='country code'
                        labelKey='phoneNumberCode'
                        valueKey='id'
                        appendPlus={!!input.value}
                        options={countryList || []}
                        loadingOptions={isCountryListLoading}
                        error={isError(meta)}
                        isModel={true}
                      />
                    )}
                  />
                </div>
                <div className='col-sm-6 col-12'>
                  <PhoneNumberField
                    id={form.getState().values.users[index]?.id}
                    fieldName='phoneNumber'
                    form={form}
                    name={name}
                    formName={formName}
                    index={index}
                  />
                </div>
                {!isHFCreate && !isHF && !isEdit && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.healthFacility`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <SelectInput
                            {...(input as any)}
                            label='Assigned Health Facility'
                            errorLabel='assigned health facility'
                            labelKey='name'
                            valueKey='id'
                            options={healthFacilityList}
                            loadingOptions={hfLoading}
                            error={isError(meta)}
                            isModel={true}
                            disabled={isProfile}
                            onChange={(hf: IHealthFacility) => {
                              const formData = form.getState().values.users[index];
                              if (autoFetched[index] && formData?.selectedVillages?.length) {
                                form.change(`${formName}[${index}].villages`, [
                                  ...(Array.isArray(formData?.selectedVillages) ? formData.selectedVillages : [])
                                ]);
                              } else {
                                form.change(`${formName}[${index}].villages`, []);
                              }
                              fetchSupervisorList(
                                [...formData?.organizations.map((v: any) => v.id), hf.tenantId].filter((v: any) => v),
                                index
                              );
                              fetchVillagesList(
                                [...formData?.organizations.map((v: any) => v.id), hf.tenantId].filter((v: any) => v),
                                index
                              );
                              input.onChange(hf);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isCHWUser[index] && (
                  <>
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
                                disabled={isProfile}
                                options={peerSupervisors[index]}
                                loadingOptions={peerSupervisorLoading}
                                error={isError(meta)}
                                isModel={true}
                              />
                            )}
                          />
                        </div>
                        <div className='col-sm-6 col-12'>
                          <Field
                            name={`${name}.villages`}
                            type='text'
                            validate={required}
                            render={({ input, meta }) => {
                              const mandatoryVillages = form.getState().values.users[index].selectedVillages || [];
                              return (
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
                                  isDisabled={isProfile}
                                  isModel={true}
                                  isMulti={true}
                                  isOptionDisabled={(option: any) => {
                                    return autoFetched[index]
                                      ? (mandatoryVillages || []).map((v: any) => v.id).includes(option.id)
                                      : null;
                                  }}
                                  mandatoryOptions={autoFetched[index] ? mandatoryVillages : []}
                                  options={villages[index] || []}
                                  loadingOptions={villagesLoading}
                                  error={isError(meta)}
                                />
                              );
                            }}
                          />
                        </div>
                      </>
                    )}
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
