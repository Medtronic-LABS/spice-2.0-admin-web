import { useCallback } from 'react';
import { IDisabledRoles } from '../components/userForm/UserForm';
import useUserFormUtils, { filterRolesByAppTypeFn } from '../components/userForm/userFormUtils';
import APPCONSTANTS from '../constants/appConstants';
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
  disabledSPICERoles: IRoles[];
  disabledREPORTSRoles: IRoles[];
  disabledINSIGHTSRoles: IRoles[];
}

interface IRoleChangeProps {
  roles?: IRoles[];
  allRoles?: IRoles[];
  index: number;
  currentSuite?: string;
  appTypeBasedRoles: any;
}

interface IRoleChangeReturn {
  disabledRoles: any;
  onFail?: () => void;
  showSpiceHFList: boolean[];
  showReportHFList: boolean[];
  showInsightHFList: boolean[];
  showVillages: boolean[];
  isCHAStatus: boolean[];
  isCHWCHPStatus: boolean[];
}

interface IRoleHookMeta {
  disabledRoles: any;
  onRoleChange: (data: IRoleChangeReturn) => void;
  isHF: boolean;
  isHFCreate: boolean;
  isEdit: boolean | undefined;
  isSiteUser: boolean;
  formData: any[];
  isCHAStatus: boolean[];
  isCHWCHPStatus: boolean[];
  showVillagesState: boolean[];
  showSpiceHFListState: boolean[];
  showReportHFListState: boolean[];
  showInsightHFListState: boolean[];
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
  disabledRoles: propDisabledRoles,
  isHF,
  isHFCreate,
  isEdit,
  isSiteUser,
  formData,
  isCHAStatus,
  isCHWCHPStatus,
  showSpiceHFListState,
  showReportHFListState,
  showInsightHFListState,
  showVillagesState,
  onRoleChange
}: IRoleHookMeta): {
  roleChange: (data: IRoleChangeProps) => void;
} => {
  const { appTypes } = useAppTypeConfigs();
  const { separateRolesByGroupName } = useUserFormUtils();

  // specific role changes to fetch CHA CHW CHP validations and show HF list, villages list etc
  const roleSpecificChanges = useCallback(
    (roles: IRoles[], currentSuite: string) => {
      const isCHAUser = (roles || []).some((userRole: IRoles) => chaRole.includes(userRole.name));
      const isCHWCHPUser = (roles || []).some((userRole: IRoles) => villageBasedRoles.includes(userRole.name));
      let isShowVillages = false;
      let isShowSpiceHFList = false;
      let isShowReportHFList = false;
      let isShowInsightHFList = false;
      // show HF and show Villages condition
      if (roles.length && currentSuite === SPICE) {
        isShowVillages = isHFCreate ? false : isCHWCHPUser;
        roles.forEach((userRole: IRoles) => {
          if (
            [...allHFNeededRoles, 'HEALTH_FACILITY_ADMIN'].includes(userRole.name) &&
            !isHFCreate &&
            !isHF &&
            !isEdit &&
            isSiteUser
          ) {
            isShowSpiceHFList = true;
            return;
          } else {
            isShowSpiceHFList = false;
          }
        });
      } else if (currentSuite === SPICE) {
        isShowSpiceHFList = false;
        isShowVillages = false;
      }
      // show report hf list condition
      if (roles.length && currentSuite === REPORTS) {
        isShowReportHFList =
          !isHFCreate || roles.some((userRole: IRoles) => facilityReportAdminRole.includes(userRole.name));
      }
      // show insight hf list condition
      if (!!roles.length && currentSuite === INSIGHTS) {
        isShowInsightHFList = roles.some((userRole: IRoles) => insightUserRole.includes(userRole.name));
      }
      return {
        isCHAUser,
        isCHWCHPUser,
        isShowVillages,
        isShowSpiceHFList,
        isShowReportHFList,
        isShowInsightHFList
      };
    },
    [isEdit, isHF, isHFCreate, isSiteUser]
  );

  const roleChange = useCallback(
    ({ allRoles = [], roles = [], index, currentSuite = '', appTypeBasedRoles = [] as any }: IRoleChangeProps) => {
      const rolesGrouped = appTypeBasedRoles;
      const allDisabledRoles: IDisabledRoles[] = propDisabledRoles.current;
      const currentIndex = index;
      const disabledRoles = allDisabledRoles[currentIndex] || [];
      const { SPICE: spiceDRoles = [], REPORTS: reportDRoles = [], INSIGHTS: insightDRoles = [] } = disabledRoles;

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
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: chwPeerRoles }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: facilityReportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: appTypes.includes(APPCONSTANTS.appTypes.non_community) ? [hfAdminRole] : adminRoles,
          selectedSuite: SPICE,
          disabledSPICERoles: findDisabledRoles({
            suite: SPICE,
            validSpiceRoles: appTypes.includes(APPCONSTANTS.appTypes.non_community) ? [hfAdminRole] : adminRoles
          }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: facilityReportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: superAdminRoles,
          selectedSuite: SPICE,
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: facilityReportAdminRole,
          selectedSuite: REPORTS,
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: [...chwPeerRoles, ...adminRoles] }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: facilityReportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: reportAdminRole,
          selectedSuite: REPORTS,
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: insightUserRole,
          selectedSuite: INSIGHTS,
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: insightUserRole })
        },
        {
          selectedRoles: insightDeveloperRole,
          selectedSuite: INSIGHTS,
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: superAdminRoles }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: reportAdminRole }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: insightDeveloperRole })
        },
        {
          selectedRoles: CHPARoles,
          selectedSuite: SPICE,
          disabledSPICERoles: findDisabledRoles({ suite: SPICE, validSpiceRoles: CHPARoles }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validReportRoles: allReportRoles }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        },
        {
          selectedRoles: allAFSingleRoles,
          selectedSuite: SPICE,
          disabledSPICERoles: findDisabledRoles({
            suite: SPICE,
            isAfMobile: true
          }),
          disabledREPORTSRoles: findDisabledRoles({ suite: REPORTS, validSpiceRoles: allReportRoles }),
          disabledINSIGHTSRoles: findDisabledRoles({ suite: INSIGHTS, validInsightRoles: allInsightRoles })
        }
      ];
      let disabledSpiceRoles: IRoles[] = [];
      let disabledReportRoles: IRoles[] = [];
      let disabledInsightRoles: IRoles[] = [];

      interface IRoleChangesConfig {
        isCHAUser: boolean;
        isCHWCHPUser: boolean;
        isShowVillages: boolean;
        isShowSpiceHFList: boolean;
        isShowReportHFList: boolean;
        isShowInsightHFList: boolean;
      }
      let roleChangesConfig: IRoleChangesConfig = {} as IRoleChangesConfig;

      if (roles.length) {
        const { disabledSPICERoles, disabledREPORTSRoles, disabledINSIGHTSRoles } =
          rolesMeta.find((newRoles) =>
            roles.some((propRoles: IRoles) => newRoles.selectedRoles.includes(propRoles.name))
          ) || ({} as IRoleMeta);

        disabledSpiceRoles = disabledSPICERoles;
        disabledReportRoles = disabledREPORTSRoles;
        disabledInsightRoles = disabledINSIGHTSRoles;
        roleChangesConfig = roleSpecificChanges(roles, currentSuite);
      } else if (allRoles.length) {
        const seperatedRoles = separateRolesByGroupName(allRoles);

        Object.keys(seperatedRoles).forEach((suite: string) => {
          const disabledAllRoles =
            rolesMeta.find((newRoles) =>
              seperatedRoles[suite].some((propRoles: IRoles) => {
                return newRoles.selectedRoles.includes(propRoles.name);
              })
            ) || ({} as IRoleMeta);
          if (suite === SPICE) {
            disabledSpiceRoles = disabledAllRoles.disabledSPICERoles;
          }
          if (suite === REPORTS) {
            disabledReportRoles = disabledAllRoles.disabledREPORTSRoles;
          }
          if (suite === INSIGHTS) {
            disabledInsightRoles = disabledAllRoles.disabledINSIGHTSRoles;
          }

          roleChangesConfig = roleSpecificChanges(seperatedRoles[suite], suite);
        });
      }

      const newDisabledRoles = {
        SPICE: disabledSpiceRoles,
        REPORTS: disabledReportRoles,
        INSIGHTS: disabledInsightRoles
      };
      const newDRoles = [...allDisabledRoles];
      newDRoles[currentIndex] = newDisabledRoles;

      //  isCHA Status
      const newChaStatus = [...isCHAStatus];
      newChaStatus[index] = roleChangesConfig.isCHAUser;

      // isCHP Status
      const newCHWCHPStatus = [...isCHWCHPStatus];
      newCHWCHPStatus[index] = roleChangesConfig.isCHWCHPUser;

      const newShowVillage = [...showVillagesState];
      newShowVillage[index] = roleChangesConfig.isShowVillages;

      const newShowSpiceHF = [...showSpiceHFListState];
      newShowSpiceHF[index] = roleChangesConfig.isShowSpiceHFList;
      const newShowReportHF = [...showReportHFListState];
      newShowReportHF[index] = roleChangesConfig.isShowReportHFList;
      const newShowInsightHF = [...showInsightHFListState];
      newShowInsightHF[index] = roleChangesConfig.isShowInsightHFList;

      onRoleChange({
        disabledRoles: newDRoles,
        showSpiceHFList: newShowSpiceHF,
        showReportHFList: newShowReportHF,
        showInsightHFList: newShowInsightHF,
        showVillages: newShowVillage,
        isCHAStatus: newChaStatus,
        isCHWCHPStatus: newCHWCHPStatus
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isCHAStatus,
      isCHWCHPStatus,
      onRoleChange,
      propDisabledRoles,
      roleSpecificChanges,
      separateRolesByGroupName,
      showInsightHFListState,
      showReportHFListState,
      showSpiceHFListState,
      showVillagesState
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
  allRoles,
  currentModule,
  roleOptionsFn
}: IRoleOptions): {
  getRoleOptions: (index?: number) => void;
} => {
  const { isCommunity, appTypes } = useAppTypeConfigs();

  const getRoleOptions = useCallback(() => {
    const newRoles = filterRolesByAppTypeFn(allRoles, appTypes);
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
