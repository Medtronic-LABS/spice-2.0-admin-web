import { useCallback } from 'react';
import { IRoles } from '../../store/user/types';
import UserFormMeta from './userFormMeta';
import APPCONSTANTS from '../../constants/appConstants';

const useUserFormUtils = () => {
  const { mobileRoles, isCHPRole, isHFAdminRole } = UserFormMeta();
  const isCHASelected = useCallback(
    (roles: IRoles[]) => (roles || [])?.some((userRole: IRoles) => mobileRoles.includes(userRole.name)),
    [mobileRoles]
  );

  const isCHPSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => isCHPRole.includes(userRole.name)),
    [isCHPRole]
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

  const getSuiteAccessList = (rolesGrouped: any) =>
    Object.keys(rolesGrouped || {})
      .map((userRole: any) => ({
        groupName: userRole,
        id: userRole,
        isFixed: APPCONSTANTS.spiceRole.spiceInsights !== userRole
      }))
      .sort((a, b) => (a.groupName > b.groupName ? 1 : -1));

  const isHFAdminSelected = useCallback(
    (roles: IRoles[]) => (roles || [])?.some((userRole: IRoles) => isHFAdminRole.includes(userRole.name)),
    [isHFAdminRole]
  );
  return {
    isCHASelected,
    isCHPSelected,
    isRoleExists,
    disableSiteRoles,
    siteRolesChange,
    getSuiteAccessList,
    isHFAdminSelected
  };
};

export default useUserFormUtils;
