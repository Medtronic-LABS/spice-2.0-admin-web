import { useCallback, useRef } from 'react';
import { IDisabledRoles } from '../components/userForm/UserForm';
import {
  adminRoles,
  allAFSingleRoles,
  allHFNeededRoles,
  allInsightRoles,
  allReportRoles,
  chaRole,
  CHPARoles,
  chwPeerRoles,
  facilityReportAdminRole,
  hfAdminRole,
  HIERARCHY_ROLES,
  insightDeveloperRole,
  INSIGHTS,
  insightUserRole,
  redRisk,
  reportAdminRole,
  REPORTS,
  SPICE,
  spiceRole,
  superAdminRole,
  superAdminRoles,
  urlBased,
  villageBasedRoles
} from '../constants/roleConstants';
import { IRoles } from '../store/user/types';
import useAppTypeConfigs from './appTypeBasedConfigs';
import { filterRolesByAppTypeFn } from '../components/userForm/userFormUtils';
import APPCONSTANTS from '../constants/appConstants';

interface IFindDisabledRoles {
  suite: string;
  validSpiceRoles?: string[];
  validReportRoles?: string[];
  validInsightRoles?: string[];
  selectedAFRoles?: IRoles[];
  isAfMobile?: boolean;
}

interface IRoleMeta {
  selectedRoles: string[];
  selectedSuite: string;
  disabledSpiceRoles: IRoles[];
  disabledReportRoles: IRoles[];
  disabledInsightRoles: IRoles[];
}

interface IRoleChangeProps {
  roles: IRoles[];
  index: number;
  currentSuite: string;
}

interface IRoleChangeReturn {
  disabledRoles: any;
  onFail?: () => void;
  showSpiceHFList: boolean;
  showReportHFList: boolean;
  showInsightHFList: boolean;
  showVillages: boolean;
  isCHAStatus: boolean[];
  isCHWCHPStatus: boolean[];
}

interface IRoleHookMeta {
  appTypeBasedRoles: any;
  disabledRoles: any;
  onRoleChange: (data: IRoleChangeReturn) => void;
  isHF: boolean;
  isHFCreate: boolean;
  isEdit: boolean | undefined;
  isSiteUser: boolean;
  formData: any[];
  isCHAStatus: boolean[];
  isCHWCHPStatus: boolean[];
}

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

const filterSPICERoles = (
  roles: IRoles[],
  {
    isHFCreate,
    isHF,
    isSiteUser,
    currentModule,
    isCommunity
  }: {
    isHFCreate: boolean;
    isHF: boolean;
    isSiteUser: boolean;
    currentModule?: string;
    isCommunity?: boolean;
  }
) => {
  return roles.filter((role: IRoles) => {
    const { name, displayName, suiteAccessName } = role;
    const suiteNameLower = suiteAccessName?.toLowerCase() || '';
    if (name === redRisk || displayName === null) {
      return false;
    }
    const adminFormRoles = suiteNameLower === spiceRole.spice;
    const siteUserCondition = !adminFormRoles;
    const isHFCondition = siteUserCondition || name === hfAdminRole;
    const isCommunityCondition = isHFCondition || name === superAdminRole;
    const isHFCreateCondition = isHFCondition && !villageBasedRoles.includes(name);

    if (isHFCreate) {
      return isHFCreateCondition;
    }
    if (isHF) {
      return isHFCondition;
    }
    // Site user condition
    if (isSiteUser) {
      return isCommunity ? isCommunityCondition : siteUserCondition;
    }
    if (!isSiteUser && currentModule) {
      return suiteNameLower === spiceRole.spice && HIERARCHY_ROLES[urlBased[currentModule]]?.includes(name);
    }
    return adminFormRoles;
  });
};

/**
 * A hook for roles Meta
 */
export const useRoleMeta = ({
  appTypeBasedRoles,
  disabledRoles: propDisabledRoles,
  isHF,
  isHFCreate,
  isEdit,
  isSiteUser,
  formData,
  isCHAStatus,
  isCHWCHPStatus,
  onRoleChange
}: IRoleHookMeta): {
  roleChange: (data: IRoleChangeProps) => void;
} => {
  const showSpiceHFList = useRef(false);
  const showReportHFList = useRef(false);
  const showInsightHFList = useRef(false);
  const showVillages = useRef(false);
  const { appTypes } = useAppTypeConfigs();

  const roleChange = useCallback(
    ({ roles = [], index, currentSuite }: IRoleChangeProps) => {
      const rolesGrouped = appTypeBasedRoles;
      const allDisabledRoles: IDisabledRoles[] = propDisabledRoles.current;
      const currentIndex = index;
      const disabledRoles = allDisabledRoles[currentIndex] || [];
      const { SPICE: spiceDRoles = [], REPORTS: reportDRoles = [], INSIGHTS: insightDRoles = [] } = disabledRoles;

      const isCHAUser = (roles || []).some((userRole: IRoles) => chaRole.includes(userRole.name));
      const isCHWCHPUser = (roles || []).some((userRole: IRoles) => villageBasedRoles.includes(userRole.name));
      // show HF and show Villages condition
      if (roles.length && currentSuite === SPICE) {
        showVillages.current = isHFCreate ? false : isCHWCHPUser;
        roles.forEach((userRole: IRoles) => {
          if (
            [...allHFNeededRoles, 'HEALTH_FACILITY_ADMIN'].includes(userRole.name) &&
            !isHFCreate &&
            !isHF &&
            !isEdit &&
            isSiteUser
          ) {
            showSpiceHFList.current = true;
            return;
          } else {
            showSpiceHFList.current = false;
          }
        });
      } else if (currentSuite === SPICE) {
        showSpiceHFList.current = false;
        showVillages.current = false;
      }
      // show report hf list condition
      if (roles.length && currentSuite === REPORTS) {
        showReportHFList.current =
          !isHFCreate || roles.some((userRole: IRoles) => facilityReportAdminRole.includes(userRole.name));
      }
      // show insight hf list condition
      if (!!roles.length && currentSuite === INSIGHTS) {
        showInsightHFList.current = roles.some((userRole: IRoles) => insightUserRole.includes(userRole.name));
      }

      const findDisabledRoles = ({
        suite,
        validSpiceRoles,
        validReportRoles,
        validInsightRoles,
        isAfMobile = false
      }: IFindDisabledRoles) => {
        // In findDisabledRoles function:
        const SPICERoles = filterSPICERoles(rolesGrouped[suite || ''] || [], {
          isHFCreate,
          isHF,
          isSiteUser
        });

        const selectedRoleGroup = SPICERoles || [];
        if (suite === 'SPICE') {
          return spiceDRoles.length
            ? spiceDRoles
            : selectedRoleGroup.filter(
                (groupedRole: IRoles) =>
                  !(isAfMobile ? [roles[0]?.name] : validSpiceRoles || []).includes(groupedRole?.name)
              );
        } else if (suite === 'REPORTS') {
          return reportDRoles.length
            ? reportDRoles
            : selectedRoleGroup.filter((groupedRole: IRoles) => !(validReportRoles || []).includes(groupedRole.name));
        } else if (suite === 'INSIGHTS') {
          return insightDRoles.length
            ? insightDRoles
            : selectedRoleGroup.filter((groupedRole: IRoles) => !(validInsightRoles || []).includes(groupedRole.name));
        } else {
          return [];
        }
      };

      // all roles condition
      const rolesMeta: IRoleMeta[] = [
        {
          selectedRoles: chwPeerRoles,
          selectedSuite: SPICE,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: chwPeerRoles }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: facilityReportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: appTypes.includes(APPCONSTANTS.appTypes.non_community) ? [hfAdminRole] : adminRoles,
          selectedSuite: SPICE,
          disabledSpiceRoles: findDisabledRoles({
            suite: SPICE,
            validSpiceRoles: appTypes.includes(APPCONSTANTS.appTypes.non_community) ? [hfAdminRole] : adminRoles
          }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: facilityReportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: superAdminRoles,
          selectedSuite: SPICE,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: facilityReportAdminRole,
          selectedSuite: REPORTS,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: [...chwPeerRoles, ...adminRoles] }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: facilityReportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: reportAdminRole,
          selectedSuite: REPORTS,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: insightUserRole,
          selectedSuite: INSIGHTS,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: insightUserRole })
        },
        {
          selectedRoles: insightDeveloperRole,
          selectedSuite: INSIGHTS,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: insightDeveloperRole })
        },
        {
          selectedRoles: CHPARoles,
          selectedSuite: SPICE,
          disabledSpiceRoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: CHPARoles }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: allReportRoles }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: allAFSingleRoles,
          selectedSuite: SPICE,
          disabledSpiceRoles: findDisabledRoles({
            suite: SPICE,
            isAfMobile: true
          }),
          disabledReportRoles: findDisabledRoles({ suite: REPORTS, validSpiceRoles: allReportRoles }),
          disabledInsightRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        }
      ];

      const { disabledSpiceRoles, disabledReportRoles, disabledInsightRoles } =
        rolesMeta.find((newRoles) =>
          roles.some((propRoles: IRoles) => newRoles.selectedRoles.includes(propRoles.name))
        ) || ({} as IRoleMeta);

      const newDisabledRoles = {
        SPICE: disabledSpiceRoles,
        REPORTS: disabledReportRoles,
        INSIGHTS: disabledInsightRoles
      };
      const newDRoles = [...allDisabledRoles];
      newDRoles[currentIndex] = newDisabledRoles;

      //  isCHA Status
      const newChaStatus = [...isCHAStatus];
      newChaStatus[index] = isCHAUser;

      // isCHP Status
      const newCHWCHPStatus = [...isCHWCHPStatus];
      newCHWCHPStatus[index] = isCHWCHPUser;

      onRoleChange({
        disabledRoles: newDRoles,
        showSpiceHFList: showSpiceHFList.current,
        showReportHFList: showReportHFList.current,
        showInsightHFList: showInsightHFList.current,
        showVillages: showVillages.current,
        isCHAStatus: newChaStatus,
        isCHWCHPStatus: newCHWCHPStatus
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      appTypeBasedRoles,
      isCHAStatus,
      isCHWCHPStatus,
      isEdit,
      isHF,
      isHFCreate,
      isSiteUser,
      onRoleChange,
      propDisabledRoles
    ]
  );
  return {
    roleChange
  };
};

export const useRoleOptions = ({
  isHF,
  isHFCreate,
  isEdit,
  isSiteUser,
  appTypes,
  allRoles,
  currentModule,
  roleOptionsFn
}: IRoleOptions): {
  getRoleOptions: (index?: number) => void;
} => {
  const { isCommunity } = useAppTypeConfigs();

  const getRoleOptions = useCallback(() => {
    const newRoles = appTypes && appTypes.length === 1 ? filterRolesByAppTypeFn(allRoles, appTypes[0]) : allRoles;
    // returns the SPICE roles based on the conditions
    const SPICERoles = filterSPICERoles(newRoles.SPICE || [], {
      isHFCreate,
      isHF,
      isSiteUser,
      currentModule,
      isCommunity
    }).sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1));

    // returns the REPORTS roles based on the consitions
    const reportRoleOptions =
      (newRoles.REPORTS || []).sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1)) || [];

    // returns the INSIGHTS roles based on the consitions
    const insightRoleOptions =
      (newRoles.INSIGHTS || []).sort((a: any, b: any) => (a.displayName > b.displayName ? 1 : -1)) || [];

    roleOptionsFn({ spiceRoleOptions: SPICERoles, reportRoleOptions, insightRoleOptions });
  }, [allRoles, appTypes, currentModule, isCommunity, isHF, isHFCreate, isSiteUser, roleOptionsFn]);

  return {
    getRoleOptions
  };
};
