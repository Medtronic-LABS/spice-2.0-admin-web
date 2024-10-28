import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import TextInput from '../formFields/TextInput';
import {
  composeValidators,
  required,
  validateName,
  validateLastName,
  validateCountryCode,
  convertToNumber
} from '../../utils/validation';
import BinIcon from '../../assets/images/bin.svg';
import ResetIcon from '../../assets/images/reset.svg';
import Radio from '../formFields/Radio';
import SelectInput from '../formFields/SelectInput';
import APPCONSTANTS, {
  NAMING_VARIABLES,
  NAME_CONSTANTS,
  ADMIN_BASED_ON_URL,
  CFR_SUITEACCSESS_NAME
} from '../../constants/appConstants';
import PlusIcon from '../../assets/images/plus_blue.svg';
import EmailField from '../formFields/EmailField';
import { IRoles, IUser, IUserFormProps } from '../../store/user/types';
import MultiSelect from '../multiSelect/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import { isUserRolesLoading, roleSelector, userRolesSelector } from '../../store/user/selectors';
import {
  fetchCommunityListRequest,
  fetchCultureListRequest,
  fetchTimezoneListRequest,
  fetchUserRolesAction
} from '../../store/user/actions';
import userMeta from './userFormMeta';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  clearHFListRequest,
  clearSupervisorList,
  clearVillageHFList,
  fetchCountryListRequest,
  fetchHFListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListUserLinked
} from '../../store/healthFacility/actions';
import { districtLoadingSelector, getDistrictListSelector } from '../../store/district/selectors';
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
import {
  timezoneListSelector,
  loadingSelector,
  cultureListSelector,
  cultureListLoadingSelector,
  communityListSelector
} from '../../store/user/selectors';
import { IHealthFacility, IPeerSupervisor, IVillages } from '../../store/healthFacility/types';
import PhoneNumberField from '../formFields/PhoneNumber';
import useUserFormUtils from './userFormUtils';
import { DynamicCHForm } from './userConditionalFields/DynamicCHForm';
import { SiteUserForm } from './userConditionalFields/AdminFields';
import { clearChiefdomList, fetchChiefdomListRequest } from '../../store/chiefdom/actions';
import { chiefdomListSelector, chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { clearDistrictList, fetchDistrictListRequest } from '../../store/district/actions';
import { formatCountryCode, formatUserToastMsg } from '../../utils/commonUtils';
import { ActionMeta, OnChangeValue } from 'react-select';
import { useLocation } from 'react-router-dom';
import { REGION_ADMIN, REPORT_ADMIN, SUPER_ADMIN, SUPER_USER } from '../../routes';
import { filterRolesByAppTypeFn, roleBasedAppTypes } from '../../components_com/userForm/UserForm';

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

type ModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';

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
  hfTenantId, // tenantId from URL
  appTypes,
  data = [],
  autoFetchedDataState,
  autoFetchedState,
  chwState,
  disabledRolesState,
  roleOptionsState,
  isSiteUser = false,
  isAdminForm = false,
  defaultSelectedRole,
  isRegionCreate = false,
  parentOrgId,
  ignoreTenantId
}: IUserFormProps): React.ReactElement => {
  const idRefs = useRef([new Date().getTime()]);
  const { pathname } = useLocation();
  const formName = 'users';
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
  const { isCHASelected, isCHPSelected, isRoleExists, siteRolesChange, getSuiteAccessList, isHFAdminSelected } =
    useUserFormUtils();
  const { DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  const isRolesLoading = useSelector(isUserRolesLoading);
  const healthFacilityList = useSelector(healthFacilityListSelector);
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
  const isCountryListLoading = useSelector(countryLoadingSelector);
  const [peerSupervisors, setPeerSupervisors] = useState([[...peerSupervisorList.list]] as IPeerSupervisor[][]);
  const [villages, setVillages] = useState([[...villagesList.list]] as IVillages[][]);
  const [autoFetchData, setAutoFetchData] = useState(autoFetchedDataState?.autoFetchData || ([] as any[]));
  const [isCHAUser, setUserAsCHA] = useState(chwState?.isCHAUser || [false]);
  const [isCHPUser, setUserAsCHP] = useState([false]);
  const [selectedAdmins, setSelectedAdmins] = useState<string>('');
  const roleOptions = useRef<IRoles[][]>(roleOptionsState?.current || []);
  const disabledRoles = useRef<IRoles[][]>(disabledRolesState?.disabledRoles || ([] as IRoles[][]));
  const [autoFetched, setAutoFetched] = useState<boolean[]>(autoFetchedState?.autoFetch || ([] as boolean[]));
  const fetchedData = useRef([] as any[]);
  const [clearEmail, setClearEmail] = useState(false);
  const [insightsRole, setInsightsRole] = useState<IRoles[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { mobileRoles, adminRoles, superAdminRoles } = userMeta();
  const districtList = useSelector(getDistrictListSelector);
  const {
    district: { s: districtSName }
  } = NAME_CONSTANTS;
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
        culture: cultureList?.find((culture: { id: number }) => culture.id === APPCONSTANTS.DEFAULT_CULTURE.id),
        country: ''
      }
    ],
    [cultureList]
  );

  useEffect(() => {
    setAppTypeRoles(
      appTypes && appTypes.length === 1 ? filterRolesByAppTypeFn(rolesGrouped, appTypes[0]) : rolesGrouped
    );
  }, [appTypes, rolesGrouped]);

  const timezoneList = useSelector(timezoneListSelector);
  const isTmezoneListLoading = useSelector(loadingSelector);
  useEffect(() => {
    if (!(timezoneList || []).length) {
      dispatch(fetchTimezoneListRequest());
    }
    if (!(cultureList || []).length) {
      dispatch(fetchCultureListRequest());
    }

    if (isSiteUser && countryId && communityList && !(communityList || []).length) {
      const payload = {
        countryId,
        search: ''
      };
      dispatch(fetchCommunityListRequest(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isHF && isEdit) {
      const roleValues = initialEditValue?.role;
      if (!isSuperAdmin) {
        setIsSuperAdmin(roleValues?.some((element: any) => element.name === 'SUPER_ADMIN'));
      }
      if (!isSiteUser) {
        const [selectedAdminRole] = initialEditValue.role;
        setSelectedAdmins(selectedAdminRole?.name);
      }
    }
  }, [initialEditValue, isHF, isEdit, isSuperAdmin, isSiteUser]);

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
        hfTenantIds: isEdit
          ? (initialEditValue?.organizations || [])
              .filter((hfDetail: any) => hfDetail.formName === 'healthfacility')
              .map((org: any) => org.id)
          : [],
        role: (initialEditValue?.role || [])?.filter(
          (editedValue: { name: string; displayName: string | null }) =>
            editedValue?.name !== NAMING_VARIABLES.redRisk && editedValue?.displayName !== null
        ),
        mandatorySuiteAccess: initialEditValue?.suiteAccess,
        selectedRoles: initialEditValue?.role || [],
        selectedInsightsRole: initialEditValue?.spiceInsightsRole || [],
        culture:
          !isCultureListLoading &&
          cultureList?.find(
            (culture: { id: any }) => culture.id === (initialEditValue?.cultureId || APPCONSTANTS.DEFAULT_CULTURE.id)
          ),
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
        const [suiteAccess] = getSuiteAccessList(appTypeBasedRoles);
        fields.update(index, {
          ...form.getState().values?.users[index],
          role:
            isAdminForm && defaultSelectedRole
              ? [appTypeBasedRoles.SPICE?.find((spiceRole: IRoles) => spiceRole.name === defaultSelectedRole)]
              : [],
          suiteAccess: defaultSelectedRole ? [suiteAccess] : []
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

  /**
   * Handles the logic for super admin to peer supervisor conversion.
   * @param {IRoles[]} roles - The roles of the user
   */
  const SuperAdminToPeerSuperviserFn = useCallback(
    (roles: IRoles[]) => {
      if (isSuperAdmin && roles?.some((element: any) => element.name !== 'SUPER_ADMIN')) {
        if (healthFacilityList?.length === 0 && countryId) {
          dispatch(
            fetchHFListRequest({
              countryId,
              skip: 0,
              limit: null,
              userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER)
            })
          );
        }
      }
    },
    [isSuperAdmin, countryId, dispatch, role, healthFacilityList?.length]
  );
  useEffect(() => {
    levelBasedInsightsRole();
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
      dispatch(clearChiefdomList());
      dispatch(clearDistrictList());
      dispatch(clearHFListRequest());
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
    const userData = {
      ...user
    };
    userData.suiteAccess = userData.roles[0];
    userData.role = (userData.roles || []).filter((r: IRoles) => r.groupName === userData.suiteAccess.groupName) || [];
    if (isRoleExists(userData.role, ['SUPER_ADMIN', 'SUPER_USER'])) {
      emailDisabledFn(APPCONSTANTS.SUPER_ADMIN_USER_EXCEPTION_HF_CREATE, index);
    } else if (isCHPSelected(userData.role) && isHFCreate) {
      emailDisabledFn(APPCONSTANTS.CHP_USER_EXCEPTION_HF_CREATE, index);
    } else {
      form.change(`${formName}[${index}].countryCode`, '');
      setClearEmail(false);
      const allSuiteAccess = userData.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
      userData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      userData.role = userData.roles.filter((r: IRoles) => r.groupName === 'SPICE') || [];
      userData.spiceInsightsRole = userData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
      userData.supervisor = {
        ...userData.supervisor,
        name: `${userData.supervisor?.firstName || ''} ${userData.supervisor?.lastName || ''}`
      };
      userData.selectedRoles = [...(userData?.roles || [])];
      userData.mandatorySuiteAccess = userData.suiteAccess;
      const filteredUserRoles = userData?.roles?.filter(
        (roleToFilter: any) =>
          (roleToFilter.name !== NAMING_VARIABLES.redRisk &&
            roleToFilter?.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.mob) ||
          roleToFilter?.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.admin
      );
      userData.selectedVillages = [...(Array.isArray(userData.villages) ? userData.villages : [])];
      if (userData.organizations.length === 1) {
        const { formDataId: id, name } = userData.organizations[0];
        userData.healthFacility = { id, name };
      }
      if (showHealthFacilityFn(index)) {
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
        form.change(`${formName}[${index}].spiceInsightsRole`, userData.spiceInsightsRole || []);
        form.change(`${formName}[${index}].selectedInsightsRole`, userData.spiceInsightsRole || []);
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
        form.change(`${formName}[${index}].healthFacility`, userData.healthFacility || null);
        form.change(`${formName}[${index}].supervisor`, userData.supervisor || '');
        form.change(`${formName}[${index}].villages`, userData.villages || []);
        form.change(`${formName}[${index}].organizations`, userData.organizations || []);
        form.change(`${formName}[${index}].selectedVillages`, userData.selectedVillages || []);
        form.change(`${formName}[${index}].timezone`, userData.timezone || []);
        form.change(`${formName}[${index}].culture`, userData.culture || null);
        form.change(`${formName}[${index}].redRisk`, userData.redRisk || false);
      });
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = true;
      setAutoFetched(newAutoFetched);
      const newFetchedData = [...fetchedData.current];
      newFetchedData[index] = userData;
      fetchedData.current = newFetchedData;
      isCHUserSelectedFn(userData.role, index);
      updateRoleOptionsAndDisableRoles(index, userData.roles);
      if (isCHPSelected(userData.roles)) {
        const tenantIds = [...userData.organizations.map((v: any) => v.id), hfTenantId].filter((v: any) => v);
        fetchListWithConditions(selectedRoles(index), tenantIds, userData.id, 'village', index);
        fetchListWithConditions(selectedRoles(index), tenantIds, userData.id, 'supervisor', index);
      }
    }
  };

  // Function to filter health facilities by selected appTypes
  const filterHFByAppTypes = (selectedAppTypes: string[]) => {
    const filteredHFList = healthFacilityList.filter((hf) => {
      // Check if any clinical workflow's appTypes includes all the selectedAppTypes
      return [...(hf.clinicalWorkflows || []), ...(hf.customizedWorkflows || [])].some((workflow) => {
        return selectedAppTypes.some((type) => (workflow.appTypes || []).includes(type));
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
  }, [countryId, dispatch, isProfile, appTypeBasedRoles, isRegionCreate]);

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
                    dataToPush.role = [
                      appTypeBasedRoles.SPICE?.find((spiceRole: IRoles) => spiceRole.name === defaultSelectedRole)
                    ];
                  }
                  if ((isAdminForm && defaultSelectedRole) || isHFCreate) {
                    const [suiteAccess] = getSuiteAccessList(appTypeBasedRoles);
                    dataToPush.suiteAccess = [suiteAccess];
                  }
                  fields.push(dataToPush);
                }
          }
        >
          <img className='me-0dot5' src={PlusIcon} alt='' />
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
          <img className='me-0dot5' src={BinIcon} alt='' />
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
          <img className='me-0dot5' src={ResetIcon} alt='' />
          Reset Fields
        </div>
      </div>
    );

  const divider = (isLastChild: boolean) => {
    return !isLastChild && <div className='divider mx-neg-1dot25 mb-1dot5' />;
  };

  // roles based CHW related utils
  const selectedRoles = useCallback((index: number) => form.getState().values?.users?.[index]?.roles, [form]);

  /**
   * Updates the role options and disables roles based on the selected roles.
   * @param {number} index - The index of the form
   * @param {IRoles[]} mandatoryRoleOptions - The mandatory role options
   */
  const updateRoleOptionsAndDisableRoles = useCallback(
    (index: number, mandatoryRoleOptions?: IRoles[]) => {
      // role options
      const newRoleOptions = [...roleOptions.current];
      roleOptions.current = newRoleOptions;
      // role disable
      const newDisabledRoles = [...disabledRoles.current];
      let validRoles: string[] = [];
      // validation logic disabled until functionality confirmatiion
      // const selectedAllRoles = [...(selectedRoles(index) || [])];
      // const filteredSelectedRoles = selectedAllRoles.filter(
      //   (filteredRoles: any) =>
      //     filteredRoles.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.mob ||
      //     filteredRoles.suiteAccessName === APPCONSTANTS.SPICE_ROLE_SUITE_ACCESS.web
      // );
      // if (
      //   filteredSelectedRoles.some(
      //     (ro: IRoles) =>
      //       ro.name === APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_ASSISTANT ||
      //       ro.name === APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_PROMOTER
      //   )
      // ) {
      //   validRoles = (newRoleOptions[index] || [])
      //     .filter((newRole) => CHRoles.includes(newRole.name))
      //     .map((filteredRole) => filteredRole.name);
      // } else if (
      //   filteredSelectedRoles.some(
      //     (ro: IRoles) =>
      //       ro.name !== APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_ASSISTANT ||
      //       ro.name !== APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_PROMOTER
      //   )
      // ) {
      //   validRoles = (newRoleOptions[index] || [])
      //     .filter((newRole) => newRole.name === filteredSelectedRoles?.[0]?.name)
      //     .map((filteredRole) => filteredRole.name);
      // } else {
      // }
      validRoles = (newRoleOptions[index] || []).map((rr: IRoles) => rr.name) || [];
      newDisabledRoles[index] = [...(newRoleOptions[index] || [])].filter((r: IRoles) => {
        const isValidRole = !validRoles.includes(r.name);
        const isNotRedRiskOrHasDisplayName = r.name !== NAMING_VARIABLES.redRisk || r.displayName !== null;
        const isNotHealthFacilityAdmin = !(isHF || isHFCreate) ? r.name !== HEALTH_FACILITY_ADMIN : true;

        return isValidRole && isNotRedRiskOrHasDisplayName && isNotHealthFacilityAdmin;
      });

      disabledRoles.current = newDisabledRoles;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      adminRoles,
      isCHPSelected,
      isHF,
      isHFCreate,
      mobileRoles,
      appTypeBasedRoles,
      selectedRoles,
      superAdminRoles,
      selectedAdmins
    ]
  );

  /**
   * Handles the selection of CHA and CHP users.
   * @param {IRoles[]} roles - The roles of the user
   * @param {number} index - The index of the form
   */
  const isCHUserSelectedFn = useCallback(
    (roles: IRoles[], index: number) => {
      // getting CHA user selected status
      if (isSiteUser) {
        const newChaStatus = [...isCHAUser];
        newChaStatus[index] = isCHASelected(roles);
        setUserAsCHA(newChaStatus);

        // getting CHP user selected status
        const newChpStatus = [...isCHPUser];
        newChpStatus[index] = isCHPSelected(roles);
        setUserAsCHP(newChpStatus);
      }
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
  const fetchListWithConditions = (
    roles: IRoles[],
    tenantIds: number[] = [],
    userId: string,
    name: string,
    index: number
  ) => {
    if (isCHPSelected(roles) && tenantIds.length) {
      if (name === 'village') {
        return fetchVillagesList(tenantIds, userId, index);
      } else {
        return fetchSupervisorList(tenantIds, index);
      }
    }
  };

  /**
   * Fetches the health facility list based on the provided values.
   * @param {IRoles} values - The values object containing tenantIds
   */
  const chiefdomBasedHfList = useCallback(
    (values: IRoles) => {
      if (countryId) {
        dispatch(
          fetchHFListRequest({
            countryId,
            skip: 0,
            limit: null,
            tenantIds: values.tenantIds,
            userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER)
          })
        );
      }
    },
    [countryId, dispatch, role]
  );

  /**
   * Effect hook to fetch village and supervisor lists based on the initial edit data.
   */
  useEffect(() => {
    if (isEdit && !isProfile) {
      const tenantIds = [...initialEditData[0].hfTenantIds].filter((v: number) => v);
      fetchListWithConditions(selectedRoles(0), tenantIds, initialEditData[0]?.id, 'village', 0);
      fetchListWithConditions(selectedRoles(0), tenantIds, initialEditData[0]?.id, 'supervisor', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchData]);

  /**
   * Effect hook to handle CH user selection.
   */
  useEffect(() => {
    if (isEdit) {
      if (isSiteUser) {
        isCHUserSelectedFn(form.getState()?.values?.users[0]?.role, 0);
      }
    }
  }, [form, isCHUserSelectedFn, isEdit, isProfile, selectedRoles, isSiteUser]);

  /**
   * Initializes the data for the user form.
   */
  const initData = useCallback(() => {
    const [suiteAccess] = getSuiteAccessList(appTypeBasedRoles);
    roleOptions.current = [appTypeBasedRoles.SPICE];
    if (isEdit) {
      setAutoFetchData(initialEditData);
    } else if (data.length) {
      setAutoFetchData(data);
    } else if (isAdminForm && defaultSelectedRole) {
      if (appTypeBasedRoles.SPICE) {
        const selectedRole = appTypeBasedRoles.SPICE?.find(
          (spiceRole: IRoles) => spiceRole.name === defaultSelectedRole
        );
        levelBasedInsightsRole(selectedRole?.level);
        const initialEditDataForRole = {
          role: [selectedRole],
          suiteAccess: [suiteAccess]
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

  // Default Role selection
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

  /**
   * Filters and returns a list of admin roles based on specific conditions.
   * @returns {IRoles[]} A filtered array of roles that match the given conditions.
   */
  const getAdminRoles = (): IRoles[] => {
    const filteredRoles = roleOptions.current?.[0]?.filter((roleData: any) => {
      const { name, displayName, suiteAccessName } = roleData;
      const suiteNameLower = suiteAccessName?.toLowerCase() || '';
      // Early exits for 'RED_RISK_USER' or null display name
      if (name === NAMING_VARIABLES.redRisk || displayName === null) {
        return false;
      }
      if (isHFCreate) {
        return (
          (suiteNameLower !== APPCONSTANTS.spiceRole.spice || name === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) &&
          name !== APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_PROMOTER
        );
      }
      // Health facility conditions
      if (isHF) {
        return name === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN || suiteNameLower !== APPCONSTANTS.spiceRole.spice;
      }
      // Site user condition
      if (isSiteUser) {
        return suiteNameLower !== APPCONSTANTS.spiceRole.spice;
      }

      // District level condition
      const isDistrictLevel = fetchingFor === ADMIN_BASED_ON_URL.district;
      const isChiefdomOrHealthFacility =
        fetchingFor === ADMIN_BASED_ON_URL.chiefdom &&
        (role === APPCONSTANTS.ROLES.SUPER_USER || role === APPCONSTANTS.ROLES.SUPER_ADMIN);
      const isHealthFacility =
        fetchingFor === ADMIN_BASED_ON_URL['health-facility'] &&
        (role === APPCONSTANTS.ROLES.SUPER_USER || role === APPCONSTANTS.ROLES.SUPER_ADMIN);

      if (isDistrictLevel) {
        return (
          suiteNameLower === APPCONSTANTS.spiceRole.spice &&
          name !== APPCONSTANTS.ROLES.REGION_ADMIN &&
          name !== APPCONSTANTS.ROLES.SUPER_ADMIN
        );
      }

      if (isChiefdomOrHealthFacility) {
        return (
          suiteNameLower === APPCONSTANTS.spiceRole.spice &&
          name !== ADMIN_BASED_ON_URL.chiefdom &&
          name !== APPCONSTANTS.ROLES.REGION_ADMIN &&
          name !== APPCONSTANTS.ROLES.SUPER_ADMIN
        );
      }

      if (isHealthFacility) {
        return (
          suiteNameLower === APPCONSTANTS.spiceRole.spice &&
          name !== ADMIN_BASED_ON_URL.chiefdom &&
          name !== APPCONSTANTS.ROLES.REGION_ADMIN &&
          name !== APPCONSTANTS.ROLES.SUPER_ADMIN &&
          name !== ADMIN_BASED_ON_URL['health-facility']
        );
      }

      // Default fallback
      return suiteNameLower === APPCONSTANTS.spiceRole.spice;
    });

    // Return filtered roles or an empty array if undefined or null
    return filteredRoles ?? [];
  };

  /**
   * Filters roles based on the user's level for SPICE INSIGHTS and sets the insightsRole state.
   *
   * @param {number} level - The user level used to filter roles.
   */
  const levelBasedInsightsRole = (level?: number) => {
    const filteredRoles = appTypeBasedRoles['SPICE INSIGHTS']?.filter((roleData: any) => {
      const commonRole = roleData.suiteAccessName === CFR_SUITEACCSESS_NAME.quickSight;
      if (isSiteUser) {
        return level
          ? roleData.level === level || commonRole
          : roleData.suiteAccessName === CFR_SUITEACCSESS_NAME.user || commonRole;
      } else {
        return level
          ? roleData.level === level || commonRole
          : roleData.suiteAccessName === CFR_SUITEACCSESS_NAME.admin || commonRole;
      }
    });
    setInsightsRole(filteredRoles || []);
  };

  const showHealthFacilityFn = (index: number) => {
    const { roles: allRoles, healthFacility } = form.getState().values?.users?.[index] || [];
    const isHFAdmin =
      !isHFCreate &&
      !isHF &&
      !isEdit &&
      isSiteUser &&
      !(allRoles || []).some((userRole: IRoles) => [SUPER_ADMIN, SUPER_USER, REPORT_ADMIN].includes(userRole.name));

    if (!isHFAdmin && healthFacility?.id) {
      form.change(`${formName}[${index}].healthFacility`, null);
    }
    return isHFAdmin;
  };

  /**
   * Fetches district details based on the health facility tenant ID.
   */
  const fetchDetails = useCallback(() => {
    dispatch(
      fetchDistrictListRequest({
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
   */
  useEffect(() => {
    const districtDataId = form.getState().values.users?.[0]?.district?.tenantId;
    const [existingDistrict] = initialEditData;

    const existingDistrictId = existingDistrict?.organizations?.filter(
      (formData: { formName: string }) => formData.formName === NAMING_VARIABLES.district
    );
    const { defaultRoleName = '' } = existingDistrict;

    let districtId = null;
    if (role === DISTRICT_ADMIN) {
      districtId = hfTenantId;
    } else if (defaultRoleName === HEALTH_FACILITY_ADMIN) {
      districtId = null;
    } else {
      districtId = districtDataId || existingDistrictId?.[0]?.id;
    }
    if (districtId && !isSiteUser) {
      dispatch(fetchChiefdomListRequest({ tenantId: districtId }));
    } else if (!isSiteUser && fetchingFor === REGION_ADMIN && hfTenantId) {
      dispatch(fetchChiefdomListRequest({ tenantId: String(hfTenantId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values.users?.[0]?.district?.tenantId]);

  /**
   * Effect hook to fetch chiefdom details based on the selected admins.
   */
  useEffect(() => {
    const chiefdomData = form.getState().values.users?.[0]?.chiefdom;
    const [existingDistrict] = initialEditData;
    const existingchiefdomDataId = existingDistrict?.organizations?.filter(
      (formData: { formName: string }) => formData.formName === NAMING_VARIABLES.district
    );
    const chiefdomDetails = chiefdomData ?? existingchiefdomDataId?.[0];
    const chiefdomId = role === CHIEFDOM_ADMIN ? hfTenantId : chiefdomData?.tenantId ?? existingchiefdomDataId?.[0]?.id;
    if (chiefdomId) {
      chiefdomBasedHfList({ ...chiefdomDetails, tenantIds: [chiefdomId] });
    } else if (!isSiteUser && healthFacilityList.length === 0 && fetchingFor === ADMIN_BASED_ON_URL.chiefdom) {
      chiefdomBasedHfList({ ...chiefdomDetails, tenantIds: [hfTenantId] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getState().values.users?.[0]?.chiefdom?.tenantId]);

  useEffect(() => {
    if (initialEditData && initialEditData.length > 0) {
      const [levels] = initialEditData
        .flatMap((initialData) => initialData.role)
        .map((initialRole) => initialRole?.level)
        .filter((level) => level !== undefined);
      if (levels) {
        levelBasedInsightsRole(levels);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEditData, isAdminForm]);

  useEffect(() => {
    // healthFacility auto populate for insight role and culture input fields
    const [selectedHf] = form.getState()?.values?.users;
    if (selectedHf?.role) {
      setSelectedAdmins(selectedHf?.role?.name);
      levelBasedInsightsRole(selectedHf?.role?.level);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getState()?.values?.users?.[0]?.role?.name]);

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
            selectedInsightsRole: mandatoryInsightsRole = [],
            suiteAccess: formSuiteAccess = [],
            roles: allRoles = [],
            role: spiceRole = [],
            spiceInsightsRole = []
          } = form.getState().values?.users?.[index];
          const isSPICE = (formSuiteAccess || []).some(
            (v: any) => v?.groupName === APPCONSTANTS.spiceRoleGrouped.spice
          );
          const isSPICEInsights = (formSuiteAccess || []).some(
            (v: any) => v?.groupName === APPCONSTANTS.spiceRoleGrouped.spiceInsights
          );
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
                        isClearable={!isAdminForm && !isEdit && !autoFetched[index]}
                        mandatoryOptions={
                          isAdminForm ? (isEdit ? mandatorySuiteAccess : [suiteAccess[0]]) : mandatorySuiteAccess || ''
                        }
                        onChange={(values: OnChangeValue<any, true>, actionMeta: ActionMeta<any>) => {
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
                          isCHUserSelectedFn(spiceRole, index);
                          updateRoleOptionsAndDisableRoles(index);
                          input.onChange(values);
                        }}
                      />
                    )}
                  />
                </div>
                {(isSPICE || isAdminForm) && (
                  <div className={`${'col-sm-6'} `}>
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
                            options={getAdminRoles()}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(autoFetched[index] || mandatoryRoles ? mandatoryRoles : []),
                                ...(disabledRoles.current[index] || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            mandatoryOptions={mandatoryRoles ? mandatoryRoles : []}
                            disabledOptions={disabledRoles.current[index]}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            onChange={(values: any, key: number) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].role`, [...values]);
                              form.change(`${formName}[${index}].roles`, [...spiceInsightsRole, ...values]);
                              // User Modified as Peer Superviser from Super Admin
                              SuperAdminToPeerSuperviserFn(values);
                              // CHW User selection
                              isCHUserSelectedFn(values, index);
                              updateRoleOptionsAndDisableRoles(index, values);
                              // Healthfacility create admin page included healthfacility admin
                              const [isHFSelected] = values.filter(
                                (selectedName: any) => selectedName?.name === HEALTH_FACILITY_ADMIN
                              );
                              levelBasedInsightsRole(isHFSelected?.level ? isHFSelected?.level : null);
                              // fetch HF list based on CHW selection
                              if (isCHPSelected(values)) {
                                if (!isEdit && !autoFetched[index]) {
                                  // To clear the Selected village during Add User
                                  form.batch(() => {
                                    form.change(`${formName}[${index}].villages`, {});
                                  });
                                }
                                const tenantIds = [
                                  ...(initialEditData[index]?.hfTenantIds || []),
                                  form.getState().values?.users?.[0]?.healthfacility?.tenantId,
                                  ...((fetchedData.current[index] || {}).organizations || []).map((v: any) => v.id),
                                  isHF ? hfTenantId : undefined // Include hfTenantId only when isHF is true
                                ].filter((v: number | undefined) => v); // Filtering out undefined values
                                fetchListWithConditions(
                                  selectedRoles(index),
                                  tenantIds,
                                  initialEditData[0]?.id,
                                  'village',
                                  index
                                );
                                fetchListWithConditions(
                                  selectedRoles(index),
                                  tenantIds,
                                  initialEditData[0]?.id,
                                  'supervisor',
                                  index
                                );
                              }

                              // Other than chp role village must be clear
                              if (!isCHPSelected(values)) {
                                form.batch(() => {
                                  form.change(`${formName}[${index}].villages`, {});
                                });
                              }
                              input.onChange(values);
                            }}
                          />
                        ) : (
                          <SelectInput
                            {...(input as any)}
                            label={'SPICE Role'}
                            errorLabel='Please select role.'
                            labelKey='displayName'
                            valueKey='id'
                            options={!isProfile ? getAdminRoles() : []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            isModel={true}
                            disabled={(isAdminForm && defaultSelectedRole) || isEdit}
                            onChange={(values: any) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].roles`, [...spiceInsightsRole, values]);
                              form.change(`${formName}[${index}].spiceInsightsRole`, []);
                              levelBasedInsightsRole(values.level);
                              setSelectedAdmins(values?.name);
                              // fetch HF list based on CHW selection
                              input.onChange(values);
                              // fetch culture list HF admin
                              if (values.name === HEALTH_FACILITY_ADMIN && cultureList && !cultureList.length) {
                                dispatch(fetchCultureListRequest());
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isAdminForm && !isSPICEInsights && <div className={'col-sm-6'}>{}</div>}
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
                                ...(autoFetched[index] ? mandatoryInsightsRole : []),
                                ...(disabledRoles.current[index] || []),
                                ...(mandatoryInsightsRole || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            options={insightsRole}
                            mandatoryOptions={mandatoryInsightsRole ? mandatoryInsightsRole : []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceInsightsRole?.length}
                            onChange={(values: any) => {
                              if (spiceRole.length) {
                                form.change(`${formName}[${index}].roles`, [...[spiceRole], ...values]);
                              } else {
                                form.change(`${formName}[${index}].roles`, [...[spiceRole], ...values]);
                              }
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {(formSuiteAccess || []).length === 1 && !isAdminForm && <div className='col-sm-6 col-12' />}
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
                      <Radio
                        {...props}
                        isRadioSquare={true}
                        fieldLabel='Gender'
                        errorLabel='gender'
                        options={APPCONSTANTS.GENDER_OPTIONS}
                      />
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
                  />
                </div>
                <div className='col-sm-6 col-12'>
                  {isRegionCreate ? (
                    <Field
                      name={`${name}.countryCode`}
                      type='text'
                      validate={composeValidators(required, validateCountryCode)}
                      parse={convertToNumber}
                      format={(value: string) => formatCountryCode(value)}
                      render={({ input, meta }) => (
                        <TextInput {...input} label='Country Code' errorLabel='country code' error={isError(meta)} />
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
                <div className='col-sm-6 col-12'>
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
                {showHealthFacilityFn(index) && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.${NAMING_VARIABLES.healthFacility}`}
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
                            options={newHFList}
                            loadingOptions={hfLoading}
                            error={isError(meta)}
                            isModel={true}
                            disabled={isProfile || isEdit}
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

                              if (isCHPUser[index]) {
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
                  isChpUser={isCHPUser[index]}
                  isChaUser={isCHAUser[index]}
                  communityList={communityList || []}
                  isHFCreate={isHFCreate}
                />
                <SiteUserForm
                  isAdminForm={isAdminForm}
                  index={index}
                  name={name}
                  autoFetched={autoFetched}
                  isError={isError}
                  isCultureListLoading={isCultureListLoading}
                  cultureList={cultureList || []}
                  isTmezoneListLoading={isTmezoneListLoading}
                  timezoneList={timezoneList || []}
                  communityList={communityList || []}
                  districtDetails={{ list: districtList || [], loading: districtLoading }}
                  chiefdomDetails={{ list: chiefdomList || [], loading: chiefdomLoading }}
                  siteRolesChange={siteRolesChange}
                  selectedAdmins={selectedAdmins}
                  role={role}
                  isSiteUser={isSiteUser}
                  healthFacilityList={healthFacilityList}
                  hfLoading={hfLoading}
                  chiefdomBasedHfList={chiefdomBasedHfList}
                  formDetails={{ form, formName, fields }}
                  isHFAdminSelected={isHFAdminSelected}
                  isHFCreate={isHFCreate}
                  isEdit={isEdit}
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
