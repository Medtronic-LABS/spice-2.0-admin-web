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
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
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
  fetchUnlinkedVillagesRequest,
  fetchVillagesListFromHFRequest,
  fetchVillagesListUserLinked
} from '../../store/healthFacility/actions';
import { countyLoadingSelector, getCountyListSelector } from '../../store/county/selectors';
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
import { SiteUserForm } from './userConditionalFields/SiteUserForm';
import { fetchSubCountyListRequest } from '../../store/subCounty/actions';
import { subCountyListSelector, subCountyLoadingSelector } from '../../store/subCounty/selectors';
import { fetchCountyListRequest } from '../../store/county/actions';
import { formatUserToastMsg } from '../../utils/commonUtils';

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
  roleOptionsState,
  isSiteUser = false,
  isAdminForm = false,
  defaultSelectedRole
}: IUserFormProps): React.ReactElement => {
  const idRefs = useRef([new Date().getTime()]);
  const { pathname } = useLocation();
  const formName = 'users';
  const dispatch = useDispatch();
  const rolesGrouped = useSelector(userRolesSelector);
  const { isCHASelected, isCHPSelected, isRoleExists, siteRolesChange } = useUserFormUtils();
  const { ACCOUNT_ADMIN, HEALTH_FACILITY_ADMIN, SUB_COUNTY_ADMIN } = APPCONSTANTS.ROLES;
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
  const subCountyList = useSelector(subCountyListSelector);
  const subCountyLoading = useSelector(subCountyLoadingSelector);
  const countyLoading = useSelector(countyLoadingSelector);
  const role = useSelector(roleSelector);
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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showHealthFacilityInput, setShowHealthFacilityInput] = useState(false);
  const { mobileRoles, adminRoles, peerSupervisorRoles, superAdminRoles, hfCreateRoles } = userMeta();
  const countyList = useSelector(getCountyListSelector);
  const { county: countyModuleName } = NAME_CONSTANTS;
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

  const timezoneList = useSelector(timezoneListSelector);
  const isTmezoneListLoading = useSelector(loadingSelector);
  useEffect(() => {
    if (!(timezoneList || []).length) {
      dispatch(fetchTimezoneListRequest());
    }
    if (isSiteUser && cultureList && !cultureList.length) {
      dispatch(fetchCultureListRequest());
    }

    if (isSiteUser && communityList && !communityList.length) {
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
        getSelectedAdmin(selectedAdminRole);
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
        roleOptionsState.current = roleOptions.current || [];
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

  const initialEditData = useMemo<Array<Partial<any>>>(
    () => [
      {
        ...initialEditValue,
        hfTenantIds: isEdit ? (initialEditValue?.organizations || []).map((org: any) => org.id) : [],
        culture:
          !isCultureListLoading &&
          cultureList?.find(
            (culture: { id: any }) => culture.id === (initialEditValue?.cultureId || APPCONSTANTS.DEFAULT_CULTURE.id)
          )
      }
    ],
    [cultureList, initialEditValue, isCultureListLoading, isEdit]
  );

  const resetAdminForm = useCallback(
    (fields: any, index: number) => {
      form.mutators?.resetFields?.(`${formName}[${index}]`);
      fields.update(index, { ...initialValue[0] });
      if (isAdminForm && defaultSelectedRole) {
        fields.update(index, {
          ...form.getState().values?.users[index],
          role: [rolesGrouped.SPICE?.find((spiceRole: IRoles) => spiceRole.name === defaultSelectedRole)]
        });
      }
      disabledRoles.current = [];
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = false;
      setAutoFetched(newAutoFetched);
    },
    [form, initialValue, isAdminForm, defaultSelectedRole, autoFetched, rolesGrouped.SPICE]
  );

  const SuperAdminToPeerSuperviserFn = useCallback(
    (roles: IRoles[]) => {
      if (isSuperAdmin && roles?.some((element: any) => element.name !== 'SUPER_ADMIN')) {
        if (healthFacilityList?.length === 0) {
          dispatch(
            fetchHFListRequest({
              countryId,
              skip: 0,
              limit: null,
              userBased: !(role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER)
            })
          );
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
      dispatch(clearChiefdomList());
      dispatch(clearDistrictList());
      dispatch(clearHFListRequest());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phNumberFieldRef = React.createRef<{ resetPhoneNumberField?: (value?: string) => void }>();

  const autoPopulateUserData = (user: any, index: number) => {
    phNumberFieldRef.current?.resetPhoneNumberField?.(user.phoneNumber);
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
    } else if (isCHPSelected(userData.role) && isHFCreate) {
      emailDisabledFn(APPCONSTANTS.CHW_USER_EXCEPTION_HF_CREATE);
    } else {
      form.change(`${formName}[${index}].countryCode`, '');
      setClearEmail(false);
      const allSuiteAccess = userData.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
      userData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      userData.role = userData.roles.filter((r: IRoles) => r.groupName === 'SPICE') || [];
      userData.reportRoles = userData.roles.filter((r: IRoles) => r.groupName === 'REPORTS') || [];
      userData.supervisor = {
        ...userData.supervisor,
        name: `${userData.supervisor?.firstName || ''} ${userData.supervisor?.lastName || ''}`
      };
      userData.selectedRoles = [...(userData.role || [])];
      userData.selectedReportRoles = [...(userData.reportRoles || [])];
      userData.selectedVillages = [...(Array.isArray(userData.villages) ? userData.villages : [])];
      if (userData.organizations.length === 1) {
        const { formDataId: id, name, id: tenantId } = userData.organizations[0];
        userData.healthFacility = { id, name, tenantId };
      }
      form.batch(() => {
        form.change(`${formName}[${index}].id`, userData.id || '');
        form.change(`${formName}[${index}].suiteAccess`, userData.suiteAccess || null);
        form.change(`${formName}[${index}].role`, userData.role || []);
        form.change(`${formName}[${index}].roles`, userData.roles || []);
        form.change(`${formName}[${index}].reportRoles`, userData.reportRoles || []);
        form.change(`${formName}[${index}].selectedRoles`, userData.selectedRoles || []);
        form.change(`${formName}[${index}].selectedReportRoles`, userData.selectedReportRoles || []);
        form.change(`${formName}[${index}].firstName`, userData?.firstName || '');
        form.change(`${formName}[${index}].lastName`, userData.lastName || '');
        form.change(`${formName}[${index}].gender`, userData.gender || '');
        form.change(`${formName}[${index}].country`, userData.country || null);
        form.change(`${formName}[${index}].countryCode`, {
          phoneNumberCode: userData.countryCode || '',
          id: userData.countryCode
        });
        form.change(`${formName}[${index}].phoneNumber`, userData.phoneNumber || '');
        form.change(`${formName}[${index}].username`, userData.username || '');
        form.change(`${formName}[${index}].healthFacility`, userData.healthFacility || null);
        form.change(`${formName}[${index}].supervisor`, userData.supervisor || '');
        form.change(`${formName}[${index}].villages`, userData.villages || []);
        form.change(`${formName}[${index}].organizations`, userData.organizations || []);
        form.change(`${formName}[${index}].selectedVillages`, userData.selectedVillages || []);
        form.change(`${formName}[${index}].timezone`, userData.timezone || []);
        form.change(`${formName}[${index}].culture`, userData.culture || []);
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

  useEffect(() => {
    if (!countryList.length) {
      dispatch(fetchCountryListRequest());
    }
  }, [countryList.length, dispatch]);
  useEffect(() => {
    if (!rolesGrouped?.hasOwnProperty('SPICE') && !isProfile && (countryId || isRegionCreate)) {
      dispatch(
        fetchUserRolesAction({
          countryId: countryId || null,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [countryId, dispatch, isProfile, rolesGrouped, isRegionCreate]);

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
                  const dataToPush = { ...initialValue[0] };
                  if (isAdminForm && defaultSelectedRole) {
                    dataToPush.role = [
                      rolesGrouped.SPICE?.find((spiceRole: IRoles) => spiceRole.name === defaultSelectedRole)
                    ];
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
            phNumberFieldRef.current?.resetPhoneNumberField?.();
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

  const updateRoleOptionsAndDisableRoles = useCallback(
    (index: number, mandatoryRoleOptions?: IRoles[]) => {
      // role options
      const newRoleOptions = [...roleOptions.current];
      if (isHFCreate && (mandatoryRoleOptions ? !isCHPSelected(mandatoryRoleOptions) : true)) {
        newRoleOptions[index] = (rolesGrouped.SPICE ? [...rolesGrouped.SPICE] : [])
          .filter((r: IRoles) => hfCreateRoles.includes(r.name))
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));
      } else if (isHF) {
        newRoleOptions[index] = (rolesGrouped.SPICE ? [...rolesGrouped.SPICE] : [])
          .filter((r: IRoles) => r.name !== 'SUPER_ADMIN')
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));
      } else {
        newRoleOptions[index] = (rolesGrouped.SPICE ? [...rolesGrouped.SPICE] : []).sort((a: any, b: any) =>
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
      } else if (selectedAllRoles.some((ro: IRoles) => peerSupervisorRoles.includes(ro.name))) {
        validRoles = peerSupervisorRoles;
      } else if (selectedAllRoles.some((ro: IRoles) => superAdminRoles.includes(ro.name))) {
        validRoles = superAdminRoles;
      } else if (selectedAllRoles.some((ro: IRoles) => reportAdminRole.includes(ro.name))) {
        validRoles = superAdminRoles;
      } else if (selectedAllRoles.some((ro: IRoles) => facilityReportAdminRole.includes(ro.name))) {
        validRoles = [...adminRoles, ...chwPeerRoles];
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
      isCHPSelected,
      isHF,
      isHFCreate,
      onlyCHWRoles,
      rolesGrouped,
      selectedRoles,
      superAdminRoles,
      selectedAdmins
      superAdminRoles,
      selectedAdmins
    ]
  );

  const isCHUserSelectedFn = useCallback(
    (roles: IRoles[], index: number) => {
      // getting CHA user selected status
      const newChaStatus = [...isCHAUser];
      newChaStatus[index] = isCHASelected(roles);
      setUserAsCHA(newChaStatus);

      // getting CHP user selected status
      const newChpStatus = [...isCHPUser];
      newChpStatus[index] = isCHPSelected(roles);
      setUserAsCHP(newChpStatus);
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
      if (tenantIds.length) {
        const getSelectedHFDetails: any = healthFacilityList.filter((HFData: any) => {
          return HFData.tenantId === tenantIds[index];
        });
        const [HFDetails] = getSelectedHFDetails || [];
        dispatch(
          fetchVillagesListFromHFRequest({
            countryId,
            countyId: HFDetails?.county?.id,
            subCountyId: HFDetails?.subCounty?.id,
            successCb: ({ list }: { list: IVillages[] }) => {
              const newVillages = [...villages];
              newVillages[index] = list;
              setVillages(newVillages);
            }
          })
        );
      }
    },
    [countryId, dispatch, healthFacilityList, villages]
  );

  // Common function for the supervisor and village list fetch with conditions
  const fetchListWithConditions = (roles: IRoles[], tenantIds: number[] = [], name: string, index: number) => {
    if (isCHPSelected(roles) && tenantIds.length) {
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
          userBased: !(role === SUPER_ADMIN || role === SUPER_USER)
        })
      );
    }
  }, [countryId, dispatch, healthFacilityList?.length, isEdit, isHF, role]);

  useEffect(() => {
    if (isEdit && !isProfile) {
      const tenantIds = [...initialEditData[0].hfTenantIds, hfTenantId].filter((v: number) => v);
      fetchListWithConditions(selectedRoles(0), tenantIds, initialEditData[0]?.id, 'village', 0);
      fetchListWithConditions(selectedRoles(0), tenantIds, initialEditData[0]?.id, 'supervisor', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchData]);

  const isChwSingleHf = useCallback(() => {
    if (!isEdit && healthFacilityList.length === 1) {
      fetchSupervisorList([healthFacilityList[0].tenantId], 0);
      fetchVillagesList([healthFacilityList[0].tenantId], undefined, 0);
    }
  }, [fetchSupervisorList, fetchVillagesList, healthFacilityList, isEdit]);

  useEffect(() => {
    isChwSingleHf();
  }, [isChwSingleHf]);

  useEffect(() => {
    if (isEdit) {
      if (isSiteUser) {
        isCHUserSelectedFn(form.getState()?.values?.users[0]?.role, 0);
      }
    }
  }, [form, isCHUserSelectedFn, isEdit, isProfile, selectedRoles, isSiteUser]);

  const initData = useCallback(() => {
    const [suiteAccess] = getSuiteAccessList(rolesGrouped);
    if (isEdit) {
      setAutoFetchData(initialEditData);
    } else if (data.length) {
      setAutoFetchData(data);
    } else if (isAdminForm && defaultSelectedRole) {
      const selectedRole: IRoles[] = [];
      if (rolesGrouped.SPICE) {
        selectedRole.push(rolesGrouped.SPICE?.find((spiceRole: IRoles) => spiceRole.name === defaultSelectedRole));
      }
      const initialEditDataForRole = {
        role: selectedRole
      };
      setAutoFetchData([initialEditDataForRole]);
    } else {
      const initialEditDataForRole = {
        suiteAccess: [suiteAccess]
      };
      roleOptions.current = [rolesGrouped.SPICE];
      setAutoFetchData([initialEditDataForRole]);
    }
  }, [initialValue, isEdit, rolesGrouped.SPICE]);

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

  const getAdminRoles = () => {
    const filteredRoles = roleOptions.current?.[0]?.filter((roleData: any) => {
      if (isSiteUser) {
        return roleData.suiteAccessName.toLowerCase() !== 'admin';
      } else {
        return roleData.suiteAccessName.toLowerCase() === 'admin';
      }
    });
    return filteredRoles || [];
  };

  const getSelectedAdmin = (value: any) => {
    setSelectedAdmins(value.name);
  };

  const fetchDetails = useCallback(() => {
    dispatch(
      fetchCountyListRequest({
        tenantId: String(countryId),
        isActive: true,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_FETCH_ERROR, countyModuleName)
            )
          )
      })
    );
  }, [countryId, dispatch]);

  useEffect(() => {
    if ([ACCOUNT_ADMIN, HEALTH_FACILITY_ADMIN, SUB_COUNTY_ADMIN].includes(selectedAdmins)) {
      fetchDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchDetails, selectedAdmins]);

  useEffect(() => {
    const countyId = form.getState().values.users?.[0]?.county?.tenantId;
    if (countyId) {
      dispatch(fetchSubCountyListRequest({ tenantId: countyId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values.users?.[0]?.county?.tenantId]);

  return (
    <FieldArray name={formName} initialValue={autoFetchData}>
      {({ fields }) =>
        fields.map((name: string, index: number) => {
          const isLastChild = (fields?.length || 0) === index + 1;
          const emailFieldRef = React.createRef<{ resetEmailField?: () => void }>();

          // SUITE options
          const suiteAccess = getSuiteAccessList(rolesGrouped);
          const {
            selectedRoles: mandatoryRoles = [],
            selectedReportRoles: mandatoryReportRoles = [],
            suiteAccess: formSuiteAccess = [],
            selectedSuiteAccess = [],
            roles: allRoles = [],
            role: spiceRole = [],
            reportRoles = []
          } = { ...form.getState().values?.users?.[index] };
          const isSPICE = (formSuiteAccess || []).some((v: any) => v.groupName === 'SPICE');
          const isSPICEReports = (formSuiteAccess || []).some((v: any) => v.groupName === 'REPORTS');
          getReportRoles(index, undefined, undefined, formSuiteAccess, true);

          return (
            <span key={`form_${idRefs.current[index]}`}>
              <div className='row gx-1dot25'>
                <Field name={`${name}.id`} render={() => null} />{' '}
                {/** A hidden field to store user id if user is auto populated */}
                {!isAdminForm && (
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
                            isCHUserSelectedFn(spiceRole, index);
                            updateRoleOptionsAndDisableRoles(index);
                            input.onChange(values);
                          }}
                        />
                      )}
                    />
                  </div>
                )}
                {(isSPICE || isAdminForm) && (
                  <div className={`${!isAdminForm ? 'col-sm-6' : 'col-12'} `}>
                    <Field
                      name={`${name}.role`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return isSiteUser ? (
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
                            required={true}
                            options={getAdminRoles()}
                            mandatoryOptions={autoFetched[index] ? mandatoryRoles : []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            onChange={(values: any, { option }: { option: any }) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].roles`, [...reportRoles, ...values]);
                              const disabledInsRoles = getReportRoles(index, values);
                              // Reports Role selection
                              form.change(
                                `${formName}[${index}].reportRoles`,
                                (reportRoles || []).filter(
                                  (v: IRoles) => !disabledInsRoles.some((d) => d.name === v.name)
                                )
                              );
                              // CHW User selection
                              isCHUserSelectedFn(values, index);
                              updateRoleOptionsAndDisableRoles(index, values);
                              getSelectedAdmin(values);
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
                                  form.getState().values?.users?.[0]?.healthFacility?.tenantId,
                                  ...((fetchedData.current[index] || {}).organizations || []).map((v: any) => v.id),
                                  isHF ? hfTenantId : []
                                ].filter((v: number) => v);
                                fetchListWithConditions(
                                  selectedRoles(index),
                                  tenantIds,
                                  initialEditData[index]?.id,
                                  'village',
                                  index
                                );
                                fetchListWithConditions(
                                  selectedRoles(index),
                                  tenantIds,
                                  initialEditData[index]?.id,
                                  'supervisor',
                                  index
                                );
                              }

                              input.onChange(values);
                            }}
                          />
                        ) : (
                          <SelectInput
                            {...(input as any)}
                            label={isAdminForm ? 'Role' : 'SPICE Role'}
                            errorLabel='Please select at least one role.'
                            labelKey='displayName'
                            valueKey='id'
                            options={getAdminRoles()}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            isModel={true}
                            disabled={isAdminForm && defaultSelectedRole}
                            onChange={(values: any) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].roles`, [...spiceInsightsRole, values]);
                              getSelectedAdmin(values);
                              // fetch HF list based on CHW selection
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {isSPICEReports && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.reportRoles`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label='SPICE Reports Role'
                            errorLabel='Please select at least one role.'
                            labelKey='displayName'
                            valueKey='id'
                            isShowLabel={true}
                            isSelectAll={true}
                            selectAll={false}
                            menuPlacement={'bottom'}
                            isDisabled={isProfile}
                            isClearable={false}
                            placeholder=''
                            isModel={true}
                            isMulti={true}
                            options={reportRoleOptions() || []}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(mandatoryReportRoles || []),
                                ...(disabledReportRoles.current[index] || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            mandatoryOptions={mandatoryReportRoles || []}
                            disabledOptions={disabledReportRoles.current[index] || []}
                            loading={isRolesLoading}
                            error={isError(meta) && !reportRoles?.length}
                            onChange={(values: any, { option, action }: { option: any; action: string }) => {
                              form.change(`${formName}[${index}].roles`, [...spiceRole, ...values]);
                              updateRoleOptionsAndDisableRoles(index);
                              getReportRoles(index, undefined, action === 'select-option' ? option : null);
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
                    tenantId={hfTenantId}
                    entityName={entityName}
                    clearEmail={clearEmail}
                    enableAutoPopulate={enableAutoPopulate}
                    onFindExistingUser={(user: IUser) => autoPopulateUserData(user, index)}
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
                    ref={phNumberFieldRef}
                    id={form.getState().values.users[index]?.id}
                    fieldName='phoneNumber'
                    form={form}
                    name={name}
                    formName={formName}
                    index={index}
                    isAutoPopulate={autoFetched[index]}
                  />
                </div>
                {(isSiteUser || selectedAdmins === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) && (
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
                            options={healthFacilityList}
                            loadingOptions={hfLoading}
                            error={isError(meta)}
                            isModel={true}
                            disabled={isProfile || isEdit}
                            onChange={(hf: IHealthFacility) => {
                              const formData = form.getState()?.values?.users?.[index];
                              form.change(`${formName}?.[${index}]?.supervisor`, null);
                              if (autoFetched[index] && formData?.selectedVillages?.length) {
                                form.change(`${formName}?.[${index}]?.villages`, [
                                  ...(Array.isArray(formData?.selectedVillages) ? formData.selectedVillages : [])
                                ]);
                              } else {
                                form.change(`${formName}?.[${index}]?.villages`, []);
                              }
                              fetchSupervisorList(
                                [...formData?.organizations.map((v: any) => v?.id), hf?.tenantId].filter((v: any) => v),
                                index
                              );
                              fetchVillagesList(
                                [...formData?.organizations.map((v: any) => v?.id), hf?.tenantId].filter((v: any) => v),
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
                  communityList={communityList}
                />
                <SiteUserForm
                  isAdminForm={isAdminForm}
                  index={index}
                  isEdit={isEdit}
                  name={name}
                  autoFetched={autoFetched}
                  isError={isError}
                  isCultureListLoading={isCultureListLoading}
                  cultureList={cultureList}
                  isTmezoneListLoading={isTmezoneListLoading}
                  timezoneList={timezoneList}
                  communityList={communityList}
                  countyDetails={{ list: countyList || [], loading: countyLoading }}
                  subCountyDetails={{ list: subCountyList || [], loading: subCountyLoading }}
                  siteRolesChange={siteRolesChange}
                  selectedAdmins={selectedAdmins}
                  fields={fields}
                  role={role}
                  isSiteUser={isSiteUser}
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
