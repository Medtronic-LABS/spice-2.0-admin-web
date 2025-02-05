import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ReactComponent as BinIcon } from '../../assets/images/bin.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/plus_blue.svg';
import { ReactComponent as ResetIcon } from '../../assets/images/reset.svg';
import APPCONSTANTS, { ADMIN_BASED_ON_URL, NAMING_VARIABLES } from '../../constants/appConstants';
import { hf4ReportUser, INSIGHTS, peerSupervisor, REPORTS, SPICE } from '../../constants/roleConstants';
import { IMatchParams } from '../../containers/user/UserList';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { useRoleMeta } from '../../hooks/roleHook';
import { REGION_ADMIN, REPORT_ADMIN, SUPER_ADMIN, SUPER_USER } from '../../routes';
import { clearChiefdomList, fetchChiefdomListRequest } from '../../store/chiefdom/actions';
import { chiefdomListSelector, chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { clearDistrictList, fetchDistrictListRequest } from '../../store/district/actions';
import { districtLoadingSelector, getDistrictListSelector } from '../../store/district/selectors';
import {
  clearAssignedHFListForHFAdmin,
  clearHFList,
  clearSupervisorList,
  clearVillageHFList,
  fetchCountryListRequest,
  fetchHFListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListUserLinked
} from '../../store/healthFacility/actions';
import {
  assignedHFListForHFAdminSelector,
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
import {
  clearDesignationList,
  fetchCommunityListRequest,
  fetchCultureListRequest,
  fetchDesignationListRequest,
  fetchUserRolesAction
} from '../../store/user/actions';
import {
  communityListSelector,
  cultureListLoadingSelector,
  cultureListSelector,
  designationListSelector,
  isUserRolesLoading,
  roleSelector,
  userRolesSelector
} from '../../store/user/selectors';
import { IRoles, IUser, IUserFormProps } from '../../store/user/types';
import { formatCountryCode, formatUserToastMsg, removeRedRiskFromRoleArray } from '../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  composeValidators,
  convertToNumber,
  required,
  validateCountryCode,
  validateLastName,
  validateName
} from '../../utils/validation';
import EmailField from '../formFields/EmailField';
import PhoneNumberField from '../formFields/PhoneNumber';
import Radio from '../formFields/Radio';
import SelectInput from '../formFields/SelectInput';
import TextInput from '../formFields/TextInput';
import MultiSelect from '../multiSelect/MultiSelect';
import { SiteUserForm } from './userConditionalFields/AdminFields';
import { DynamicCHForm } from './userConditionalFields/DynamicCHForm';
import useUserFormUtils, { filterRolesByAppTypeFn } from './userFormUtils';
import { useRoleOptions } from '../../hooks/roleOptionsHook';

export interface IUserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string | { phoneNumberCode: string; id: string };
  username: string;
  phoneNumber: string;
  timezone: { id: string; description: string };
  gender: string;
  country: { countryCode: string };
  isHF?: boolean;
}

export interface IDisabledRoles {
  [key: string]: IRoles[];
}

export type ModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';

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
  entityName,
  enableAutoPopulate,
  countryId,
  hfTenantId, // tenantId from URL
  appTypes,
  data = [],
  autoFetchedDataState,
  autoFetchedState,
  chwState,
  disabledRolesState,
  roleOptionsState,
  isSiteUser = false,
  defaultSelectedRole,
  parentOrgId,
  ignoreTenantId,
  userFormParams = {}
}: IUserFormProps): React.ReactElement => {
  const {
    isRegionCreate = false,
    isHF = false,
    isHFCreate = false,
    isProfile = false,
    isFromAdminList = false,
    isChiefdom = false,
    isCreateChiefdom = false,
    isCreateDistrict = false,
    isReportOrInsightUser = false, // cfr or insights user only from admin list
    isReportSuperAdmin = false,
    isAdminForm = false
  } = userFormParams;
  const idRefs = useRef([new Date().getTime()]);
  const { pathname } = useLocation();
  const formName = 'users';
  const { tenantId, healthFacilityId } = useParams<IMatchParams>();
  const dispatch = useDispatch();
  const rolesGrouped = useSelector(userRolesSelector);
  const role = useSelector(roleSelector);
  const currentModule: ModuleNames = pathname.split('/')[1];
  let fetchingFor: string;
  if (role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) {
    fetchingFor = role;
  } else {
    fetchingFor = ADMIN_BASED_ON_URL[currentModule];
  }
  const {
    isCHPCHWSelected,
    isRoleExists,
    siteRolesChange,
    getSuiteAccessList,
    isHFAdminSelected,
    getSpiceGroupName,
    formUserData,
    roleBasedAppTypes
  } = useUserFormUtils();
  const { DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  const isRolesLoading = useSelector(isUserRolesLoading);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const assignedHFListHFAdmin = useSelector(assignedHFListForHFAdminSelector);
  const hfLoading = useSelector(healthFacilityLoadingSelector);
  const peerSupervisorList = useSelector(peerSupervisorListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const villagesList = useSelector(villagesFromHFListSelector);
  const villagesLoading = useSelector(villagesFromHFLoadingSelector);
  const cultureList = useSelector(cultureListSelector);
  const communityList = useSelector(communityListSelector);
  const isCultureListLoading = useSelector(cultureListLoadingSelector);
  const chiefdomList = useSelector(chiefdomListSelector);
  const chiefdomLoading = useSelector(chiefdomLoadingSelector);
  const districtLoading = useSelector(districtLoadingSelector);
  const countryList = useSelector(countryListSelector);
  const designationList = useSelector(designationListSelector);
  const isCountryListLoading = useSelector(countryLoadingSelector);
  const [peerSupervisors, setPeerSupervisors] = useState([[...peerSupervisorList.list]] as IPeerSupervisor[][]);
  const [villages, setVillages] = useState([[...villagesList.list]] as IVillages[][]);
  const [autoFetchData, setAutoFetchData] = useState(autoFetchedDataState?.autoFetchData || ([] as any[]));
  const [isCHAUser, setUserAsCHA] = useState(chwState?.isCHAUser || [false]);
  const [isCHWCHPUser, setUserAsCHWCHP] = useState([false]);
  const [selectedAdmins, setSelectedAdmins] = useState<string>('');
  const roleOptions = useRef<IRoles[][]>(roleOptionsState?.current || []);
  const disabledRoles = useRef<IDisabledRoles[]>(
    disabledRolesState?.disabledRoles || ([{ SPICE: [], REPORTS: [], INSIGHTS: [] }] as IDisabledRoles[])
  );
  const [autoFetched, setAutoFetched] = useState<boolean[]>(autoFetchedState?.autoFetch || ([] as boolean[]));
  const fetchedData = useRef([] as any[]);
  const [clearEmail, setClearEmail] = useState(false);
  const districtList = useSelector(getDistrictListSelector);
  const {
    GENDER_OPTIONS,
    userList: {
      filters: { available: showFilters }
    },
    user: {
      culture: { available: showCulture },
      designation: { available: isDesignationListShow },
      community: { available: isCommunityListShow }
    },
    district: { s: districtSName },
    healthFacility: { s: healthfacilitySName },
    isCommunity
  } = useAppTypeConfigs();

  const [newHFList, setNewHFList] = useState(healthFacilityList);
  const [appTypeBasedRoles, setAppTypeRoles] = useState(rolesGrouped);
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
        culture: showCulture ? null : undefined,
        country: ''
      }
    ],
    [showCulture]
  );

  // new hook related state and ref
  const showSpiceHFRef = useRef<boolean[]>([false]);
  const showReportHFRef = useRef<boolean[]>([false]);
  const showInsightHFRef = useRef<boolean[]>([false]);
  const [showVillage, setShowVillage] = useState<boolean[]>([false]);
  const spiceRoles = useRef([] as IRoles[]);
  const reportRolesRef = useRef([] as IRoles[]);
  const insightRolesRef = useRef([] as IRoles[]);

  // role filter based on appTypes
  useEffect(() => {
    setAppTypeRoles(filterRolesByAppTypeFn(rolesGrouped, appTypes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appTypes, rolesGrouped]);

  useEffect(() => {
    if (countryId && isDesignationListShow) {
      dispatch(fetchDesignationListRequest({ countryId }));
    }
    if (isCommunityListShow && isSiteUser && countryId && communityList && !(communityList || []).length) {
      const payload = {
        countryId,
        search: ''
      };
      dispatch(fetchCommunityListRequest(payload));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (autoFetchedState) {
        autoFetchedState.setAutoFetchState(autoFetched);
      }
      if (chwState) {
        chwState.setUserAsCHW(isCHAUser);
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
    isCHAUser,
    roleOptionsState
  ]);

  const getHFListFn = useCallback(() => {
    const isSuperUserOrSuperAdmin = [SUPER_ADMIN, SUPER_USER].includes(role);
    if (countryId) {
      dispatch(
        fetchHFListRequest({
          countryId,
          skip: 0,
          limit: null,
          // for community regions and super admin/user login to get all hf list don't sent tenantId,
          // for community regions and hf admin login send tenantId
          // for non community always send tenantId
          tenantIds: isCommunity && isSuperUserOrSuperAdmin ? undefined : [tenantId],
          userBased: !isSuperUserOrSuperAdmin
        })
      );
    }
  }, [countryId, dispatch, role, tenantId, isCommunity]);

  useEffect(() => {
    if (!showFilters && countryId) {
      setNewHFList(healthFacilityList);
    }
  }, [countryId, healthFacilityList, healthFacilityList.length, showFilters]);

  useEffect(() => {
    if (countryId && !isRegionCreate && !isCreateDistrict && !isCreateChiefdom && !isChiefdom && !isHFCreate) {
      getHFListFn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isFormInvalid = form?.getState()?.errors?.[formName]?.length;

  /**
   * Creates the initial edit data for the user form.
   *
   * @param initialEditValue - The initial values for editing a user
   * @param isEdit - Boolean flag indicating if the form is in edit mode
   * @param isCultureListLoading - Boolean flag indicating if the culture list is loading
   * @param cultureList - List of available cultures
   * @param districtList - List of available districts
   * @param chiefdomList - List of available chiefdoms
   * @returns An array containing the initial edit data object
   */
  const initialEditData = useMemo<Array<Partial<any>>>(
    () => [
      {
        ...initialEditValue,
        ...formUserData(initialEditValue),
        hfTenantIds: isEdit
          ? (initialEditValue?.organizations || [])
              .filter((hfDetail: any) => hfDetail.formName === 'healthfacility')
              .map((org: any) => org.id)
          : [],
        culture: showCulture && initialEditValue?.culture,
        district:
          initialEditValue?.organizations?.filter(
            (countyDetail: any) => countyDetail.formName === NAMING_VARIABLES.district
          ) || '',
        chiefdom:
          initialEditValue?.organizations?.filter(
            (countyDetail: any) => countyDetail.formName === NAMING_VARIABLES.chiefdom
          ) || '',
        healthfacility:
          initialEditValue?.organizations?.filter(
            (countyDetail: any) => countyDetail.formName === NAMING_VARIABLES.healthFacility
          ) || '',
        countryCode: { phoneNumberCode: initialEditValue?.countryCode, id: initialEditValue?.countryCode }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cultureList, initialEditValue, districtList, chiefdomList, isCultureListLoading, isEdit]
  );

  useEffect(() => {
    if (!isHF && isEdit && !isSiteUser && !isReportOrInsightUser) {
      const [selectedAdminRole] = initialEditData?.[0]?.role || [];
      setSelectedAdmins(selectedAdminRole?.name);
    }
  }, [initialEditData, isHF, isEdit, isSiteUser, isReportOrInsightUser]);

  /**
   * Resets the admin form fields to their initial state.
   *
   * @param {any} fields - The fields object from react-final-form-arrays
   * @param {number} index - The index of the form to reset
   */
  const resetAdminForm = useCallback(
    (fields: any, index: number) => {
      // Reset the form fields using the form mutator
      form.mutators?.resetFields?.(`${formName}[${index}]`);

      // Update the fields with the initial values
      fields.update(index, { ...initialValue[0] });

      // Handle special cases for admin form or health facility creation
      if ((isAdminForm && defaultSelectedRole) || isHFCreate) {
        const suiteAccess = getSuiteAccessList(appTypeBasedRoles);
        const defaultAdminSelected = appTypeBasedRoles.SPICE?.find(
          (spiceRole: IRoles) => spiceRole.name === defaultSelectedRole
        );
        fields.update(index, {
          ...form.getState().values?.users[index],
          role: isAdminForm && defaultSelectedRole ? [defaultAdminSelected] : [],
          roles: isAdminForm && defaultSelectedRole ? [defaultAdminSelected] : [],
          suiteAccess: defaultSelectedRole ? [getSpiceGroupName(suiteAccess)] : [],
          countryCode:
            form.getState()?.values?.region?.phoneNumberCode?.length &&
            !form?.getState()?.errors?.region?.phoneNumberCode
              ? form.getState()?.values?.region?.phoneNumberCode
              : undefined
        });
      }

      // Reset disabled roles
      disabledRoles.current = [];

      // Update auto-fetched state
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = false;
      setAutoFetched(newAutoFetched);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, initialValue, isAdminForm, defaultSelectedRole, autoFetched, appTypeBasedRoles.SPICE]
  );

  useEffect(() => {
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
      dispatch(clearChiefdomList());
      dispatch(clearDistrictList());
      dispatch(clearDesignationList());
      dispatch(clearAssignedHFListForHFAdmin());
      if (!isHFCreate) {
        // clear hf only for add users, not create hf
        // while creating hf, hf list for reports will be based on selected chiefdom
        dispatch(clearHFList());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles the logic for disabling email input and displaying error toast.
   * @param {string} errorMsg - The error message to display
   * @param {number} index - The index of the form to reset
   * @param {boolean} isAutoPopulate - Whether to automatically populate the form
   */
  const emailDisabledFn = (errorMsg: string, index: number, isAutoPopulate: boolean = true) => {
    const newAutoFetched = [...autoFetched];
    newAutoFetched[index] = false;
    setAutoFetched(newAutoFetched);
    setClearEmail(true);
    if (isAutoPopulate) {
      form.change(`${formName}[${index}].username`, '');
      toastCenter.error(...getErrorToastArgs(new Error(), APPCONSTANTS.OOPS, errorMsg));
    }
  };

  /**
   * Automatically populates user data into the form fields.
   * @param {any} user - The user data to populate
   * @param {number} index - The index of the form to populate
   */
  const autoPopulateUserData = (user: any, index: number) => {
    let userData = {
      ...user
    };
    userData.suiteAccess = userData.roles[0];
    userData.role = (userData.roles || []).filter((r: IRoles) => r.groupName === userData.suiteAccess.groupName) || [];
    if (isRoleExists(userData.role, [SUPER_ADMIN, SUPER_USER, REPORT_ADMIN])) {
      emailDisabledFn(APPCONSTANTS.SUPER_ADMIN_USER_EXCEPTION_HF_CREATE.replace('Super', 'Super/Report'), index);
    } else if (isCHPCHWSelected(userData.role) && isHFCreate) {
      emailDisabledFn(APPCONSTANTS.CHP_USER_EXCEPTION_HF_CREATE, index);
    } else {
      form.change(`${formName}[${index}].countryCode`, '');
      setClearEmail(false);
      userData = { ...userData, ...formUserData(user) };
      const filteredUserRoles = userData?.roles?.filter(
        (roleToFilter: any) =>
          (roleToFilter.name !== NAMING_VARIABLES.redRisk &&
            roleToFilter?.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.mob) ||
          roleToFilter?.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.admin
      );
      userData.selectedVillages = [...(Array.isArray(userData.villages) ? userData.villages : [])];
      if (userData.organizations.length === 1) {
        const { formDataId: id, name, id: orgTenantId, ...rest } = userData.organizations[0];
        userData.healthFacility = { ...rest, id, name, tenantId: orgTenantId };
      }
      if (showSpiceHFRef.current[index]) {
        const fullRoles = form.getState().values[`${formName}[${index}].roles`];
        const selectedAppTypes = roleBasedAppTypes(fullRoles);
        filterHFByAppTypes(selectedAppTypes);
      }
      form.batch(() => {
        form.change(`${formName}[${index}].id`, userData.id || '');
        form.change(`${formName}[${index}].suiteAccess`, userData.suiteAccess || null);
        form.change(`${formName}[${index}].mandatorySuiteAccess`, userData.mandatorySuiteAccess || '');
        form.change(`${formName}[${index}].role`, filteredUserRoles || []);
        form.change(`${formName}[${index}].roles`, userData.roles || []);
        form.change(`${formName}[${index}].reportRoles`, userData.reportRoles || []);
        form.change(`${formName}[${index}].insightRoles`, userData.insightRoles || []);
        form.change(`${formName}[${index}].selectedInsightRoles`, userData.insightRoles || []);
        form.change(`${formName}[${index}].selectedReportRoles`, userData.reportRoles || []);
        form.change(`${formName}[${index}].selectedRoles`, userData?.selectedRoles || []);
        form.change(`${formName}[${index}].firstName`, userData?.firstName || '');
        form.change(`${formName}[${index}].lastName`, userData.lastName || '');
        form.change(`${formName}[${index}].gender`, userData.gender || '');
        form.change(`${formName}[${index}].country`, userData.country || null);
        form.change(`${formName}[${index}].countryCode`, {
          phoneNumberCode: userData.countryCode || '',
          id: userData.countryCode
        });
        form.change(`${formName}[${index}].phoneNumber`, userData.phoneNumber || '');
        if (isCommunity) {
          form.change(`${formName}[${index}].healthfacility`, userData.healthFacility || null);
        }
        form.change(`${formName}[${index}].reportUserOrganization`, userData.reportUserOrganization || null);
        form.change(`${formName}[${index}].insightUserOrganization`, userData.insightUserOrganization || null);
        form.change(`${formName}[${index}].supervisor`, userData.supervisor || '');
        form.change(`${formName}[${index}].villages`, userData.villages || []);
        form.change(`${formName}[${index}].organizations`, userData.organizations || []);
        form.change(`${formName}[${index}].selectedVillages`, userData.selectedVillages || []);
        form.change(`${formName}[${index}].timezone`, userData.timezone || []);
        form.change(`${formName}[${index}].culture`, userData.culture || null);
        form.change(`${formName}[${index}].redRisk`, userData.redRisk || false);
        form.change(`${formName}[${index}].designation`, userData.designation || null);
      });
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = true;
      setAutoFetched(newAutoFetched);
      const newFetchedData = [...fetchedData.current];
      newFetchedData[index] = userData;
      fetchedData.current = newFetchedData;
      getRoleOptions(index, userData.roles);
      roleChange({ allRoles: userData.roles as IRoles[], index, appTypeBasedRoles });
      if (isCHPCHWSelected(userData.roles)) {
        const tenantIds = [...userData.organizations.map((v: any) => v.id), hfTenantId].filter((v: any) => v);
        fetchListWithConditions(tenantIds, userData.id, 'village', index);
        fetchListWithConditions(tenantIds, userData.id, 'supervisor', index);
      }
    }
  };

  // Function to filter health facilities by selected appTypes
  const filterHFByAppTypes = (selectedAppTypes: string[]) => {
    const filteredHFList = healthFacilityList.filter((hf) => {
      // Check if any clinical workflow's appTypes includes all the selectedAppTypes
      return [...(hf.clinicalWorkflows || []), ...(hf.customizedWorkflows || [])].some((workflow) => {
        return selectedAppTypes.some((type) => {
          if (workflow.appTypes) {
            return (workflow.appTypes || []).includes(type);
          } else {
            return true;
          }
        });
      });
    });
    setNewHFList(filteredHFList);
  };

  useEffect(() => {
    if (!countryList.length) {
      dispatch(fetchCountryListRequest());
    }
  }, [countryList.length, dispatch]);

  /**
   * Fetches user roles if necessary.
   */
  useEffect(() => {
    if (!appTypeBasedRoles?.hasOwnProperty('SPICE') && !isProfile && (countryId || isRegionCreate)) {
      dispatch(
        fetchUserRolesAction({
          countryId: countryId || null,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, dispatch, isProfile, isRegionCreate]);

  /**
   * Checks if there is an error in the form field.
   * @param {any} meta - The meta object from react-final-form
   * @returns {any} The error or undefined if there is no error
   */
  const isError = (meta: any): any => (meta.touched && meta.error) || undefined;

  /**
   * Handles the display of the "Add Another" icon.
   * @param {boolean} isLastChild - Whether the current item is the last child
   * @param {any} fields - The fields object from react-final-form-arrays
   * @param {number} index - The index of the form
   * @returns {React.ReactElement} The rendered "Add Another" icon
   */
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
                  const dataToPush = { ...initialValue[0] };
                  if (isAdminForm && defaultSelectedRole) {
                    const defaultAddAdminRole = appTypeBasedRoles.SPICE?.find(
                      (spiceRole: IRoles) => spiceRole.name === defaultSelectedRole
                    );
                    dataToPush.role = [defaultAddAdminRole];
                    dataToPush.roles = [defaultAddAdminRole];
                    const suiteAccess = getSuiteAccessList(appTypeBasedRoles);
                    dataToPush.suiteAccess = [getSpiceGroupName(suiteAccess)];
                  }
                  if (
                    isRegionCreate &&
                    !form?.getState()?.errors?.region?.phoneNumberCode &&
                    form.getState()?.values?.region?.phoneNumberCode?.length
                  ) {
                    dataToPush.countryCode = form.getState()?.values?.region?.phoneNumberCode;
                  }
                  fields.push(dataToPush);
                }
          }
        >
          <PlusIcon className='me-0dot5' aria-labelledby='plus-icon' aria-label='plus-icon' />
          {isHF || isHFCreate ? APPCONSTANTS.ADD_ANOTHER_USER : APPCONSTANTS.ADD_ANOTHER_ADMIN}
        </div>
      )
    );
  };

  /**
   * Handles the display of the "Remove User" icon.
   * @param {any} fields - The fields object from react-final-form-arrays
   * @param {number} index - The index of the form
   * @returns {React.ReactElement} The rendered "Remove User" icon
   */
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
          <BinIcon className='me-0dot5' aria-labelledby='bin-icon' aria-label='bin-icon' />
          {'Remove User'}
        </div>
      )
    );
  };

  /**
   * Renders the action buttons for the user form.
   * @param {any} fields - The fields object from react-final-form-arrays
   * @param {number} index - The index of the form
   * @param {boolean} isLastChild - Whether the current item is the last child
   * @param {any} emailFieldRef - The ref object for the email field
   * @returns {React.ReactElement} The rendered action buttons
   */
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
          <ResetIcon className='me-0dot5' aria-labelledby='reset-icon' aria-label='reset-icon' />
          Reset Fields
        </div>
      </div>
    );

  const divider = (isLastChild: boolean) => {
    return !isLastChild && <div className='divider mx-neg-1dot25 mb-1dot5' />;
  };

  // Peer Supervisor fetch
  const fetchSupervisorList = useCallback(
    (tenantIds: number[], index: number) => {
      const uniqueTenantIds = tenantIds.reduce(
        (unique: number[], id) => (unique.includes(id) ? unique : [...unique, id]),
        []
      );
      dispatch(
        fetchPeerSupervisorListRequest({
          tenantIds: uniqueTenantIds,
          appTypes: appTypes || [''],
          successCb: ({ list }: { list: IPeerSupervisor[] }) => {
            const newSupervisors = [...peerSupervisors];
            newSupervisors[index] = list;
            setPeerSupervisors(newSupervisors);
          }
        })
      );
    },
    [appTypes, dispatch, peerSupervisors]
  );

  // Villages fetch
  const fetchVillagesList = useCallback(
    (tenantIds: number[], userId: string, index: number) => {
      if (tenantIds.length && countryId) {
        dispatch(
          fetchVillagesListUserLinked({
            tenantIds,
            userId: Number(userId),
            successCb: ({ list }: { list: IVillages[] }) => {
              if (!list.length) {
                toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.NO_VILLAGE_FOUND);
              }
              const newVillages = [...villages];
              newVillages[index] = list;
              setVillages(newVillages);
            }
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryId, dispatch, healthFacilityList, villages]
  );

  // Common function for the supervisor and village list fetch with conditions
  const fetchListWithConditions = (tenantIds: number[] = [], userId: string, name: string, index: number) => {
    if (tenantIds.length) {
      if (name === 'village') {
        return fetchVillagesList([...new Set(tenantIds)], userId, index);
      } else {
        return fetchSupervisorList([...new Set(tenantIds)], index);
      }
    }
  };

  /**
   * For admin create
   * Fetches the health facility list based on the provided values.
   * @param {IRoles} values - The values object containing tenantIds
   */
  const chiefdomBasedHfList = useCallback(
    (values: IRoles) => {
      if (countryId) {
        const isSuperUserOrSuperAdmin = [SUPER_ADMIN, SUPER_USER].includes(role);
        dispatch(
          fetchHFListRequest({
            countryId,
            skip: 0,
            limit: null,
            tenantIds: values.tenantIds,
            userBased: !isSuperUserOrSuperAdmin,
            forHFAdmin: true
          })
        );
      }
    },
    [countryId, dispatch, role]
  );

  /**
   * Effect hook to fetch village and supervisor lists based on the initial edit data. ***
   */
  useEffect(() => {
    if (isEdit && showVillage[0] && !isProfile) {
      const tenantIds = [...initialEditData[0].hfTenantIds].filter((v: number) => v);
      fetchListWithConditions(tenantIds, initialEditData[0]?.id, 'village', 0);
      fetchListWithConditions(tenantIds, initialEditData[0]?.id, 'supervisor', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchData, showVillage]);

  /**
   * Initializes the data for the user form.
   */
  const initData = useCallback(() => {
    const suiteAccess = getSuiteAccessList(appTypeBasedRoles);
    roleOptions.current = [appTypeBasedRoles.SPICE];
    if (isEdit) {
      const initialEditDataWithoutRedrisk = initialEditData.map((editData) => ({
        ...editData,
        role: removeRedRiskFromRoleArray(editData?.role)
      }));
      setAutoFetchData(initialEditDataWithoutRedrisk);
    } else if (data.length) {
      setAutoFetchData(data);
    } else if (isAdminForm && defaultSelectedRole) {
      if (appTypeBasedRoles.SPICE) {
        const selectedRole = appTypeBasedRoles.SPICE?.find(
          (spiceRole: IRoles) => spiceRole.name === defaultSelectedRole
        );
        // levelBasedReportsRole(selectedRole?.level);
        const initialEditDataForRole = {
          role: [selectedRole],
          roles: [selectedRole],
          suiteAccess: [getSpiceGroupName(suiteAccess)]
        };
        setAutoFetchData([initialEditDataForRole]);
      }
    } else {
      setAutoFetchData(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedRole, initialEditData, initialValue, isAdminForm, isEdit, appTypeBasedRoles.SPICE]);

  /**
   * Effect hook to initialize the data for the user form.
   */
  useEffect(() => {
    initData();
  }, [initData]);

  /**
   * Fetches district details based on the health facility tenant ID.
   */
  const fetchDetails = useCallback(() => {
    if (countryId) {
      dispatch(
        fetchDistrictListRequest({
          countryId,
          tenantId: String(hfTenantId), // url tenantId
          isActive: true,
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
              )
            )
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, dispatch]);

  /**
   * Effect hook to fetch district details based on the selected admins.
   */
  useEffect(() => {
    if (
      [DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== DISTRICT_ADMIN &&
      role !== CHIEFDOM_ADMIN &&
      !isProfile &&
      hfTenantId
    ) {
      fetchDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchDetails, selectedAdmins]);

  /**
   * Effect hook to set the district ID based on the selected admins.
   * This function ensures showing chiefdom list based on hierarchy when add/edit admin
   * Using zero index value only as add/edit admin have only one user form
   */
  useEffect(() => {
    const selectedDistrictTenantId = form.getState().values.users?.[0]?.district?.tenantId; // for add
    const [existingDistrict] = initialEditData; // for edit

    const existingDistrictId = existingDistrict?.organizations?.filter(
      (formData: { formName: string }) => formData.formName === NAMING_VARIABLES.district
    );
    const { defaultRoleName = '' } = existingDistrict;

    let payloadTenantId = null;
    // if current role is district admin then send URL tenantId
    if (role === DISTRICT_ADMIN) {
      payloadTenantId = hfTenantId;
    } else if (defaultRoleName === HEALTH_FACILITY_ADMIN) {
      payloadTenantId = null;
    } else {
      payloadTenantId = selectedDistrictTenantId || existingDistrictId?.[0]?.id;
    }
    if (payloadTenantId && !isSiteUser) {
      // for other admins send selected district tenentId
      dispatch(fetchChiefdomListRequest({ tenantId: payloadTenantId }));
    } else if (!isSiteUser && fetchingFor === REGION_ADMIN && hfTenantId) {
      // for region admin send URL tenentId
      dispatch(fetchChiefdomListRequest({ tenantId: String(hfTenantId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values.users?.[0]?.district?.tenantId]);

  /**
   * Effect hook to fetch chiefdom details based on the selected admins.
   * This function ensures showing HF list based on hierachy when add/edit admin
   * Using zero index value only add/edit admin have only one user form
   */
  useEffect(() => {
    const selectedChiefdomData = form.getState().values.users?.[0]?.chiefdom; // for add
    const [existingDistrict] = initialEditData; // for edit
    const existingchiefdomDataId = existingDistrict?.organizations?.filter(
      (formData: { formName: string }) => formData.formName === NAMING_VARIABLES.chiefdom
    );
    const chiefdomDetails = selectedChiefdomData ?? existingchiefdomDataId?.[0];
    const chiefdomId =
      role === CHIEFDOM_ADMIN ? hfTenantId : selectedChiefdomData?.tenantId ?? existingchiefdomDataId?.[0]?.id;
    if (chiefdomId && !isSiteUser) {
      chiefdomBasedHfList({ ...chiefdomDetails, tenantIds: [chiefdomId] });
    } else if (!isSiteUser && healthFacilityList.length === 0 && fetchingFor === ADMIN_BASED_ON_URL.chiefdom) {
      chiefdomBasedHfList({ ...chiefdomDetails, tenantIds: [hfTenantId] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getState().values.users?.[0]?.chiefdom?.tenantId]);

  useEffect(() => {
    // healthFacility auto populate for insight role and culture input fields
    const [selectedHf] = form.getState()?.values?.users;
    if (selectedHf?.role) {
      setSelectedAdmins(selectedHf?.role?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getState()?.values?.users?.[0]?.role?.name]);

  const setDisabledRolesFn = useCallback(
    ({
      disabledRoles: disabledRolesFromHook,
      showSpiceHFList,
      showReportHFList,
      showInsightHFList,
      showVillages,
      isCHAStatus,
      isCHWCHPStatus
    }: any) => {
      disabledRoles.current = disabledRolesFromHook;
      showSpiceHFRef.current = showSpiceHFList;
      showReportHFRef.current = showReportHFList;
      showInsightHFRef.current = showInsightHFList;
      setShowVillage(showVillages);
      // getting CHA user selected status
      setUserAsCHA(isCHAStatus);
      // getting CHW/CHP user selected status
      setUserAsCHWCHP(isCHWCHPStatus);
    },
    []
  );

  // custom hooks for role change
  const { roleChange } = useRoleMeta({
    disabledRoles,
    isHF,
    isHFCreate,
    isEdit,
    isSiteUser,
    isFromAdminList,
    formData: autoFetchData,
    isCHAStatus: isCHAUser,
    isCHWCHPStatus: isCHWCHPUser,
    showVillagesState: showVillage,
    showSpiceHFListState: showSpiceHFRef.current,
    showReportHFListState: showReportHFRef.current,
    showInsightHFListState: showInsightHFRef.current,
    isRegionCreate,
    onRoleChange: ({
      disabledRoles: disabledRolesFromHook,
      showSpiceHFList,
      showReportHFList,
      showInsightHFList,
      showVillages,
      isCHAStatus,
      isCHWCHPStatus
    }) => {
      setDisabledRolesFn({
        disabledRoles: disabledRolesFromHook,
        showSpiceHFList,
        showReportHFList,
        showInsightHFList,
        showVillages,
        isCHAStatus,
        isCHWCHPStatus
      });
    }
  });

  // custom hooks for role options
  const { getRoleOptions } = useRoleOptions({
    isHF,
    isHFCreate,
    isEdit,
    isSiteUser,
    appTypes,
    allRoles: rolesGrouped,
    currentModule,
    roleOptionsFn: ({ spiceRoleOptions, reportRoleOptions: newReportRoles, insightRoleOptions }) => {
      spiceRoles.current = spiceRoleOptions;
      reportRolesRef.current = newReportRoles;
      insightRolesRef.current = insightRoleOptions;
    }
  });

  useEffect(() => {
    if (isHFCreate || (isEdit && !isProfile)) {
      autoFetchData.forEach((formData: any, index: number) => {
        roleChange({ allRoles: formData.roles as IRoles[], index, appTypeBasedRoles });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchData, appTypeBasedRoles]);

  useEffect(() => {
    if (!(spiceRoles.current.length && reportRolesRef.current.length && insightRolesRef.current.length)) {
      if (isEdit) {
        getRoleOptions(0, initialEditData[0].roles || []);
      } else {
        getRoleOptions();
      }
    }
  }, [autoFetchData, getRoleOptions, initialEditData, isEdit]);

  return (
    <FieldArray name={formName} initialValue={autoFetchData}>
      {({ fields }) =>
        fields.map((name: string, index: number) => {
          const isLastChild = (fields?.length || 0) === index + 1;
          const emailFieldRef = React.createRef<{ resetEmailField?: () => void }>();
          // SUITE options
          const suiteAccess = getSuiteAccessList(appTypeBasedRoles);
          const {
            mandatorySuiteAccess,
            selectedRoles: mandatoryRoles = [],
            selectedReportRoles: mandatoryReportsRole = [],
            selectedInsightRoles: mandatoryInsightsRole = [],
            suiteAccess: formSuiteAccess = [],
            roles: allRoles = [],
            role: spiceRole = [],
            reportRoles = [],
            insightRoles = []
          } = form.getState().values?.users?.[index];
          const isSPICE = (formSuiteAccess || []).some((v: any) => v?.groupName === SPICE);
          const isReports = (formSuiteAccess || []).some((v: any) => v?.groupName === REPORTS);
          const isInsights = (formSuiteAccess || []).some((v: any) => v?.groupName === INSIGHTS);
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
                        disabled={isProfile}
                        isDisabled={isProfile}
                        loadingOptions={isRolesLoading}
                        isShowLabel={true}
                        error={isError(meta)}
                        isMulti={true}
                        isModel={true}
                        required={true}
                        isClearable={false}
                        mandatoryOptions={
                          isAdminForm
                            ? isEdit
                              ? mandatorySuiteAccess
                              : [getSpiceGroupName(suiteAccess)]
                            : mandatorySuiteAccess || ''
                        }
                        onChange={(values: any[]) => {
                          const suiteOrder: { [key: string]: number } = {
                            SPICE: 1,
                            REPORTS: 2,
                            INSIGHTS: 3
                          };
                          const sortedSuites = values.sort((a, b) => suiteOrder[a.groupName] - suiteOrder[b.groupName]);
                          const selectedGroupNames: string[] =
                            sortedSuites.map((option: any) => option.groupName) || [];
                          let newAllRoles: IRoles[] = [];
                          const suiteFormName = {
                            SPICE: {
                              role: `${formName}[${index}].role`,
                              hfList: `${formName}[${index}].healthfacility`
                            },
                            REPORTS: {
                              role: `${formName}[${index}].reportRoles`,
                              hfList: `${formName}[${index}].reportUserOrganization`
                            },
                            INSIGHTS: {
                              role: `${formName}[${index}].insightRoles`,
                              hfList: `${formName}[${index}].insightUserOrganization`
                            }
                          };
                          const removeHF4User = (completeRoles: IRoles[]) =>
                            completeRoles.filter((newRoles: IRoles) => newRoles.name !== hf4ReportUser);
                          let selectedAllRoles = [...allRoles];
                          Object.keys(suiteFormName).forEach((r: string) => {
                            if (selectedGroupNames.includes(r)) {
                              newAllRoles = [
                                ...newAllRoles,
                                ...selectedAllRoles.filter((v: IRoles) => v.groupName === r)
                              ];
                            } else {
                              form.change((suiteFormName as any)[r].role, []);
                              form.change((suiteFormName as any)[r].hfList, []);
                              if (r === SPICE) {
                                form.change(`${formName}[${index}].designation`, null);
                                // to remove HF4User while removing the SPICE suite
                                const selectedReportRoles = form.getState().values[formName][index].reportRoles || [];
                                const isHF4Selected = selectedReportRoles.some(
                                  (newRoles: IRoles) => newRoles.name === hf4ReportUser
                                );
                                if (isHF4Selected) {
                                  form.change((suiteFormName as any).REPORTS.role, []);
                                  newAllRoles = removeHF4User(newAllRoles);
                                  selectedAllRoles = removeHF4User(selectedAllRoles);
                                }
                              }
                            }
                          });
                          form.change(`${formName}[${index}].roles`, newAllRoles);
                          getRoleOptions(index, newAllRoles);
                          roleChange({ allRoles: newAllRoles, index, appTypeBasedRoles });
                          input.onChange(sortedSuites);
                        }}
                      />
                    )}
                  />
                </div>
                {(isSPICE || isAdminForm) && (
                  <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6'} `}>
                    <Field
                      name={`${name}.role`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return isSiteUser || isHFCreate ? (
                          <MultiSelect
                            {...(input as any)}
                            label='SPICE Role'
                            errorLabel='Please select at least one role.'
                            labelKey='displayName'
                            valueKey='id'
                            isShowLabel={true}
                            isSelectAll={true}
                            selectAll={false}
                            menuPlacement={'auto'}
                            isDisabled={isProfile}
                            placeholder=''
                            isModel={true}
                            isMulti={true}
                            required={true}
                            options={spiceRoles.current}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(autoFetched[index] || mandatoryRoles ? mandatoryRoles : []),
                                ...(disabledRoles.current?.[index]?.SPICE || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            mandatoryOptions={mandatoryRoles ? mandatoryRoles : []}
                            disabledOptions={disabledRoles.current?.[index]?.SPICE || []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            onChange={(values: any, key: number) => {
                              let reportRolesNew = reportRoles;
                              // if report role has HF4 user and
                              // selected spice role doesn't have peer supervisor
                              // then remove HF4 user from reportRoles
                              if (
                                reportRoles.some((reportRole: { name: string }) => reportRole.name === hf4ReportUser) &&
                                !values?.some((value: { name: string }) => value.name === peerSupervisor)
                              ) {
                                reportRolesNew = reportRoles?.filter(
                                  (reportRole: { name: string }) => reportRole.name !== hf4ReportUser
                                );
                                form.change(`${formName}[${index}].reportRoles`, reportRolesNew);
                              }
                              const currentAllRoles = [...reportRolesNew, ...insightRoles, ...values];
                              getRoleOptions(index, currentAllRoles);
                              roleChange({
                                allRoles: currentAllRoles,
                                index,
                                appTypeBasedRoles
                              });
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].role`, [...values]);
                              form.change(`${formName}[${index}].roles`, currentAllRoles);
                              if (showSpiceHFRef.current[index]) {
                                const fullRoles = form.getState().values[formName][index].roles;
                                const selectedAppTypes = roleBasedAppTypes(fullRoles);
                                filterHFByAppTypes(selectedAppTypes);
                              }
                              // fetch HF list based on CHW selection
                              if (isCHPCHWSelected(values)) {
                                if (!isEdit && !autoFetched[index]) {
                                  // To clear the Selected village during Add User
                                  form.batch(() => {
                                    form.change(`${formName}[${index}].villages`, {});
                                  });
                                }
                                /*
                                 * tenantIds is an array of tenantIds,
                                 * that are used to fetch the village and supervisor lists.
                                 * It includes the tenantIds from the initialEditData
                                 * the tenantId from the HF field or the HF id and tenantId if present
                                 * the tenantIds from the fetched data
                                 * and the hfTenantId if isHF is true.
                                 * The filter function is used to remove undefined values from the array.
                                 */
                                const tenantIds = [
                                  ...(initialEditData[index]?.hfTenantIds || []),
                                  Number(form.getState().values?.users?.[0]?.healthfacility?.tenantId) ||
                                    (healthFacilityId && tenantId ? Number(tenantId) : undefined),
                                  ...((fetchedData.current[index] || {}).organizations || []).map((v: any) => v.id),
                                  isHF ? Number(hfTenantId) : undefined
                                ].filter((v: number | undefined) => v);
                                fetchListWithConditions(tenantIds, initialEditData[0]?.id, 'village', index);
                                fetchListWithConditions(tenantIds, initialEditData[0]?.id, 'supervisor', index);
                              } else {
                                // Other than chw/chp role village must be clear
                                form.batch(() => {
                                  form.change(`${formName}[${index}].villages`, {});
                                });
                              }
                              // clear designation whenever role gets update
                              form.change(`${formName}[${index}].designation`, null);
                              input.onChange(values);
                            }}
                          />
                        ) : (
                          <SelectInput
                            {...(input as any)}
                            autoSelect={false} // for admins prevent autoselect
                            label={'SPICE Role'}
                            errorLabel='Please select role.'
                            labelKey='displayName'
                            valueKey='id'
                            options={!isProfile ? spiceRoles.current : []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            isModel={true}
                            disabled={(isAdminForm && defaultSelectedRole) || (isEdit && !isReportOrInsightUser)}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(autoFetched[index] || mandatoryRoles ? mandatoryRoles : []),
                                ...(disabledRoles.current?.[index]?.SPICE || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            onChange={(values: any) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].roles`, [...reportRoles, ...insightRoles, values]);
                              setSelectedAdmins(values?.name);
                              // fetch HF list based on CHW selection
                              input.onChange(values);
                              // fetch culture list HF admin
                              if (
                                values.name === HEALTH_FACILITY_ADMIN &&
                                cultureList &&
                                !cultureList.length &&
                                showCulture
                              ) {
                                dispatch(fetchCultureListRequest());
                              }
                              const currentAllRoles = [...reportRoles, ...insightRoles, values];
                              roleChange({
                                allRoles: currentAllRoles,
                                index,
                                appTypeBasedRoles
                              });
                              getRoleOptions(index, currentAllRoles);
                              // clear designation whenever role gets update
                              form.change(`${formName}[${index}].designation`, null);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isSPICE &&
                  isDesignationListShow &&
                  // don't show for superuser
                  (!isProfile || spiceRole[0].name !== APPCONSTANTS.ROLES.SUPER_USER) &&
                  !isRegionCreate && ( // don't show while create region
                    <div className='col-sm-6 col-12'>
                      <Field
                        name={`${name}.designation`}
                        type='text'
                        validate={required}
                        render={({ input, meta }) => {
                          let userSelectedRoles = [];
                          // for user create and edit
                          if (
                            Array.isArray(form.getState().values.users?.[index].role) &&
                            form.getState().values.users?.[index].role.length
                          ) {
                            userSelectedRoles = form.getState().values.users?.[index].role;
                          } else if (
                            !Array.isArray(form.getState().values.users?.[index].role) &&
                            form.getState().values.users?.[index].role &&
                            form.getState().values.users?.[index].role.id
                          ) {
                            // for admin create and edit
                            userSelectedRoles = [form.getState().values.users?.[index].role];
                          }
                          const selectedRoleNames = userSelectedRoles.map(
                            (userRoleDetails: { name: string }) => userRoleDetails.name
                          );
                          const selectedName = (designationList || []).filter((selectedRoleData: any) =>
                            selectedRoleNames.includes(selectedRoleData.role.name)
                          );
                          return (
                            <SelectInput
                              {...(input as any)}
                              label='Designation'
                              errorLabel='designation'
                              required={true}
                              labelKey='name'
                              valueKey='id'
                              options={selectedName || []}
                              error={isError(meta)}
                              isModel={true}
                            />
                          );
                        }}
                      />
                    </div>
                  )}
                {isReports && (
                  <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                    <Field
                      name={`${name}.reportRoles`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label='Reports Role'
                            errorLabel='Please select at least one role.'
                            labelKey='displayName'
                            valueKey='id'
                            isShowLabel={true}
                            isSelectAll={true}
                            selectAll={false}
                            menuPlacement={'bottom'}
                            isDisabled={isProfile || isReportSuperAdmin}
                            placeholder=''
                            isModel={true}
                            isMulti={true}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(autoFetched[index] ? mandatoryReportsRole : []),
                                ...(mandatoryReportsRole || []),
                                ...(disabledRoles.current?.[index]?.REPORTS || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            options={reportRolesRef.current}
                            mandatoryOptions={mandatoryReportsRole ? mandatoryReportsRole : []}
                            disabledOptions={disabledRoles.current?.[index]?.REPORTS || []}
                            loading={isRolesLoading}
                            error={isError(meta) && !reportRoles?.length}
                            onChange={(values: any, { option, action }: { option: any; action: string }) => {
                              const currentAllRoles = [
                                ...(Array.isArray(spiceRole) ? spiceRole : [spiceRole]),
                                ...insightRoles,
                                ...values
                              ];
                              roleChange({
                                allRoles: currentAllRoles,
                                index,
                                appTypeBasedRoles
                              });
                              form.change(`${formName}[${index}].roles`, currentAllRoles);
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isInsights && (
                  <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                    <Field
                      name={`${name}.insightRoles`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label='Insights'
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
                                ...(autoFetched[index] ? mandatoryInsightsRole : []),
                                ...(mandatoryInsightsRole || []),
                                ...(disabledRoles.current?.[index]?.INSIGHTS || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            options={insightRolesRef.current}
                            mandatoryOptions={mandatoryInsightsRole ? mandatoryInsightsRole : []}
                            disabledOptions={disabledRoles.current?.[index]?.INSIGHTS || []}
                            loading={isRolesLoading}
                            error={isError(meta) && !reportRoles?.length}
                            onChange={(values: any) => {
                              const currentAllRoles = [
                                ...(Array.isArray(spiceRole) ? spiceRole : [spiceRole]),
                                ...reportRoles,
                                ...values
                              ];
                              roleChange({
                                allRoles: currentAllRoles,
                                index,
                                appTypeBasedRoles
                              });
                              form.change(`${formName}[${index}].roles`, currentAllRoles);
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {!isAdminForm && <div className='col-12' />}
                <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
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
                <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
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
                <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-12'} `}>
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
                    isHF={isHF}
                    isHFCreate={isHFCreate}
                    isSiteUser={isSiteUser}
                    onFindExistingUser={(user: IUser) => autoPopulateUserData(user, index)}
                    parentOrgId={
                      isSiteUser && !parentOrgId
                        ? form.getState()?.values?.users?.[0]?.healthfacility?.chiefdom?.tenantId
                        : parentOrgId
                    }
                    ignoreTenantId={
                      isSiteUser && !ignoreTenantId
                        ? form.getState()?.values?.users?.[0]?.healthfacility?.tenantId
                        : ignoreTenantId
                    }
                    tenantId={tenantId ? Number(tenantId) : undefined}
                  />
                </div>
                <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-8' : 'col-12'} `}>
                  <Field
                    name={`${name}.gender`}
                    render={(props) => (
                      <Radio
                        {...props}
                        isRadioSquare={true}
                        fieldLabel='Gender'
                        errorLabel='gender'
                        options={GENDER_OPTIONS}
                      />
                    )}
                  />
                </div>
                <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                  {isRegionCreate ? (
                    <Field
                      name={`${name}.countryCode`}
                      type='text'
                      validate={composeValidators(required, validateCountryCode)}
                      parse={convertToNumber}
                      format={(value: string) => formatCountryCode(value)}
                      render={({ input, meta }) => (
                        <TextInput
                          {...input}
                          disabled={true} // country code will get auto populated from region form
                          label='Country Code'
                          errorLabel='country code'
                          error={isError(meta)}
                        />
                      )}
                    />
                  ) : (
                    <Field
                      name={`${name}.countryCode`}
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
                  )}
                </div>
                <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                  <PhoneNumberField
                    id={form.getState().values.users[index]?.id}
                    fieldName='phoneNumber'
                    form={form}
                    name={name}
                    formName={formName}
                    index={index}
                    countryCode={
                      isRegionCreate
                        ? form.getState().values?.users[index]?.countryCode
                        : form.getState().values?.users[index]?.countryCode?.phoneNumberCode
                    }
                  />
                </div>
                {isSPICE &&
                  (isEdit
                    ? (showSpiceHFRef.current[index] && !(mandatoryRoles || []).length && (spiceRole || []).length) ||
                      (!isCommunity && isSiteUser && !isHF)
                    : showSpiceHFRef.current[index] && (!isEdit || isReportOrInsightUser)) && (
                    <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                      <Field
                        name={`${name}.${NAMING_VARIABLES.healthFacility}`}
                        type='text'
                        validate={required}
                        render={({ input, meta }) => {
                          return (
                            <SelectInput
                              {...(input as any)}
                              label={`Assigned ${healthfacilitySName}`}
                              errorLabel={`assigned ${healthfacilitySName.toLowerCase()}`}
                              labelKey='name'
                              valueKey='id'
                              options={newHFList}
                              loadingOptions={hfLoading}
                              error={isError(meta)}
                              isModel={true}
                              disabled={isProfile}
                              onChange={(hf: IHealthFacility) => {
                                emailDisabledFn('', index, false);
                                const formData = form.getState()?.values?.users?.[index];
                                const supervisorFieldData = `${formName}[${index}].supervisor`;
                                const villagesFieldData = `${formName}[${index}].villages`;

                                form.change(supervisorFieldData, null);
                                if (autoFetched[index] && formData?.selectedVillages?.length) {
                                  form.change(villagesFieldData, [
                                    ...(Array.isArray(formData?.selectedVillages) ? formData.selectedVillages : [])
                                  ]);
                                } else {
                                  form.change(villagesFieldData, []);
                                }

                                if (showVillage[index]) {
                                  fetchSupervisorList(
                                    formData?.organizations
                                      ? [...formData?.organizations?.map((v: any) => v?.id), hf?.tenantId].filter(
                                          (v: any) => v
                                        )
                                      : [hf.tenantId],
                                    index
                                  );
                                  fetchVillagesList(
                                    formData?.organizations
                                      ? [...formData?.organizations?.map((v: any) => v?.id), hf?.tenantId].filter(
                                          (v: any) => v
                                        )
                                      : [hf.tenantId],
                                    formData?.id,
                                    index
                                  );
                                }

                                input.onChange(hf);
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  )}
                {isReports && showReportHFRef.current[index] && (
                  <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                    <Field
                      name={`${name}.reportUserOrganization`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label={`${healthfacilitySName} for Reports`}
                            errorLabel={`${healthfacilitySName.toLowerCase()} for reports`}
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
                            options={healthFacilityList || []}
                            loadingOptions={hfLoading}
                            error={isError(meta)}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isInsights && showInsightHFRef.current[index] && (
                  <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
                    <Field
                      name={`${name}.insightUserOrganization`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label={`${healthfacilitySName} for Insights`}
                            errorLabel={`${healthfacilitySName.toLowerCase()} for insights`}
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
                            options={healthFacilityList || []}
                            loadingOptions={hfLoading}
                            error={isError(meta)}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                <DynamicCHForm
                  index={index}
                  form={form}
                  isProfile={isProfile}
                  name={name}
                  peerSupervisors={peerSupervisors}
                  peerSupervisorLoading={peerSupervisorLoading}
                  autoFetched={autoFetched}
                  villagesLoading={villagesLoading}
                  villages={villages}
                  isError={isError}
                  isChpUser={isCHWCHPUser[index]}
                  isChaUser={isCHAUser[index]}
                  communityList={communityList || []}
                  isHFCreate={isHFCreate}
                  showVillages={showVillage[index]}
                />
                <SiteUserForm
                  isAdminForm={isAdminForm}
                  index={index}
                  name={name}
                  autoFetched={autoFetched}
                  isError={isError}
                  isCultureListLoading={isCultureListLoading}
                  cultureList={cultureList || []}
                  communityList={communityList || []}
                  districtDetails={{ list: districtList || [], loading: districtLoading }}
                  chiefdomDetails={{ list: chiefdomList || [], loading: chiefdomLoading }}
                  siteRolesChange={siteRolesChange}
                  selectedAdmins={selectedAdmins}
                  role={role}
                  isProfile={isProfile}
                  isSiteUser={isSiteUser}
                  assignedHFListHFAdmin={assignedHFListHFAdmin}
                  hfLoading={hfLoading}
                  formDetails={{ form, formName, fields }}
                  isHFAdminSelected={isHFAdminSelected}
                  isHFCreate={isHFCreate}
                  isEdit={isEdit}
                  reportUserOnlyInAdminList={isReportOrInsightUser}
                />
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
