import { useCallback } from 'react';
import { IDisabledRoles } from '../components/userForm/UserForm';
import useUserFormUtils, { filterRolesByAppTypeFn } from '../components/userForm/userFormUtils';
import {
  adminRoles,
  allMigrationAdmins,
  allAFSingleRoles,
  allHFNeededRoles,
  allHierarchyAdmins,
  allInsightRoles,
  allReportRoles,
  chaRole,
  CHPARoles,
  chwPeerRoles,
  facilityPlusHF4ReportUserRole,
  facilityReportAdminRole,
  hf4ReportUser,
  hfAdminRole,
  HIERARCHY_ROLES,
  insightDeveloperRole,
  INSIGHTS,
  insightUserRole,
  onlyCHWRoles,
  onlyHF4UserRole,
  onlyPeerSupervisor,
  peerSupervisor,
  redRisk,
  reportAdminRole,
  reportAndFacilityAdmin,
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
  validSpiceRoles?: Array<string | null>;
  validReportRoles?: Array<string | null>;
  validInsightRoles?: Array<string | null>;
  selectedAFRoles?: IRoles[];
  isAfMobile?: boolean;
}

interface IRoleMeta {
  selectedRoles: string[];
  selectedSuite: string;
  disabledSPICERoles: IFindDisabledRoles;
  disabledREPORTSRoles: IFindDisabledRoles;
  disabledINSIGHTSRoles: IFindDisabledRoles;
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
  isFromAdminList: boolean;
  isRegionCreate: boolean;
  formData: any[];
  isCHAStatus: boolean[];
  isCHWCHPStatus: boolean[];
  showVillagesState: boolean[];
  showSpiceHFListState: boolean[];
  showReportHFListState: boolean[];
  showInsightHFListState: boolean[];
}

export const filterSPICERoles = (
  roles: IRoles[],
  {
    isHFCreate,
    isHF,
    isSiteUser,
    currentModule,
    isCommunity,
    isFromAdminList,
    isRegionCreate
  }: {
    isHFCreate: boolean;
    isHF: boolean;
    isSiteUser: boolean;
    currentModule?: string;
    isCommunity?: boolean;
    isFromAdminList?: boolean;
    isRegionCreate?: boolean;
  },
  allRoles: IRoles[]
) => {
  return roles.filter((role: IRoles) => {
    const { name, displayName, suiteAccessName, groupName } = role;
    const suiteNameLower = suiteAccessName?.toLowerCase() || '';
    if (name === redRisk || displayName === null) {
      return false;
    }
    const adminFormRoles = suiteNameLower === spiceRole.spice;
    const siteUserCondition = !adminFormRoles;
    const isHFCondition = siteUserCondition || name === hfAdminRole;
    const isCommunityCondition = isHFCondition || name === superAdminRole;
    const isHFCreateCondition = isHFCondition && !villageBasedRoles.includes(name);
    const isReports = groupName === REPORTS;
    const isReportAdmin = name === reportAdminRole[0];
    const isHF4User = name === hf4ReportUser;

    const isPeerSupervisor = (allRoles || []).some((r: IRoles) => r.name === peerSupervisor);
    if (!isPeerSupervisor && isHF4User) {
      return false;
    }
    if (isHF || isHFCreate) {
      if (isReports) {
        return isCommunity ? !isReportAdmin : true;
      }
      return isHFCreate ? isHFCreateCondition : isHFCondition;
    }
    // Site user condition
    if (isSiteUser) {
      return isCommunity ? isCommunityCondition : siteUserCondition;
    }
    if (!isSiteUser && currentModule) {
      return suiteNameLower === spiceRole.spice && HIERARCHY_ROLES[urlBased[currentModule]]?.includes(name);
    }
    if (!isSiteUser && isFromAdminList) {
      return isFromAdminList;
    }
    if ((!isCommunity || isRegionCreate) && isReports) {
      return true;
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
  isFromAdminList,
  isCHAStatus,
  isCHWCHPStatus,
  showSpiceHFListState,
  showReportHFListState,
  showInsightHFListState,
  showVillagesState,
  isRegionCreate,
  onRoleChange
}: IRoleHookMeta): {
  roleChange: (data: IRoleChangeProps) => void;
} => {
  const { appTypes, isCommunity } = useAppTypeConfigs();
  const { separateRolesByGroupName } = useUserFormUtils();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showFields = {
    isShowVillages: false,
    isShowSpiceHFList: false,
    isShowReportHFList: false,
    isShowInsightHFList: false
  };

  // specific role changes to fetch CHA CHW CHP validations and show HF list, villages list etc
  const roleSpecificChanges = useCallback(
    (roles: IRoles[] = [], currentSuite: string, index: number) => {
      const isCHAUser = (roles || []).some((userRole: IRoles) => chaRole.includes(userRole.name));
      const isCHWCHPUser = (roles || []).some((userRole: IRoles) => villageBasedRoles.includes(userRole.name));
      // show HF and show Villages condition
      if (roles.length && currentSuite === SPICE) {
        if (isCHWCHPUser) {
          showFields.isShowVillages = isHFCreate ? false : isCHWCHPUser;
        }
        roles.forEach((userRole: IRoles) => {
          if (
            [...allHFNeededRoles, hfAdminRole].includes(userRole.name) &&
            !isHFCreate &&
            !isHF &&
            // !isEdit &&
            isSiteUser
          ) {
            showFields.isShowSpiceHFList = true;
            return;
          } else {
            showFields.isShowSpiceHFList = false;
          }
        });
      } else if (currentSuite === SPICE) {
        showFields.isShowSpiceHFList = false;
        showFields.isShowVillages = false;
      }
      // show report hf list condition
      if (currentSuite === REPORTS) {
        showFields.isShowReportHFList =
          !!roles.length && roles.some((userRole: IRoles) => facilityPlusHF4ReportUserRole.includes(userRole.name));
      }
      // show insight hf list condition
      if (currentSuite === INSIGHTS) {
        showFields.isShowInsightHFList =
          !!roles.length && roles.some((userRole: IRoles) => insightUserRole.includes(userRole.name));
      }
      return {
        isCHAUser,
        isCHWCHPUser,
        showFields
      };
    },
    [isHF, isHFCreate, isSiteUser, showFields]
  );

  const roleChange = useCallback(
    ({ allRoles = [], index, appTypeBasedRoles = [] as any }: IRoleChangeProps) => {
      const rolesGrouped = appTypeBasedRoles;
      const allDisabledRoles: IDisabledRoles[] = propDisabledRoles.current;

      const findDisabledRoles = ({
        suite,
        validSpiceRoles = [],
        validReportRoles = [],
        validInsightRoles = []
      }: IFindDisabledRoles) => {
        // In findDisabledRoles function:
        const selectedRoleGroup =
          filterSPICERoles(
            filterRolesByAppTypeFn(rolesGrouped, appTypes)[suite || ''] || [],
            {
              isHFCreate,
              isHF,
              isSiteUser,
              isCommunity,
              isFromAdminList,
              isRegionCreate
            },
            allRoles
          ) || [];
        const validRoles = [...new Set([...validSpiceRoles, ...validReportRoles, ...validInsightRoles])];
        return selectedRoleGroup.filter((groupedRole: IRoles) =>
          validRoles.length ? (validRoles[0] === null ? true : !validRoles.includes(groupedRole?.name)) : false
        );
      };

      /*
       * This function is used to get the valid report roles for peer supervisor & CHW selection
       */
      const getValidReportRolesForCHWPeerSelection = () => {
        // check if the report roles are present in the allRoles array
        if (allRoles.some((role) => role.groupName === REPORTS)) {
          const reportRoles = allRoles.find((role) => role.groupName === REPORTS);
          // check if the report roles have name property
          if (reportRoles?.name) {
            return [reportRoles.name];
          }
          // if the report roles are not present in the allRoles array, return the facilityPlusHF4ReportUserRole
          return facilityPlusHF4ReportUserRole;
        }
        return facilityPlusHF4ReportUserRole;
      };

      const getValidSpiceRoleForAllAFRoles = () => {
        const afSpiceRole = (allRoles || []).find((role) => role.groupName === SPICE)?.name;
        return afSpiceRole ? [afSpiceRole] : [];
      };

      const getValidSpiceRolesForFacilityReportAdminSelect = () => {
        if (isCommunity) {
          return [...chwPeerRoles, ...adminRoles];
        } else if (isFromAdminList) {
          return allHierarchyAdmins;
        } else if (!isCommunity) {
          return [...CHPARoles, ...allAFSingleRoles, hfAdminRole];
        }
        return [...CHPARoles, ...allAFSingleRoles];
      };

      const getValidSpiceRolesForReportAdminSelection = () => {
        if (isCommunity) {
          return superAdminRoles;
        } else if (isHF) {
          return [...allAFSingleRoles, ...CHPARoles, hfAdminRole];
        }
        return [...allHierarchyAdmins, ...allAFSingleRoles, ...CHPARoles];
      };
      // all roles condition
      const rolesMeta: IRoleMeta[] = [
        {
          selectedRoles: onlyCHWRoles,
          selectedSuite: SPICE,
          disabledSPICERoles: { suite: SPICE, validSpiceRoles: chwPeerRoles },
          disabledREPORTSRoles: {
            suite: REPORTS,
            validReportRoles: getValidReportRolesForCHWPeerSelection()
          },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: onlyPeerSupervisor,
          selectedSuite: SPICE,
          disabledSPICERoles: { suite: SPICE, validSpiceRoles: chwPeerRoles },
          disabledREPORTSRoles: {
            suite: REPORTS,
            validReportRoles: getValidReportRolesForCHWPeerSelection()
          },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: isCommunity ? adminRoles : isHFCreate ? [hfAdminRole] : allHierarchyAdmins,
          selectedSuite: SPICE,
          disabledSPICERoles: {
            suite: SPICE,
            validSpiceRoles: isCommunity ? adminRoles : isHFCreate ? [hfAdminRole] : allMigrationAdmins
          },
          disabledREPORTSRoles: {
            suite: REPORTS,
            validReportRoles: isCommunity ? facilityReportAdminRole : reportAndFacilityAdmin
          },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: superAdminRoles,
          selectedSuite: SPICE,
          disabledSPICERoles: { suite: SPICE, validSpiceRoles: isFromAdminList ? allMigrationAdmins : superAdminRoles },
          disabledREPORTSRoles: {
            suite: REPORTS,
            validReportRoles: isCommunity ? reportAdminRole : [null]
          },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: facilityReportAdminRole,
          selectedSuite: REPORTS,
          disabledSPICERoles: {
            suite: SPICE,
            validSpiceRoles: getValidSpiceRolesForFacilityReportAdminSelect()
          },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: facilityReportAdminRole },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: reportAdminRole,
          selectedSuite: REPORTS,
          disabledSPICERoles: {
            suite: SPICE,
            validSpiceRoles: getValidSpiceRolesForReportAdminSelection()
          },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: reportAdminRole },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: onlyHF4UserRole,
          selectedSuite: REPORTS,
          disabledSPICERoles: {
            suite: SPICE,
            validSpiceRoles: chwPeerRoles
          },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: onlyHF4UserRole },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: insightUserRole,
          selectedSuite: INSIGHTS,
          disabledSPICERoles: { suite: SPICE, validSpiceRoles: [] },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: [] },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: insightUserRole }
        },
        {
          selectedRoles: insightDeveloperRole,
          selectedSuite: INSIGHTS,
          disabledSPICERoles: { suite: SPICE, validSpiceRoles: [] },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: [] },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: insightDeveloperRole }
        },
        {
          selectedRoles: CHPARoles,
          selectedSuite: SPICE,
          disabledSPICERoles: { suite: SPICE, validSpiceRoles: CHPARoles },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: allReportRoles },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        },
        {
          selectedRoles: allAFSingleRoles,
          selectedSuite: SPICE,
          disabledSPICERoles: {
            suite: SPICE,
            isAfMobile: true,
            validSpiceRoles: getValidSpiceRoleForAllAFRoles()
          },
          disabledREPORTSRoles: { suite: REPORTS, validReportRoles: allReportRoles },
          disabledINSIGHTSRoles: { suite: INSIGHTS, validInsightRoles: allInsightRoles }
        }
      ];
      const newDisabledRoles: { [key: string]: IRoles[] } = {
        SPICE: [],
        REPORTS: [],
        INSIGHTS: []
      };

      interface IRoleChangesConfig {
        isCHAUser: boolean;
        isCHWCHPUser: boolean;
        showFields: {
          isShowVillages: boolean;
          isShowSpiceHFList: boolean;
          isShowReportHFList: boolean;
          isShowInsightHFList: boolean;
        };
      }

      let roleChangesConfig: IRoleChangesConfig = {} as IRoleChangesConfig;

      allRoles.forEach((roleValue: IRoles) => {
        const foundAllRoles =
          rolesMeta.find((newRoles) => newRoles.selectedRoles.includes(roleValue.name)) || ({} as IRoleMeta);
        const disabledAllRoles = {
          ...foundAllRoles,
          disabledSPICERoles: findDisabledRoles(foundAllRoles.disabledSPICERoles || {}),
          disabledREPORTSRoles: findDisabledRoles(foundAllRoles.disabledREPORTSRoles || {}),
          disabledINSIGHTSRoles: findDisabledRoles(foundAllRoles.disabledINSIGHTSRoles || {})
        };
        if ((disabledAllRoles.disabledSPICERoles || []).length) {
          newDisabledRoles[SPICE] = [
            ...new Set([...newDisabledRoles[SPICE], ...(disabledAllRoles.disabledSPICERoles || [])])
          ];
        }
        if ((disabledAllRoles.disabledREPORTSRoles || []).length) {
          newDisabledRoles[REPORTS] = disabledAllRoles.disabledREPORTSRoles || [];
        }
        if ((disabledAllRoles.disabledINSIGHTSRoles || []).length) {
          newDisabledRoles[INSIGHTS] = disabledAllRoles.disabledINSIGHTSRoles || [];
        }
        // to set other role specific changes like hf field, supervisor, villages, etc
        roleChangesConfig = roleSpecificChanges([roleValue], roleValue.groupName || '', index);
      });

      const newDRoles = [...allDisabledRoles];
      newDRoles[index] = newDisabledRoles;

      //  isCHA Status
      const newChaStatus = [...isCHAStatus];
      newChaStatus[index] = roleChangesConfig.isCHAUser;

      // isCHP Status
      const newCHWCHPStatus = [...isCHWCHPStatus];
      newCHWCHPStatus[index] = roleChangesConfig.isCHWCHPUser;

      const newShowVillage = [...showVillagesState];
      newShowVillage[index] = roleChangesConfig.showFields?.isShowVillages;

      const newShowSpiceHF = [...showSpiceHFListState];
      newShowSpiceHF[index] = roleChangesConfig.showFields?.isShowSpiceHFList;
      const newShowReportHF = [...showReportHFListState];
      newShowReportHF[index] = roleChangesConfig.showFields?.isShowReportHFList;
      const newShowInsightHF = [...showInsightHFListState];
      newShowInsightHF[index] = roleChangesConfig.showFields?.isShowInsightHFList;

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
