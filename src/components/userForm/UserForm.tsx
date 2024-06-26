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
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  clearSupervisorList,
  clearVillageHFList,
  fetchCountryListRequest,
  fetchHFListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListFromHFRequest
} from '../../store/healthFacility/actions';
import {
  countryListSelector,
  countryLoadingSelector,
  healthFacilityListSelector,
  healthFacilityLoadingSelector,
  peerSupervisorListSelector,
  peerSupervisorLoadingSelector,
  villagesFromHFListSelector,
  villagesFromHFLoadingSelector
} from '../../store/healthFacility/selectors';
import { IHealthFacility, IPeerSupervisor, IVillages } from '../../store/healthFacility/types';
import PhoneNumberField from '../formFields/PhoneNumber';

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
  autoFetchedDataState?: { autoFetchData: any[]; setAutoFetchData: React.Dispatch<React.SetStateAction<any[]>> };
  autoFetchedState?: { autoFetch: any[]; setAutoFetchState: React.Dispatch<React.SetStateAction<boolean[]>> };
  chwState?: { isCHWUser: boolean[]; setUserAsCHW: React.Dispatch<React.SetStateAction<boolean[]>> };
  disabledRolesState?: {
    disabledRoles: IRoles[][];
    setDisabledRoles: React.Dispatch<React.SetStateAction<IRoles[][]>>;
  };
  mandatoryRolesState?: {
    mandatoryRoles: IRoles[][];
    setMandatoryRoles: React.Dispatch<React.SetStateAction<IRoles[][]>>;
  };

  roleOptionsState?: React.MutableRefObject<IRoles[][]>;
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
  data = [],
  autoFetchedDataState,
  autoFetchedState,
  chwState,
  disabledRolesState,
  roleOptionsState
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
  const countryList = useSelector(countryListSelector);
  const isCountryListLoading = useSelector(countryLoadingSelector);
  const [peerSupervisors, setPeerSupervisors] = useState([[...peerSupervisorList.list]] as IPeerSupervisor[][]);
  const [villages, setVillages] = useState([[...villagesList.list]] as IVillages[][]);

  const [autoFetchData, setAutoFetchData] = useState(autoFetchedDataState?.autoFetchData || ([] as any[]));
  const [isCHWUser, setUserAsCHW] = useState(chwState?.isCHWUser || [false]);
  const roleOptions = useRef<IRoles[][]>(roleOptionsState?.current || []);
  const disabledRoles = useRef<IRoles[][]>(disabledRolesState?.disabledRoles || ([] as IRoles[][]));
  const [autoFetched, setAutoFetched] = useState<boolean[]>(autoFetchedState?.autoFetch || ([] as boolean[]));
  const fetchedData = useRef([] as any[]);
  const [clearEmail, setClearEmail] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showHealthFacilityInput, setShowHealthFacilityInput] = useState(false);  

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
        suiteAccess: [],
        roles: [],
        villages: [],
        supervisor: '',
        organizations: [],
        country: ''
      }
    ],
    []
  );

  useEffect(()=> {
    if (!isHF && isEdit) {
      const roleValues = initialEditValue.role;
      if (!isSuperAdmin) {
        setIsSuperAdmin(roleValues?.some((element: any) => element.name === 'SUPER_ADMIN'));
      }
    }
  },[initialEditValue, isHF, isEdit, isSuperAdmin]);

  useEffect(() => {
    return () => {
      if (autoFetchedState) {
        autoFetchedState.setAutoFetchState(autoFetched);
      }
      if (chwState) {
        chwState.setUserAsCHW(isCHWUser);
      }
      if (disabledRolesState) {
        setTimeout(() => {
          disabledRolesState.setDisabledRoles(disabledRoles.current);
        }, 0);
      }
      if (roleOptionsState) {
        roleOptionsState.current = roleOptions.current;
      }
    };
  }, [
    autoFetchData,
    autoFetched,
    autoFetchedState,
    chwState,
    disabledRoles,
    disabledRolesState,
    isCHWUser,
    roleOptionsState
  ]);

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
      disabledRoles.current = [];
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = false;
      setAutoFetched(newAutoFetched);
    },
    [form.mutators, initialValue, autoFetched]
  );

  const SuperAdminToPeerSuperviserFn = useCallback(
    (roles: IRoles[]) => {
      if (isSuperAdmin && roles?.some((element: any) => element.name !== 'SUPER_ADMIN')) {
        if (healthFacilityList?.length === 0 ) {
          dispatch(
            fetchHFListRequest({
              countryId,
              skip: 0,
              limit: null,
              userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER)
            }));
        }
        setShowHealthFacilityInput(true);
      } else {
        setShowHealthFacilityInput(false);
      }
    },
    [isSuperAdmin, countryId, dispatch, role, healthFacilityList?.length]
  );

  useEffect(() => {
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoPopulateUserData = (user: any, index: number) => {
    const userData = {
      ...user
    };
    userData.suiteAccess = userData.roles[0];
    userData.role = (userData.roles || []).filter((r: IRoles) => r.groupName === userData.suiteAccess.groupName) || [];
    const emailDisabledFn = (errorMsg: string) => {
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = false;
      setAutoFetched(newAutoFetched);
      setClearEmail(true);
      form.change(`${formName}[${index}].username`, '');
      toastCenter.error(...getErrorToastArgs(new Error(), APPCONSTANTS.OOPS, errorMsg));
    };
    if (isRoleExists(userData.role, ['SUPER_ADMIN', 'SUPER_USER'])) {
      emailDisabledFn(APPCONSTANTS.SUPER_ADMIN_USER_EXCEPTION_HF_CREATE);
    } else if (isCHWSelected(userData.role) && isHFCreate) {
      emailDisabledFn(APPCONSTANTS.CHW_USER_EXCEPTION_HF_CREATE);
    } else {
      setClearEmail(false);
      const allSuiteAccess = userData.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
      userData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      userData.role = userData.roles.filter((r: IRoles) => r.groupName === 'SPICE') || [];
      userData.spiceInsightsRole = userData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
      userData.supervisor = {
        ...userData.supervisor,
        name: `${userData.supervisor?.firstName || ''} ${userData.supervisor?.lastName || ''}`
      };
      userData.selectedRoles = [...(userData.roles || [])];
      userData.selectedVillages = [...(Array.isArray(userData.villages) ? userData.villages : [])];
      if (userData.organizations.length === 1) {
        const { formDataId: id, name } = userData.organizations[0];
        userData.healthFacility = { id, name };
      }
      form.batch(() => {
        form.change(`${formName}[${index}].id`, userData.id || '');
        form.change(`${formName}[${index}].suiteAccess`, userData.suiteAccess || null);
        form.change(`${formName}[${index}].role`, userData.role || []);
        form.change(`${formName}[${index}].roles`, userData.roles || []);
        form.change(`${formName}[${index}].spiceInsightsRole`, userData.spiceInsightsRole || []);
        form.change(`${formName}[${index}].selectedRoles`, userData.selectedRoles || []);
        form.change(`${formName}[${index}].firstName`, userData?.firstName || '');
        form.change(`${formName}[${index}].lastName`, userData.lastName || '');
        form.change(`${formName}[${index}].gender`, userData.gender || '');
        form.change(`${formName}[${index}].country`, userData.country || null);
        form.change(`${formName}[${index}].countryCode`, userData.countryCode || '');
        form.change(`${formName}[${index}].phoneNumber`, userData.phoneNumber || '');
        form.change(`${formName}[${index}].healthFacility`, userData.healthFacility || null);
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
      isCHWUserSelectedFn(userData.role, index);
      updateRoleOptionsAndDisableRoles(index, userData.roles);
      if (isCHWSelected(userData.roles)) {
        const tenantIds = [...userData.organizations.map((v: any) => v.id), hfTenantId].filter((v: any) => v);
        fetchListWithConditions(selectedRoles(index), tenantIds, 'village', index);
        fetchListWithConditions(selectedRoles(index), tenantIds, 'supervisor', index);
      }
    }
  };

  useEffect(() => {
    if (!countryList.length) {
      dispatch(fetchCountryListRequest());
    }
  }, [countryList.length, dispatch]);

  useEffect(() => {
    if (!rolesGrouped?.hasOwnProperty('SPICE') && !isProfile) {
      dispatch(
        fetchUserRolesAction({
          countryId,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [countryId, dispatch, isProfile, rolesGrouped]);

  const isError = (meta: any) => (meta.touched && meta.error) || undefined;

  const handleShowAddIcon = (isLastChild: boolean, fields: any, index: number) => {
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
        {handleShowAddIcon(isLastChild, fields, index)}
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

  const mobileRoles = useMemo(() => ['CHW'], []);
  const adminRoles = useMemo(
    () => ['HEALTH_FACILITY_ADMIN', 'PROVIDER', 'MID_WIFE', 'LAB_ASSISTANT', 'SRN', 'SECHN', 'CHA', 'MCHA'],
    []
  );
  const peerSupervisorRoles = useMemo(() => ['PEER_SUPERVISOR'], []);
  const superAdminRoles = useMemo(() => ['SUPER_ADMIN'], []);
  const hfCreateRoles = useMemo(
    () => [
      'HEALTH_FACILITY_ADMIN',
      'PROVIDER',
      'MID_WIFE',
      'LAB_ASSISTANT',
      'SRN',
      'SECHN',
      'CHA',
      'MCHA',
      'PEER_SUPERVISOR'
    ],
    []
  );

  // roles based CHW related utils
  const selectedRoles = useCallback((index: number) => form.getState().values?.users?.[index]?.roles, [form]);
  const isRoleExists = useCallback(
    (roles: IRoles[], validRoles: string[] = mobileRoles) =>
      (roles || []).some((userRole: IRoles) => validRoles.includes(userRole.name)),
    [mobileRoles]
  );
  const isCHWSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => mobileRoles.includes(userRole.name)),
    [mobileRoles]
  );

  const updateRoleOptionsAndDisableRoles = useCallback(
    (index: number, mandatoryRoleOptions?: IRoles[]) => {
      // role options
      const newRoleOptions = [...roleOptions.current];
      if (isHFCreate && (mandatoryRoleOptions ? !isCHWSelected(mandatoryRoleOptions) : true)) {
        newRoleOptions[index] = (rolesGrouped.SPICE || [])
          .filter((r: IRoles) => hfCreateRoles.includes(r.name))
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));
      } else if (isHF) {
        newRoleOptions[index] = (rolesGrouped.SPICE || [])
          .filter((r: IRoles) => r.name !== 'SUPER_ADMIN')
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));
      } else {
        newRoleOptions[index] = (rolesGrouped.SPICE || []).sort((a: any, b: any) =>
          a.displayName > b.displayName ? 1 : -1
        );
      }
      roleOptions.current = newRoleOptions;

      // role disable
      const newDisabledRoles = [...disabledRoles.current];
      let validRoles: string[] = [];
      const selectedAllRoles = [...(selectedRoles(index) || [])];
      if (selectedAllRoles.some((ro: IRoles) => mobileRoles.includes(ro.name))) {
        validRoles = mobileRoles;
      } else if (selectedAllRoles.some((ro: IRoles) => adminRoles.includes(ro.name))) {
        validRoles = adminRoles;
      } else if (selectedAllRoles.some((ro: IRoles) => peerSupervisorRoles.includes(ro.name))) {
        validRoles = peerSupervisorRoles;
      } else if (selectedAllRoles.some((ro: IRoles) => superAdminRoles.includes(ro.name))) {
        validRoles = superAdminRoles;
      } else {
        validRoles = (newRoleOptions[index] || []).map((rr: IRoles) => rr.name) || [];
      }
      newDisabledRoles[index] = [...(newRoleOptions[index] || [])].filter((r: IRoles) => !validRoles.includes(r.name));
      disabledRoles.current = newDisabledRoles;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      adminRoles,
      hfCreateRoles,
      isCHWSelected,
      isHF,
      isHFCreate,
      mobileRoles,
      peerSupervisorRoles,
      rolesGrouped,
      selectedRoles,
      superAdminRoles
    ]
  );

  const isCHWUserSelectedFn = useCallback(
    (roles: IRoles[], index: number) => {
      const newChWStatus = [...isCHWUser];
      newChWStatus[index] = isCHWSelected(roles);
      setUserAsCHW(newChWStatus);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleOptions, roleOptions.current]
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
  const fetchListWithConditions = (roles: IRoles[], tenantIds: number[] = [], name: string, index: number) => {
    if (isCHWSelected(roles) && tenantIds.length) {
      if (name === 'village') {
        return fetchVillagesList(tenantIds, index);
      } else {
        return fetchSupervisorList(tenantIds, index);
      }
    }
  };

  // HF List fetch
  useEffect(() => {
    if (countryId && !isHF && !isEdit) {
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
      fetchListWithConditions(selectedRoles(0), tenantIds, 'village', 0);
      fetchListWithConditions(selectedRoles(0), tenantIds, 'supervisor', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchData]);

  useEffect(() => {
    if (isEdit) {
      isCHWUserSelectedFn(form.getState().values.users[0]?.role, 0);
    }
  }, [form, isCHWUserSelectedFn, isEdit, isProfile, selectedRoles]);

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

  // // Default Role selection
  useEffect(() => {
    const users = form.getState().values?.users;
    if (isHFCreate || isEdit) {
      users.forEach((_: any, index: number) => {
        setTimeout(() => {
          updateRoleOptionsAndDisableRoles(index);
        }, 0);
      });
    }
  }, [autoFetchData, form, isEdit, isHFCreate, updateRoleOptionsAndDisableRoles]);

  return (
    <FieldArray name={formName} initialValue={autoFetchData}>
      {({ fields }) =>
        fields.map((name: string, index: number) => {
          const isLastChild = (fields?.length || 0) === index + 1;
          const emailFieldRef = React.createRef<{ resetEmailField?: () => void }>();
          // SUITE options
          const suiteAccess = Object.keys(rolesGrouped || {})
            .map((userRole: any) => ({ groupName: userRole, id: userRole }))
            .sort((a, b) => (a.groupName > b.groupName ? 1 : -1));
          const {
            selectedRoles: mandatoryRoles = [],
            suiteAccess: formSuiteAccess = [],
            roles: allRoles = [],
            role: spiceRole = [],
            spiceInsightsRole = []
          } = form.getState().values?.users?.[index];
          const isSPICE = (formSuiteAccess || []).some((v: any) => v.groupName === 'SPICE');
          const isSPICEInsights = (formSuiteAccess || []).some((v: any) => v.groupName === 'SPICE INSIGHTS');

          return (
            <span key={`form_${idRefs.current[index]}`}>
              <div className='row gx-1dot25'>
                <Field name={`${name}.id`} render={() => null} />{' '}
                {/** A hidden field to store user id if user is auto populated */}
                <div className='col-sm-12 col-12'>
                  <Field
                    name={`${name}.suiteAccess`}
                    type='text'
                    validate={required}
                    render={({ input, meta }) => (
                      <MultiSelect
                        {...(input as any)}
                        label='SPICE Suite Access'
                        errorLabel='suite access'
                        labelKey='groupName'
                        valueKey='groupName'
                        options={suiteAccess || []}
                        placeholder=''
                        disabled={isProfile || autoFetched[index]}
                        isDisabled={isProfile || autoFetched[index]}
                        loadingOptions={isRolesLoading}
                        isShowLabel={true}
                        error={isError(meta)}
                        isMulti={true}
                        isModel={true}
                        required={true}
                        onChange={(values: any[]) => {
                          const selectedGroupName = values.map((option: any) => option.groupName) || [];
                          if (!selectedGroupName.includes('SPICE INSIGHTS')) {
                            form.change(`${formName}[${index}].spiceInsightsRole`, []);
                            form.change(
                              `${formName}[${index}].roles`,
                              (allRoles || []).filter((v: IRoles) => v.groupName !== 'SPICE INSIGHTS')
                            );
                          }
                          if (!selectedGroupName.includes('SPICE')) {
                            form.change(`${formName}[${index}].role`, []);
                            form.change(
                              `${formName}[${index}].roles`,
                              (allRoles || []).filter((v: IRoles) => v.groupName !== 'SPICE')
                            );
                          }
                          isCHWUserSelectedFn(spiceRole, index);
                          updateRoleOptionsAndDisableRoles(index);
                          input.onChange(values);
                        }}
                      />
                    )}
                  />
                </div>
                {isSPICE && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.role`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label='SPICE Role'
                            errorLabel='Please select at least one role.'
                            labelKey='displayName'
                            valueKey='id'
                            isShowLabel={true}
                            isSelectAll={true}
                            selectAll={false}
                            menuPlacement={'bottom'}
                            isDisabled={isProfile}
                            placeholder=''
                            isModel={true}
                            isMulti={true}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(autoFetched[index] ? mandatoryRoles : []),
                                ...(disabledRoles.current[index] || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            options={roleOptions.current?.[index] || []}
                            mandatoryOptions={autoFetched[index] ? mandatoryRoles : []}
                            disabledOptions={disabledRoles.current[index]}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            onChange={(values: any) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].roles`, [...spiceInsightsRole, ...values]);
                              // User Modified as Peer Superviser from Super Admin
                              SuperAdminToPeerSuperviserFn(values);                              
                              // CHW User selection
                              isCHWUserSelectedFn(values, index);
                              updateRoleOptionsAndDisableRoles(index);
                              // fetch HF list based on CHW selection
                              if (isCHWSelected(values)) {
                                if (!isEdit && !autoFetched[index]) {
                                  // To clear the Selected village during Add User
                                  form.batch(() => {
                                    form.change(`${formName}[${index}].villages`, {});
                                  });
                                }
                                const tenantIds = [
                                  ...(initialEditData[index]?.hfTenantIds || []),
                                  form.getState().values?.users?.[0]?.healthFacility?.tenantId,
                                  ...((fetchedData.current[index] || {}).organizations || []).map((v: any) => v.id),
                                  hfTenantId
                                ].filter((v: number) => v);
                                fetchListWithConditions(selectedRoles(index), tenantIds, 'village', index);
                                fetchListWithConditions(selectedRoles(index), tenantIds, 'supervisor', index);
                              }
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isSPICEInsights && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.spiceInsightsRole`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label='SPICE Insights Role'
                            errorLabel='Please select at least one role.'
                            labelKey='displayName'
                            valueKey='id'
                            isShowLabel={true}
                            isSelectAll={true}
                            selectAll={false}
                            menuPlacement={'bottom'}
                            isDisabled={isProfile}
                            placeholder=''
                            isModel={true}
                            isMulti={true}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(autoFetched[index] ? mandatoryRoles : []),
                                ...(disabledRoles.current[index] || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            options={rolesGrouped['SPICE INSIGHTS'] || []}
                            mandatoryOptions={autoFetched[index] ? mandatoryRoles : []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceInsightsRole?.length}
                            onChange={(values: any) => {
                              form.change(`${formName}[${index}].roles`, [...spiceRole, ...values]);
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {(formSuiteAccess || []).length === 1 && <div className='col-sm-6 col-12' />}
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
                <div className={`col-12`}>
                  <EmailField
                    ref={emailFieldRef}
                    formName={formName}
                    index={index}
                    name={name}
                    isEdit={isEdit}
                    form={form}
                    isDisabled={autoFetched[index]}
                    entityName={entityName}
                    clearEmail={clearEmail}
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
                        appendPlus={true}
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
                {((!isHFCreate &&
                  !isHF &&
                  !isEdit &&
                  !(form.getState().values.users[index].roles || []).some((userRole: IRoles) =>
                    [APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(userRole.name)
                  )) || showHealthFacilityInput) && (
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
                                form.change(`${formName}[${index}].supervisor`, null);
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
                                label='Select Peer Supervisor'
                                errorLabel='select peer supervisor'
                                labelKey='name'
                                valueKey='id'
                                disabled={isProfile}
                                menuPlacement={'auto'}
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
                            validate={(value) => required(Array.isArray(value) ? value : [])}
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
                                  isDefaultSelected={true}
                                  placeholder=''
                                  menuPlacement={'auto'}
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
