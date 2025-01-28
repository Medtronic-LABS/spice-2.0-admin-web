import { useCallback } from 'react';
import { IRoles } from '../store/user/types';
import useAppTypeConfigs from './appTypeBasedConfigs';
import { filterRolesByAppTypeFn } from '../components/userForm/userFormUtils';
import { filterSPICERoles } from './roleHook';
import { hf4ReportUser, peerSupervisor, reportAdminRole } from '../constants/roleConstants';

interface IRoleOptions {
  isHF: boolean;
  isHFCreate: boolean;
  isEdit: boolean | undefined;
  isAdminForm?: boolean;
  isSiteUser: boolean;
  appTypes?: string[];
  allRoles: { [key: string]: IRoles[] };
  currentModule: string;
  roleOptionsFn: (data: {
    spiceRoleOptions: IRoles[];
    reportRoleOptions: IRoles[];
    insightRoleOptions: IRoles[];
    onFail?: () => void;
  }) => void;
}

export const useRoleOptions = ({
  isHF,
  isHFCreate,
  isSiteUser,
  allRoles,
  currentModule,
  roleOptionsFn
}: IRoleOptions): {
  getRoleOptions: (index?: number, selectedRoles?: IRoles[]) => void;
} => {
  const {
    isCommunity,
    appTypes,
    region: { s: regionSname }
  } = useAppTypeConfigs();

  const getRoleOptions = useCallback(
    (index: any | undefined, selectedRoles: IRoles[] | undefined) => {
      const newRoles = filterRolesByAppTypeFn(allRoles, appTypes);
      // returns the SPICE roles based on the conditions
      const SPICERoles = filterSPICERoles(
        newRoles.SPICE || [],
        {
          isHFCreate,
          isHF,
          isSiteUser,
          currentModule,
          isCommunity
        },
        Object.values(newRoles)
      ).sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));

      // returns the REPORTS roles based on the conditions
      const reportRoleOptions =
        (newRoles.REPORTS || [])
          .filter((role: IRoles) => {
            // HF4User should be visible only when Peer Supervisor is selected
            const isPeerSupervisor = (selectedRoles || []).some((newRole: IRoles) => newRole.name === peerSupervisor);
            if (isPeerSupervisor && role.name === hf4ReportUser) {
              return true;
            } else if (role.name === hf4ReportUser) {
              return false;
            }

            if (isCommunity && currentModule !== regionSname.toLowerCase()) {
              return !reportAdminRole.includes(role.name);
            }
            return true;
          })
          .sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1)) || [];
      // returns the INSIGHTS roles based on the conditions
      const insightRoleOptions =
        (newRoles.INSIGHTS || []).sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1)) || [];
      roleOptionsFn({ spiceRoleOptions: SPICERoles, reportRoleOptions, insightRoleOptions });
    },
    [allRoles, appTypes, currentModule, isCommunity, isHF, isHFCreate, isSiteUser, regionSname, roleOptionsFn]
  );

  return {
    getRoleOptions
  };
};
