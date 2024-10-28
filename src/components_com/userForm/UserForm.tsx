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
import APPCONSTANTS from '../../constants/appConstantsCom';
import PlusIcon from '../../assets/images/plus_blue.svg';
import EmailField from '../formFields/EmailField';
import { IGroupRoles, IRoles, IUser } from '../../store/user/types';
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
  fetchInsightHFListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListFromHFRequest
} from '../../store/healthFacility_com/actions';
import {
  countryListSelector,
  countryLoadingSelector,
  healthFacilityListSelector,
  healthFacilityLoadingSelector,
  insightHFLoadingSelector,
  insightHFSelector,
  peerSupervisorListSelector,
  peerSupervisorLoadingSelector,
  villagesFromHFListSelector,
  villagesFromHFLoadingSelector
} from '../../store/healthFacility_com/selectors';
import { IHealthFacility, IPeerSupervisor, IVillages } from '../../store/healthFacility_com/types';
import PhoneNumberField from '../formFields/PhoneNumber';
import {
  FACILITY_REPORT_ADMIN,
  REPORT_ADMIN,
  SPICE_INSIGHTS_DEVELOPER,
  SPICE_INSIGHTS_USER,
  SUPER_ADMIN,
  SUPER_USER
} from '../../routes';

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
  appTypes?: string[];
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

export const filterRolesByAppTypeFn = (data: IGroupRoles, appType: string) => {
  const filteredData: { [key: string]: any[] } = {};

  // Iterate over each group in the data
  for (const group in data) {
    if (true) {
      if (data.hasOwnProperty(group)) {
        const filteredRoles = data[group].filter((role: IRoles) => (role.appTypes || []).includes(appType));
        // If there are any roles left after filtering, add them to the filteredData
        if (filteredRoles.length > 0) {
          filteredData[group] = filteredRoles;
        }
      }
    }
  }
  return filteredData;
};

// Filter roles and get appTypes without duplicates
export const roleBasedAppTypes = (newRoles: IRoles[] = []) => {
  return newRoles.reduce<string[]>((acc, roleVal) => {
    (roleVal.appTypes || []).forEach((newAppType: string) => {
      if (!acc.includes(newAppType)) {
        acc.push(newAppType);
      }
    });
    return acc;
  }, []);
};

export const formUserData = (values: any) => {
  const allSuiteAccess =
    (values?.roles || []).map((r: IRoles) => ({
      groupName: r.groupName,
      id: r.groupName
    })) || [];
  const suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()] || [];
  const spiceRoles = (values?.roles || []).filter((r: IRoles) => r.groupName === 'SPICE') || [];
  const reportRoles = (values?.roles || []).filter((r: IRoles) => r.groupName === 'REPORTS') || [];
  const insightRoles = (values?.roles || []).filter((r: IRoles) => r.groupName === 'INSIGHTS') || [];
  const isCHW = (values?.roles || []).some((userRole: IRoles) => ['CHW'].includes(userRole.name));
  return {
    suiteAccess,
    role: spiceRoles,
    reportRoles,
    selectedRoles: spiceRoles || [],
    selectedReportRoles: reportRoles,
    selectedInsightRoles: insightRoles,
    insightRoles,
    supervisor: isCHW
      ? values?.supervisor && {
          ...values.supervisor,
          name: `${values.supervisor.firstName || ''} ${values.supervisor.lastName || ''}`
        }
      : undefined,
    selectedSuiteAccess: suiteAccess,

    supersetUserOrganization: (values?.supersetUserOrganization || []).length
      ? (values?.supersetUserOrganization || []).map((hf: any) => ({
          ...hf,
          id: hf.formDataId,
          tenantId: hf.id
        }))
      : undefined
  };
};

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
  appTypes,
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
  const insightHFList = useSelector(insightHFSelector);
  const insightHFLoading = useSelector(insightHFLoadingSelector);
  const peerSupervisorList = useSelector(peerSupervisorListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const villagesList = useSelector(villagesFromHFListSelector);
  const villagesLoading = useSelector(villagesFromHFLoadingSelector);
  const role = useSelector(roleSelector);
  const countryList = useSelector(countryListSelector);
  const isCountryListLoading = useSelector(countryLoadingSelector);
  const [peerSupervisors, setPeerSupervisors] = useState([[...peerSupervisorList.list]] as IPeerSupervisor[][]);
  const [villages, setVillages] = useState([[...villagesList.list]] as IVillages[][]);
  const [newHFList, setNewHFList] = useState(healthFacilityList);

  const [autoFetchData, setAutoFetchData] = useState(autoFetchedDataState?.autoFetchData || ([] as any[]));
  const [isCHWUser, setUserAsCHW] = useState(chwState?.isCHWUser || [false]);
  const roleOptions = useRef<IRoles[][]>(roleOptionsState?.current || []);
  const disabledRoles = useRef<IRoles[][]>(disabledRolesState?.disabledRoles || ([] as IRoles[][]));
  const [autoFetched, setAutoFetched] = useState<boolean[]>(autoFetchedState?.autoFetch || ([] as boolean[]));
  const fetchedData = useRef([] as any[]);
  const [clearEmail, setClearEmail] = useState(false);
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
        country: ''
      }
    ],
    []
  );

  useEffect(() => {
    setAppTypeRoles(
      appTypes && appTypes.length === 1 ? filterRolesByAppTypeFn(rolesGrouped, appTypes[0]) : rolesGrouped
    );
  }, [appTypes, rolesGrouped]);

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
    isCHWUser,
    roleOptionsState
  ]);

  const isFormInvalid = form?.getState()?.errors?.[formName]?.length;

  const initialEditData = useMemo<Array<Partial<any>>>(() => {
    return [
      {
        ...initialEditValue,
        ...formUserData(initialEditValue),
        hfTenantIds: isEdit ? (initialEditValue?.organizations || []).map((org: any) => org.id) : []
      }
    ];
  }, [initialEditValue, isEdit]);

  const resetAdminForm = useCallback(
    (fields: any, index: number) => {
      form.mutators?.resetFields?.(`${formName}[${index}]`);
      fields.update(index, { ...initialValue[0] });
      disabledRoles.current = [];
      const newAutoFetched = [...autoFetched];
      newAutoFetched[index] = false;
      setAutoFetched(newAutoFetched);
    },
    [form.mutators, initialValue, autoFetched]
  );

  useEffect(() => {
    return () => {
      dispatch(clearSupervisorList());
      dispatch(clearVillageHFList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phNumberFieldRef = React.createRef<{ resetPhoneNumberField?: (value?: string) => void }>();

  const autoPopulateUserData = (user: any, index: number) => {
    phNumberFieldRef.current?.resetPhoneNumberField?.(user.phoneNumber);
    let userData = {
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
    const isReportAdmin = isRoleExists(userData.role, [REPORT_ADMIN]);
    const isSuperAdmin = isRoleExists(userData.role, [SUPER_ADMIN, SUPER_USER]);
    if (isSuperAdmin || isReportAdmin) {
      emailDisabledFn(APPCONSTANTS.SUPER_ADMIN_USER_EXCEPTION_HF_CREATE.replace('Super', 'Super/Report'));
    } else if (isCHWSelected(userData.role) && isHFCreate) {
      emailDisabledFn(APPCONSTANTS.CHW_USER_EXCEPTION_HF_CREATE);
    } else {
      setClearEmail(false);
      userData = { ...userData, ...formUserData(user) };
      userData.selectedVillages = [...(Array.isArray(userData.villages) ? userData.villages : [])];
      if (userData?.organizations.length === 1) {
        const { formDataId: id, name, id: tenantId } = userData.organizations[0];
        userData.healthFacility = { id, name, tenantId };
      }
      if (showHealthFacilityFn(index)) {
        const fullRoles = form.getState().values[`${formName}[${index}].roles`];
        const selectedAppTypes = roleBasedAppTypes(fullRoles);
        filterHFByAppTypes(selectedAppTypes);
      }
      form.batch(() => {
        form.change(`${formName}[${index}].id`, userData.id || '');
        form.change(`${formName}[${index}].suiteAccess`, userData.suiteAccess || null);
        form.change(`${formName}[${index}].role`, userData.role || []);
        form.change(`${formName}[${index}].roles`, userData.roles || []);
        form.change(`${formName}[${index}].reportRoles`, userData.reportRoles || []);
        form.change(`${formName}[${index}].selectedRoles`, userData.selectedRoles || []);
        form.change(`${formName}[${index}].selectedReportRoles`, userData.selectedReportRoles || []);
        form.change(`${formName}[${index}].selectedInsightRoles`, userData.selectedInsightRoles || []);
        form.change(`${formName}[${index}].insightRoles`, userData.insightRoles || []);
        form.change(`${formName}[${index}].firstName`, userData?.firstName || '');
        form.change(`${formName}[${index}].lastName`, userData.lastName || '');
        form.change(`${formName}[${index}].gender`, userData.gender || '');
        form.change(`${formName}[${index}].country`, userData.country || null);
        form.change(`${formName}[${index}].countryCode`, userData.countryCode || '');
        form.change(`${formName}[${index}].phoneNumber`, userData.phoneNumber || '');
        form.change(`${formName}[${index}].username`, userData.username || '');
        form.change(`${formName}[${index}].healthFacility`, userData.healthFacility || null);
        form.change(`${formName}[${index}].supersetUserOrganization`, userData.supersetUserOrganization || null);
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
      if (isInsightUserSelected(userData.insightRoles)) {
        getInsightHFLIst(index);
      }
      updateRoleOptionsAndDisableRoles(index, userData.roles);
      if (isCHWSelected(userData.roles)) {
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
    if (
      (!appTypeBasedRoles?.hasOwnProperty('SPICE') ||
        (appTypeBasedRoles?.hasOwnProperty('SPICE') && !appTypeBasedRoles.SPICE.length)) &&
      !isProfile
    ) {
      dispatch(
        fetchUserRolesAction({
          countryId,
          failureCb: (_) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.USER_ROLES_FETCH_ERROR)
        })
      );
    }
  }, [countryId, dispatch, isProfile, appTypeBasedRoles]);

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

  const onlyCHWRoles = useMemo(() => ['CHW'], []);
  const allInsightRoles = useMemo(() => ['SPICE_INSIGHTS_USER', 'SPICE_INSIGHTS_DEVELOPER'], []);
  const onlyInsightUserRole = useMemo(() => ['SPICE_INSIGHTS_USER'], []);
  const chwPeerRoles = useMemo(() => ['CHW', 'PEER_SUPERVISOR'], []);
  const adminRoles = useMemo(
    () => ['HEALTH_FACILITY_ADMIN', 'PROVIDER', 'MID_WIFE', 'LAB_ASSISTANT', 'SRN', 'SECHN', 'CHA', 'MCHA'],
    []
  );
  const superAdminRoles = useMemo(() => ['SUPER_ADMIN', 'SUPER_USER'], []);
  // const reportAdminRole = useMemo(() => ['REPORT_ADMIN'], []);
  const facilityReportAdminRole = useMemo(() => ['FACILITY_REPORT_ADMIN'], []);
  const nonHFCreateRoles = useMemo(() => ['SUPER_ADMIN', 'SUPER_USER', 'CHW'], []);

  const hfCreateRoles = useMemo(
    () =>
      ((Object.values(appTypeBasedRoles) || []).flat() as IRoles[])
        .filter((r: IRoles) => !nonHFCreateRoles.includes(r.name))
        .map((filteredRole) => filteredRole.name),
    [appTypeBasedRoles, nonHFCreateRoles]
  );

  const allHFNeededRoles = useMemo(
    () => [...adminRoles, ...chwPeerRoles, ...facilityReportAdminRole, ...hfCreateRoles],
    [adminRoles, chwPeerRoles, facilityReportAdminRole, hfCreateRoles]
  );

  // roles based CHW related utils
  const selectedRoles = useCallback((index: number) => form.getState().values?.users?.[index]?.roles, [form]);
  const isRoleExists = useCallback(
    (roles: IRoles[], validRoles: string[] = onlyCHWRoles) =>
      (roles || []).some((userRole: IRoles) => validRoles.includes(userRole.name)),
    [onlyCHWRoles]
  );
  const isCHWSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => onlyCHWRoles.includes(userRole.name)),
    [onlyCHWRoles]
  );
  const isInsightUserSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => onlyInsightUserRole.includes(userRole.name)),
    [onlyInsightUserRole]
  );
  const isInsightsSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => allInsightRoles.includes(userRole.name)),
    [allInsightRoles]
  );

  const updateRoleOptionsAndDisableRoles = useCallback(
    (index: number, mandatoryRoleOptions?: IRoles[]) => {
      // role options
      const newRoleOptions = [...(roleOptions.current || [])];
      if (isHFCreate && (mandatoryRoleOptions ? !isCHWSelected(mandatoryRoleOptions) : true)) {
        newRoleOptions[index] = (appTypeBasedRoles?.SPICE || [])
          .filter((r: IRoles) => hfCreateRoles.includes(r.name))
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));
      } else if (isHF) {
        newRoleOptions[index] = (appTypeBasedRoles?.SPICE || [])
          .filter((r: IRoles) => !['SUPER_ADMIN', 'SUPER_USER'].includes(r.name))
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));
      } else {
        newRoleOptions[index] = (appTypeBasedRoles?.SPICE || []).sort((a: any, b: any) =>
          a.displayName > b.displayName ? 1 : -1
        );
      }
      roleOptions.current = newRoleOptions;

      // role disable
      const newDisabledRoles = [...disabledRoles.current];
      let validRoles: string[] = [];
      // validation logic not finalized
      // const selectedAllRoles = [...(selectedRoles(index) || [])];
      // if (selectedAllRoles.some((ro: IRoles) => chwPeerRoles.includes(ro.name))) {
      //   validRoles = chwPeerRoles;
      // } else if (selectedAllRoles.some((ro: IRoles) => adminRoles.includes(ro.name))) {
      //   validRoles = adminRoles;
      // } else if (selectedAllRoles.some((ro: IRoles) => superAdminRoles.includes(ro.name))) {
      //   validRoles = superAdminRoles;
      // } else if (selectedAllRoles.some((ro: IRoles) => reportAdminRole.includes(ro.name))) {
      //   validRoles = superAdminRoles;
      // } else if (selectedAllRoles.some((ro: IRoles) => facilityReportAdminRole.includes(ro.name))) {
      //   validRoles = [...adminRoles, ...chwPeerRoles];
      // } else {
      //   validRoles = (newRoleOptions[index] || []).map((rr: IRoles) => rr.name) || [];
      // }
      validRoles = (newRoleOptions[index] || []).map((rr: IRoles) => rr.name) || [];
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
      onlyCHWRoles,
      appTypeBasedRoles,
      selectedRoles,
      superAdminRoles
    ]
  );

  const isCHWUserSelectedFn = useCallback(
    (roles: IRoles[], index: number) => {
      const newChWStatus = [...isCHWUser];
      newChWStatus[index] = isCHWSelected(roles);
      setUserAsCHW(newChWStatus);
      if (newChWStatus[index]) {
        singleHFFn();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleOptions, roleOptions.current]
  );

  // Peer Supervisor fetch
  const fetchSupervisorList = useCallback((tenantIds: number[], index: number) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Villages fetch
  const fetchVillagesList = useCallback(
    (tenantIds: number[], userId: number | string | undefined = undefined, index: number) => {
      dispatch(
        fetchVillagesListFromHFRequest({
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Common function for the supervisor and village list fetch with conditions
  const fetchListWithConditions = useCallback(
    (
      roles: IRoles[],
      tenantIds: number[] = [],
      userId: number | string | undefined = undefined,
      name: string,
      index: number
    ) => {
      if (isCHWSelected(roles) && tenantIds.length) {
        if (name === 'village') {
          return fetchVillagesList(tenantIds, userId, index);
        } else {
          return fetchSupervisorList(tenantIds, index);
        }
      }
    },
    [fetchSupervisorList, fetchVillagesList, isCHWSelected]
  );

  const isInsightHFFetched = useRef<boolean | undefined>(undefined);

  const getInsightHFLIst = useCallback((index: number) => {
    isInsightHFFetched.current = false;
    if (!insightHFList.length ? true : !isInsightHFFetched.current) {
      const allRoles = form.getState().values?.users?.[index]?.roles || [];
      if (isInsightUserSelected(allRoles)) {
        dispatch(
          fetchInsightHFListRequest({
            countryId,
            successCb: () => {
              isInsightHFFetched.current = true;
            },
            failureCb: () => {
              isInsightHFFetched.current = undefined;
            }
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEdit && (form.getState().values?.users || []).length === 1) {
      getInsightHFLIst(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getState().values?.users?.length]);

  const getHFListFn = useCallback(() => {
    dispatch(
      fetchHFListRequest({
        countryId,
        skip: 0,
        limit: null,
        userBased: !(role === SUPER_ADMIN || role === SUPER_USER)
      })
    );
  }, [countryId, dispatch, role]);

  // HF List fetch
  useEffect(() => {
    if (countryId && !isHF && !isEdit) {
      getHFListFn();
    }
  }, [
    allHFNeededRoles,
    countryId,
    dispatch,
    getHFListFn,
    healthFacilityList.length,
    isEdit,
    isHF,
    isInsightsSelected,
    isRoleExists,
    role
  ]);

  useEffect(() => {
    if (isEdit && !isProfile) {
      const tenantIds = [...initialEditData[0].hfTenantIds, hfTenantId].filter((v: number) => v);
      fetchListWithConditions(selectedRoles(0), tenantIds, initialEditData[0]?.id, 'village', 0);
      fetchListWithConditions(selectedRoles(0), tenantIds, initialEditData[0]?.id, 'supervisor', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchData]);

  const showHealthFacilityFn = (index: number) => {
    const {
      roles: allRoles,
      healthFacility,
      selectedInsightRoles: mandatoryInsightRoles,
      organizations: allOrgs = []
    } = form.getState().values?.users?.[index] || [];
    const isHFAdmin =
      !isHFCreate &&
      !isHF &&
      (!isEdit ||
        (isEdit &&
          isInsightsSelected(mandatoryInsightRoles) &&
          isRoleExists(allRoles, allHFNeededRoles) &&
          !allOrgs.length)) &&
      !(allRoles || []).some((userRole: IRoles) => [SUPER_ADMIN, SUPER_USER, REPORT_ADMIN].includes(userRole.name)) &&
      !!(
        (allRoles || []).filter(
          (formRole: IRoles) => ![SPICE_INSIGHTS_DEVELOPER, SPICE_INSIGHTS_USER].includes(formRole?.name || '')
        ) || []
      ).length;

    if (!isHFAdmin && healthFacility?.id) {
      form.change(`${formName}[${index}].healthFacility`, null);
    }
    return isHFAdmin;
  };

  const singleHFFn = useCallback(() => {
    if (!isEdit && healthFacilityList.length === 1 && showHealthFacilityFn(0)) {
      fetchVillagesList([healthFacilityList[0].tenantId], undefined, 0);
      fetchSupervisorList([healthFacilityList[0].tenantId], 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVillagesList, fetchSupervisorList, healthFacilityList, isEdit]);

  useEffect(() => {
    singleHFFn();
  }, [singleHFFn]);

  useEffect(() => {
    if (isEdit) {
      isCHWUserSelectedFn(form.getState().values.users?.[0]?.role, 0);
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

  const disabledReportRoles = useRef([] as IRoles[][]);
  const disabledInsightRoles = useRef([] as IRoles[][]);

  const reportRoleOptions = useCallback(() => {
    if (isHF) {
      return (appTypeBasedRoles.REPORTS || []).filter((v: IRoles) => v.name !== REPORT_ADMIN) || [];
    }
    return appTypeBasedRoles.REPORTS || [];
  }, [appTypeBasedRoles.REPORTS, isHF]);

  const getReportRoles = useCallback(
    (
      index: number,
      spiceRoles?: IRoles[],
      reportRole?: IRoles,
      suiteAccess?: Array<{
        groupName: any;
        id: any;
      }>,
      isSuiteRemoved = false
    ) => {
      const REPORTS = 'REPORTS';
      const {
        role: selectedSpiceRole = [],
        reportRoles = [],
        suiteAccess: formSuiteAccess = []
      } = form.getState().values?.users?.[index] || {};
      const formSpiceRoles = spiceRoles || selectedSpiceRole || [];
      const formReportRoles = spiceRoles || reportRoles || [];
      const suiteAccessSelected = suiteAccess || formSuiteAccess || [];
      const isReportSuite = suiteAccessSelected.some((v: any) => v.groupName === REPORTS);
      if (!isReportSuite) {
        return [];
      }
      const selectedReportsRole = isSuiteRemoved ? formReportRoles[0]?.name : reportRole?.name;
      const disabledRolesReports = formSpiceRoles.length
        ? (reportRoleOptions() || []).filter((r: IRoles) =>
            formSpiceRoles.some((v: IRoles) =>
              [SUPER_ADMIN, SUPER_USER].includes(v.name) ? r.name === FACILITY_REPORT_ADMIN : r.name === REPORT_ADMIN
            )
          )
        : selectedReportsRole
        ? (reportRoleOptions() || []).filter((r: IRoles) => r.name !== selectedReportsRole)
        : [];
      const newDisabledReportRoles = [...disabledReportRoles.current];
      newDisabledReportRoles[index] = disabledRolesReports;
      disabledReportRoles.current = [...newDisabledReportRoles];
      return disabledRolesReports;
    },
    [form, reportRoleOptions]
  );
  const getInsightRoles = useCallback(
    (index: number) => {
      const { insightRoles: formInsightRoles = [] } = form.getState().values?.users?.[index] || {};
      const filteredRoles = (appTypeBasedRoles.INSIGHTS || []).filter((inRole: IRoles) =>
        formInsightRoles.some((r: any) => r.name !== inRole.name)
      );
      const newDisabledInsightRoles = [...disabledInsightRoles.current];
      newDisabledInsightRoles[index] = filteredRoles;
      disabledInsightRoles.current = newDisabledInsightRoles;
      return filteredRoles;
    },
    [appTypeBasedRoles.INSIGHTS, form]
  );

  const showSupervisorVillageFn = (index: number) => {
    const { supervisor, villages: selectedVillages = [] } = form.getState().values?.users?.[index] || {};
    if (!isCHWUser[index] && (supervisor?.id || selectedVillages.length)) {
      form.change(`${formName}[${index}].supervisor`, '');
      form.change(`${formName}[${index}].villages`, []);
    }
    return isCHWUser[index];
  };

  // Function to filter health facilities by selected appTypes
  const filterHFByAppTypes = (selectedAppTypes: string[] = []) => {
    const filteredHFList = healthFacilityList.filter((hf) => {
      // Check if any clinical workflow's appTypes includes all the selectedAppTypes
      return [...(hf.clinicalWorkflows || []), ...(hf.customizedWorkflows || [])].some((workflow) => {
        return selectedAppTypes.some((type) => (workflow.appTypes || []).includes(type));
      });
    });
    setNewHFList(filteredHFList);
  };

  return (
    <FieldArray name={formName} initialValue={autoFetchData}>
      {({ fields }) =>
        fields.map((name: string, index: number) => {
          const isLastChild = (fields?.length || 0) === index + 1;
          const emailFieldRef = React.createRef<{ resetEmailField?: () => void }>();

          // SUITE options
          const suiteAccess = Object.keys(appTypeBasedRoles || {})
            .map((userRole: any) => ({ groupName: userRole, id: userRole }))
            .sort((a, b) => (a.groupName > b.groupName ? 1 : -1));
          const {
            selectedRoles: mandatoryRoles = [],
            selectedReportRoles: mandatoryReportRoles = [],
            selectedInsightRoles: mandatoryInsightRoles = [],
            suiteAccess: formSuiteAccess = [],
            selectedSuiteAccess = [],
            roles: allRoles = [],
            role: spiceRole = [],
            reportRoles = [],
            insightRoles = [],
            organizations: allOrgs = []
          } = { ...form.getState().values?.users?.[index] };
          const isSPICE = (formSuiteAccess || []).some((v: any) => v.groupName === 'SPICE');
          const isSPICEReports = (formSuiteAccess || []).some((v: any) => v.groupName === 'REPORTS');
          const isSPICEInsights = (formSuiteAccess || []).some((v: any) => v.groupName === 'INSIGHTS');
          getReportRoles(index, undefined, undefined, formSuiteAccess, true);
          getInsightRoles(index);

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
                        isClearable={false}
                        mandatoryOptions={
                          isEdit
                            ? selectedSuiteAccess
                            : fetchedData.current[index]
                            ? fetchedData.current[index]?.suiteAccess
                            : []
                        }
                        isMulti={true}
                        isModel={true}
                        required={true}
                        onChange={(values: any[]) => {
                          const selectedGroupNames = values.map((option: any) => option.groupName) || [];
                          let newAllRoles: IRoles[] = [];
                          const suiteFormName = {
                            SPICE: `${formName}[${index}].role`,
                            REPORTS: `${formName}[${index}].reportRoles`,
                            INSIGHTS: `${formName}[${index}].insightRoles`
                          };
                          Object.keys(suiteFormName).forEach((r: string) => {
                            if (selectedGroupNames.includes(r)) {
                              newAllRoles = [...newAllRoles, ...allRoles.filter((v: IRoles) => v.groupName === r)];
                            } else {
                              form.change((suiteFormName as any)[r], []);
                            }
                          });
                          form.change(`${formName}[${index}].roles`, newAllRoles);
                          isCHWUserSelectedFn(form.getState().values?.users?.[index]?.role, index);
                          updateRoleOptionsAndDisableRoles(index);
                          getReportRoles(index, undefined, undefined, values, true);
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
                            isClearable={false}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(mandatoryRoles ? mandatoryRoles : []),
                                ...(disabledRoles.current[index] || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            options={roleOptions.current?.[index] || []}
                            mandatoryOptions={mandatoryRoles ? mandatoryRoles : []}
                            disabledOptions={disabledRoles.current[index]}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            onChange={(values: any, { option }: { option: any }) => {
                              //  Store ALL ROLES on each update
                              form.change(`${formName}[${index}].roles`, [...reportRoles, ...insightRoles, ...values]);
                              const disabledRepRoles = getReportRoles(index, values);
                              // Reports Role selection
                              form.change(
                                `${formName}[${index}].reportRoles`,
                                (reportRoles || []).filter(
                                  (v: IRoles) => !disabledRepRoles.some((d: IRoles) => d.name === v.name)
                                )
                              );
                              // CHW User selection
                              isCHWUserSelectedFn(values, index);
                              updateRoleOptionsAndDisableRoles(index);
                              if (showHealthFacilityFn(index)) {
                                const fullRoles = form.getState().values[formName][index].roles;
                                const selectedAppTypes = roleBasedAppTypes(fullRoles);
                                filterHFByAppTypes(selectedAppTypes);
                              }
                              // fetch HF list based on CHW selection
                              if (!isCHWSelected(spiceRole) && isCHWSelected(values)) {
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
                              if (
                                isEdit &&
                                isInsightsSelected(mandatoryInsightRoles) &&
                                isRoleExists(values, allHFNeededRoles) &&
                                !allOrgs.length
                              ) {
                                getHFListFn();
                              }
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
                              form.change(`${formName}[${index}].roles`, [...spiceRole, ...insightRoles, ...values]);
                              updateRoleOptionsAndDisableRoles(index);
                              getReportRoles(index, undefined, action === 'select-option' ? option : null);
                              if (
                                isEdit &&
                                isInsightsSelected(mandatoryInsightRoles) &&
                                isRoleExists(values, allHFNeededRoles) &&
                                !allOrgs.length
                              ) {
                                getHFListFn();
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
                      name={`${name}.insightRoles`}
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
                            isClearable={false}
                            options={appTypeBasedRoles.INSIGHTS || []}
                            isOptionDisabled={(option: any) => {
                              const optionsToBeDisabled = [
                                ...(mandatoryInsightRoles || []),
                                ...(disabledInsightRoles.current[index] || [])
                              ];
                              return optionsToBeDisabled.length
                                ? optionsToBeDisabled.map((v: any) => v.id).includes(option.id)
                                : null;
                            }}
                            required={true}
                            mandatoryOptions={mandatoryInsightRoles || []}
                            disabledOptions={disabledInsightRoles.current[index] || []}
                            loading={isRolesLoading}
                            error={isError(meta) && !spiceRole?.length}
                            onChange={(values: any) => {
                              form.change(`${formName}[${index}].roles`, [...spiceRole, ...reportRoles, ...values]);
                              getInsightRoles(index);
                              if (isInsightUserSelected(values)) {
                                getInsightHFLIst(index);
                              }
                              input.onChange(values);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {(formSuiteAccess || []).length % 2 !== 0 && <div className='col-sm-6 col-12' />}
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
                {showHealthFacilityFn(index) && (
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
                            options={newHFList}
                            loadingOptions={hfLoading}
                            error={isError(meta)}
                            isModel={true}
                            disabled={isProfile}
                            onChange={(hf: IHealthFacility) => {
                              const formData = { ...form.getState().values?.users?.[index] };
                              form.change(`${formName}[${index}].supervisor`, null);
                              if (autoFetched[index] && formData?.selectedVillages?.length) {
                                form.change(`${formName}[${index}].villages`, [
                                  ...(Array.isArray(formData?.selectedVillages) ? formData.selectedVillages : [])
                                ]);
                              } else {
                                form.change(`${formName}[${index}].villages`, []);
                              }
                              if (isCHWSelected(formData.roles)) {
                                fetchSupervisorList(
                                  [...(formData?.organizations || []).map((v: any) => v.id), hf.tenantId].filter(
                                    (v: any) => v
                                  ),
                                  index
                                );
                                fetchVillagesList(
                                  [...(formData?.organizations || []).map((v: any) => v.id), hf.tenantId].filter(
                                    (v: any) => v
                                  ),
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
                {isSPICEInsights && isInsightUserSelected(allRoles) && (
                  <div className='col-sm-6 col-12'>
                    <Field
                      name={`${name}.supersetUserOrganization`}
                      type='text'
                      validate={required}
                      render={({ input, meta }) => {
                        return (
                          <MultiSelect
                            {...(input as any)}
                            label='Health Facility for Insights'
                            errorLabel='health facility for insights'
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
                            options={insightHFList || []}
                            loadingOptions={insightHFLoading}
                            error={isError(meta)}
                          />
                        );
                      }}
                    />
                  </div>
                )}
                {showSupervisorVillageFn(index) && (
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
