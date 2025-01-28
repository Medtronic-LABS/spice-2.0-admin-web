import { useCallback } from 'react';
import APPCONSTANTS from '../../constants/appConstants';
import { villageBasedRoles } from '../../constants/roleConstants';
import { IGroupRoles, IRoles } from '../../store/user/types';
import UserFormMeta from './userFormMeta';
import { removeRedRiskFromRoleArray } from '../../utils/commonUtils';

export const filterRolesByAppTypeFn = (fullRoles: IGroupRoles, appTypes: string[] = []) => {
  const filteredRoles: any = {};

  if (appTypes.length === 1) {
    for (const [groupName, roles] of Object.entries(fullRoles)) {
      const filteredGroup = roles.filter((role) => role.appTypes.some((type) => (appTypes || []).includes(type)));
      if (filteredGroup.length > 0) {
        filteredRoles[groupName] = filteredGroup;
      }
    }
    return filteredRoles;
  } else {
    return fullRoles;
  }
};

const useUserFormUtils = () => {
  const { mobileRoles, isHFAdminRole } = UserFormMeta();
  const isCHASelected = useCallback(
    (roles: IRoles[]) => (roles || [])?.some((userRole: IRoles) => mobileRoles.includes(userRole.name)),
    [mobileRoles]
  );

  const isCHPCHWSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => villageBasedRoles.includes(userRole.name)),
    []
  );
  const isRoleExists = useCallback(
    (roles: IRoles[], validRoles: string[] = mobileRoles) =>
      (roles || []).some((userRole: IRoles) => validRoles.includes(userRole.name)),
    [mobileRoles]
  );

  const disableSiteRoles = (index: number, isEdit: boolean | undefined, autoFetched: boolean[]) =>
    isEdit ? isEdit : autoFetched[index];

  const siteRolesChange = (input: any, v: any, index: number, isEdit: boolean | undefined, autoFetched: boolean[]) => {
    if (!isEdit || !autoFetched[index]) {
      input.onChange(v);
    }
  };

  /**
   * Generates a list of suite access options based on the provided roles grouped by user role.
   * @param {any} rolesGrouped - The roles grouped by user role
   * @returns {Array} An array of suite access options
   */
  const getSuiteAccessList = (rolesGrouped: any) =>
    Object.keys(rolesGrouped || {})
      .map((userRole: any) => ({
        groupName: userRole,
        id: userRole
      }))
      .sort((a, b) => (a.groupName > b.groupName ? 1 : -1));

  const isHFAdminSelected = useCallback(
    (roles: IRoles[]) => (roles || [])?.some((userRole: IRoles) => isHFAdminRole.includes(userRole.name)),
    [isHFAdminRole]
  );

  /**
   * get spice pre populate while open admin pages
   */
  const getSpiceGroupName = (suiteAccess: any[]) =>
    suiteAccess.find(
      (suitAccessData: { id: string; groupName: string }) =>
        suitAccessData.groupName === APPCONSTANTS.spiceRoleGrouped.spice
    );

  const formUserData = (values: any) => {
    const rolesWithoutRedRisk = removeRedRiskFromRoleArray(values?.roles || []);
    const allSuiteAccess =
      rolesWithoutRedRisk.map((r: IRoles) => ({
        groupName: r.groupName,
        id: r.groupName
      })) || [];
    const suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()] || [];
    const spiceRoles = (values?.roles || []).filter((r: IRoles) => r.groupName === 'SPICE') || [];
    const reportRoles = (values?.roles || []).filter((r: IRoles) => r.groupName === 'REPORTS') || [];
    const insightRoles = (values?.roles || []).filter((r: IRoles) => r.groupName === 'INSIGHTS') || [];
    const isCHWCHP = (values?.roles || []).some((userRole: IRoles) => villageBasedRoles.includes(userRole.name));
    return {
      suiteAccess,
      role: spiceRoles,
      reportRoles,
      insightRoles,
      selectedRoles: spiceRoles || [],
      selectedReportRoles: reportRoles,
      selectedInsightRoles: insightRoles,
      supervisor: isCHWCHP
        ? values?.supervisor && {
            ...values.supervisor,
            name: `${values.supervisor.firstName || ''} ${values.supervisor.lastName || ''}`
          }
        : undefined,
      mandatorySuiteAccess: suiteAccess,

      reportUserOrganization: (values?.reportUserOrganization || []).length
        ? (values?.reportUserOrganization || []).map((hf: any) => ({
            ...hf,
            id: hf.formDataId,
            tenantId: hf.id
          }))
        : undefined,
      insightUserOrganization: (values?.insightUserOrganization || []).length
        ? (values?.insightUserOrganization || []).map((hf: any) => ({
            ...hf,
            id: hf.formDataId,
            tenantId: hf.id
          }))
        : undefined
    };
  };

  // Filter roles and get appTypes without duplicates
  const roleBasedAppTypes = (newRoles: IRoles[] = []) => {
    return newRoles.reduce<string[]>((acc, roleVal) => {
      (roleVal.appTypes || []).forEach((newAppType: string) => {
        if (!acc.includes(newAppType)) {
          acc.push(newAppType);
        }
      });
      return acc;
    }, []);
  };
  const separateRolesByGroupName = (roles: IRoles[]): Record<string, IRoles[]> => {
    return roles.reduce((result, role) => {
      if (!result[role.groupName || '']) {
        result[role.groupName || ''] = [];
      }
      result[role.groupName || ''].push(role);
      return result;
    }, {} as Record<string, IRoles[]>);
  };

  return {
    isCHASelected,
    isCHPCHWSelected,
    isRoleExists,
    disableSiteRoles,
    siteRolesChange,
    getSuiteAccessList,
    isHFAdminSelected,
    getSpiceGroupName,
    formUserData,
    roleBasedAppTypes,
    separateRolesByGroupName
  };
};

export default useUserFormUtils;
