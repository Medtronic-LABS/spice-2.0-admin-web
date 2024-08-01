import { useCallback } from 'react';
import { IRoles } from '../../store/user/types';
import UserFormMeta from './userFormMeta';

const useUserFormUtils = () => {
  const { mobileRoles, isCHPRole } = UserFormMeta();
  const isCHASelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => mobileRoles.includes(userRole.name)),
    [mobileRoles]
  );

  const isCHPSelected = useCallback(
    (roles: IRoles[]) => (roles || []).some((userRole: IRoles) => isCHPRole.includes(userRole.name)),
    [isCHPRole]
  );
  const isCountySelected = useCallback(
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
  return { isCHASelected, isCHPSelected, isRoleExists, disableSiteRoles, siteRolesChange };
};

export default useUserFormUtils;
