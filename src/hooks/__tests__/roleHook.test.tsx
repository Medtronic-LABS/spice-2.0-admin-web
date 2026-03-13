import { renderHook } from '@testing-library/react';
import {
  filterSPICERoles,
  useRoleMeta
} from '../roleHook';
import { IRoles } from '../../store/user/types';
import {
  SPICE,
  REPORTS,
  INSIGHTS,
  redRisk,
  hfAdminRole,
  superAdminRole,
  reportAdminRole,
  hf4ReportUser,
  peerSupervisor,
  villageBasedRoles,
  shastiyaKormiRole
} from '../../constants/roleConstants';

jest.mock('../appTypeBasedConfigs', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../components/userForm/userFormUtils', () => ({
  __esModule: true,
  default: jest.fn(),
  filterRolesByAppTypeFn: jest.fn((grouped: Record<string, IRoles[]>) => grouped)
}));

import useAppTypeConfigs from '../appTypeBasedConfigs';
import useUserFormUtils, { filterRolesByAppTypeFn } from '../../components/userForm/userFormUtils';

const mockUseAppTypeConfigs = useAppTypeConfigs as jest.Mock;
const mockUseUserFormUtils = useUserFormUtils as jest.Mock;

const createRole = (
  overrides: Partial<IRoles> & { name: string }
): IRoles => ({
  id: 1,
  name: overrides.name,
  level: 0,
  suiteAccessName: overrides.suiteAccessName ?? 'admin',
  displayName: overrides.displayName ?? 'Display',
  groupName: overrides.groupName ?? SPICE,
  appTypes: overrides.appTypes ?? ['COMMUNITY'],
  ...overrides
});

describe('roleHook', () => {
  describe('filterSPICERoles', () => {
    const baseOptions = {
      isHFCreate: false,
      isHF: false,
      isSiteUser: false
    };

    it('should exclude RED_RISK_USER role', () => {
      const roles = [
        createRole({ name: redRisk, groupName: SPICE }),
        createRole({ name: 'CHW', groupName: SPICE })
      ];
      const allRoles: IRoles[] = [];
      const result = filterSPICERoles(roles, baseOptions, allRoles);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('CHW');
    });

    it('should exclude roles with displayName null', () => {
      const roles = [
        createRole({ name: 'SOME_ROLE', displayName: null as any }),
        createRole({ name: 'CHW' })
      ];
      const result = filterSPICERoles(roles, baseOptions, []);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('CHW');
    });

    it('should exclude HF4_REPORT_USER when peer supervisor is not in allRoles', () => {
      const roles = [
        createRole({ name: hf4ReportUser, groupName: REPORTS })
      ];
      const allRoles = [createRole({ name: 'OTHER_ROLE' })];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isHF: true },
        allRoles
      );
      expect(result).toHaveLength(0);
    });

    it('should include HF4_REPORT_USER when peer supervisor is in allRoles', () => {
      const roles = [
        createRole({ name: hf4ReportUser, groupName: REPORTS })
      ];
      const allRoles = [
        createRole({ name: peerSupervisor }),
        createRole({ name: hf4ReportUser })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isHF: true },
        allRoles
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(hf4ReportUser);
    });

    it('should filter REPORTS role when isHF and isCommunity: exclude REPORT_ADMIN', () => {
      const roles = [
        createRole({ name: reportAdminRole[0], groupName: REPORTS })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isHF: true, isCommunity: true },
        []
      );
      expect(result).toHaveLength(0);
    });

    it('should filter REPORTS role when isHF and !isCommunity: include all report roles', () => {
      const roles = [
        createRole({ name: reportAdminRole[0], groupName: REPORTS }),
        createRole({ name: 'FACILITY_REPORT_ADMIN', groupName: REPORTS })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isHF: true, isCommunity: false },
        []
      );
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should apply isHFCreateCondition for SPICE when isHFCreate', () => {
      const roles = [
        createRole({ name: hfAdminRole, groupName: SPICE, suiteAccessName: 'admin' }),
        createRole({ name: villageBasedRoles[0], groupName: SPICE })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isHFCreate: true, isHF: true },
        []
      );
      expect(result.some((r) => r.name === hfAdminRole)).toBe(true);
      expect(result.some((r) => r.name === villageBasedRoles[0])).toBe(false);
    });

    it('should return site user condition when isSiteUser and !isCommunity', () => {
      const roles = [
        createRole({ name: 'CHW', groupName: SPICE, suiteAccessName: 'other' }),
        createRole({ name: hfAdminRole, groupName: SPICE, suiteAccessName: 'admin' })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isSiteUser: true, isCommunity: false },
        []
      );
      expect(result.some((r) => r.name === 'CHW')).toBe(true);
    });

    it('should return isFromAdminList when !isSiteUser and isFromAdminList', () => {
      const roles = [
        createRole({ name: 'SOME_ROLE', groupName: SPICE })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isFromAdminList: true },
        []
      );
      expect(result).toHaveLength(1);
    });

    it('should include REPORTS when !isCommunity and isReports', () => {
      const roles = [
        createRole({ name: 'REPORT_ADMIN', groupName: REPORTS })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isCommunity: false, isRegionCreate: false },
        []
      );
      expect(result).toHaveLength(1);
    });

    it('should include REPORTS when isRegionCreate and isReports', () => {
      const roles = [
        createRole({ name: 'FACILITY_REPORT_ADMIN', groupName: REPORTS })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isCommunity: true, isRegionCreate: true },
        []
      );
      expect(result).toHaveLength(1);
    });

    it('should filter by HIERARCHY_ROLES when currentModule is provided', () => {
      const roles = [
        createRole({
          name: hfAdminRole,
          groupName: SPICE,
          suiteAccessName: 'admin'
        }),
        createRole({
          name: 'UNRELATED_ROLE',
          groupName: SPICE,
          suiteAccessName: 'admin'
        })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, currentModule: 'health-facility' },
        []
      );
      expect(result.some((r) => r.name === hfAdminRole)).toBe(true);
    });

    it('should include superAdmin for isCommunityCondition when isSiteUser and isCommunity', () => {
      const roles = [
        createRole({ name: superAdminRole, groupName: SPICE, suiteAccessName: 'other' })
      ];
      const result = filterSPICERoles(
        roles,
        { ...baseOptions, isSiteUser: true, isCommunity: true },
        []
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(superAdminRole);
    });
  });

  describe('useRoleMeta', () => {
    const defaultMetaProps = {
      disabledRoles: { current: [] as any[] },
      isHF: false,
      isHFCreate: false,
      isEdit: undefined as boolean | undefined,
      isSiteUser: false,
      isFromAdminList: false,
      isRegionCreate: false,
      isCHAStatus: [false],
      isCHWCHPStatus: [false],
      showSpiceHFListState: [false],
      showReportHFListState: [false],
      showInsightHFListState: [false],
      showVillagesState: [false],
      onRoleChange: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockUseAppTypeConfigs.mockReturnValue({
        appTypes: ['COMMUNITY'],
        isCommunity: true
      });
      mockUseUserFormUtils.mockReturnValue({
        separateRolesByGroupName: jest.fn((roles: IRoles[]) =>
          roles.reduce((acc: Record<string, IRoles[]>, r) => {
            const g = r.groupName || '';
            if (!acc[g]) acc[g] = [];
            acc[g].push(r);
            return acc;
          }, {})
        )
      });
      (filterRolesByAppTypeFn as jest.Mock).mockImplementation(
        (grouped: Record<string, IRoles[]>) => grouped
      );
    });

    it('should return an object with roleChange function', () => {
      const { result } = renderHook(() => useRoleMeta(defaultMetaProps));
      expect(result.current).toHaveProperty('roleChange');
      expect(typeof result.current.roleChange).toBe('function');
    });

    it('should call onRoleChange when roleChange is invoked with allRoles and appTypeBasedRoles', () => {
      const onRoleChange = jest.fn();
      const propDisabledRoles = { current: [{}] };
      const { result } = renderHook(() =>
        useRoleMeta({
          ...defaultMetaProps,
          disabledRoles: propDisabledRoles,
          onRoleChange,
          isCHAStatus: [false],
          isCHWCHPStatus: [false],
          showVillagesState: [false],
          showSpiceHFListState: [false],
          showReportHFListState: [false],
          showInsightHFListState: [false]
        })
      );

      const allRoles: IRoles[] = [
        createRole({ name: 'CHW', groupName: SPICE })
      ];
      const appTypeBasedRoles: Record<string, IRoles[]> = {
        SPICE: [createRole({ name: 'CHW', groupName: SPICE })],
        REPORTS: [],
        INSIGHTS: []
      };

      result.current.roleChange({
        allRoles,
        index: 0,
        appTypeBasedRoles
      });

      expect(onRoleChange).toHaveBeenCalledTimes(1);
      const [callArg] = onRoleChange.mock.calls[0];
      expect(callArg).toHaveProperty('disabledRoles');
      expect(callArg).toHaveProperty('showSpiceHFList');
      expect(callArg).toHaveProperty('showReportHFList');
      expect(callArg).toHaveProperty('showInsightHFList');
      expect(callArg).toHaveProperty('showVillages');
      expect(callArg).toHaveProperty('isCHAStatus');
      expect(callArg).toHaveProperty('isCHWCHPStatus');
      expect(Array.isArray(callArg.disabledRoles)).toBe(true);
      expect(Array.isArray(callArg.showSpiceHFList)).toBe(true);
      expect(Array.isArray(callArg.showVillages)).toBe(true);
    });

    it('should update state at the given index', () => {
      const onRoleChange = jest.fn();
      const propDisabledRoles = { current: [{}, {}] };
      const { result } = renderHook(() =>
        useRoleMeta({
          ...defaultMetaProps,
          disabledRoles: propDisabledRoles,
          onRoleChange,
          isCHAStatus: [false, false],
          isCHWCHPStatus: [false, false],
          showVillagesState: [false, false],
          showSpiceHFListState: [false, false],
          showReportHFListState: [false, false],
          showInsightHFListState: [false, false]
        })
      );

      const allRoles: IRoles[] = [
        createRole({ name: 'CHW', groupName: SPICE })
      ];
      const appTypeBasedRoles: Record<string, IRoles[]> = {
        SPICE: [createRole({ name: 'CHW', groupName: SPICE })],
        REPORTS: [],
        INSIGHTS: []
      };

      result.current.roleChange({
        allRoles,
        index: 1,
        appTypeBasedRoles
      });

      const [callArg] = onRoleChange.mock.calls[0];
      expect(callArg.disabledRoles).toHaveLength(2);
      expect(callArg.showSpiceHFList).toHaveLength(2);
      expect(callArg.showVillages).toHaveLength(2);
      expect(callArg.isCHAStatus).toHaveLength(2);
      expect(callArg.isCHWCHPStatus).toHaveLength(2);
    });

    it('should use appTypes and isCommunity from useAppTypeConfigs', () => {
      mockUseAppTypeConfigs.mockReturnValue({
        appTypes: ['NON_COMMUNITY'],
        isCommunity: false
      });

      const onRoleChange = jest.fn();
      const propDisabledRoles = { current: [{}] };
      const { result } = renderHook(() =>
        useRoleMeta({
          ...defaultMetaProps,
          disabledRoles: propDisabledRoles,
          onRoleChange,
          isHF: true,
          isHFCreate: false
        })
      );

      const allRoles: IRoles[] = [
        createRole({ name: hfAdminRole, groupName: SPICE })
      ];
      const appTypeBasedRoles: Record<string, IRoles[]> = {
        SPICE: allRoles,
        REPORTS: [],
        INSIGHTS: []
      };

      result.current.roleChange({
        allRoles,
        index: 0,
        appTypeBasedRoles
      });

      expect(filterRolesByAppTypeFn).toHaveBeenCalledWith(
        appTypeBasedRoles,
        ['NON_COMMUNITY']
      );
      expect(onRoleChange).toHaveBeenCalled();
    });

    it('should set showVillages to true for Shastiya Kormi role when isHFCreate is true', () => {
      const onRoleChange = jest.fn();
      const propDisabledRoles = { current: [{}] };
      const { result } = renderHook(() =>
        useRoleMeta({
          ...defaultMetaProps,
          disabledRoles: propDisabledRoles,
          onRoleChange,
          isHFCreate: true,
          isHF: false,
          isCHAStatus: [false],
          isCHWCHPStatus: [false],
          showVillagesState: [false],
          showSpiceHFListState: [false],
          showReportHFListState: [false],
          showInsightHFListState: [false]
        })
      );

      const allRoles: IRoles[] = [
        createRole({ name: shastiyaKormiRole, groupName: SPICE })
      ];
      const appTypeBasedRoles: Record<string, IRoles[]> = {
        SPICE: [createRole({ name: shastiyaKormiRole, groupName: SPICE })],
        REPORTS: [],
        INSIGHTS: []
      };

      result.current.roleChange({
        allRoles,
        index: 0,
        appTypeBasedRoles
      });

      expect(onRoleChange).toHaveBeenCalledTimes(1);
      const [callArg] = onRoleChange.mock.calls[0];
      expect(callArg.showVillages).toEqual([true]);
    });

    it('should set showVillages to true for CHW role when isHFCreate is true', () => {
      const onRoleChange = jest.fn();
      const propDisabledRoles = { current: [{}] };
      const { result } = renderHook(() =>
        useRoleMeta({
          ...defaultMetaProps,
          disabledRoles: propDisabledRoles,
          onRoleChange,
          isHFCreate: true,
          isHF: false,
          isCHAStatus: [false],
          isCHWCHPStatus: [false],
          showVillagesState: [false],
          showSpiceHFListState: [false],
          showReportHFListState: [false],
          showInsightHFListState: [false]
        })
      );

      const appTypeBasedRoles: Record<string, IRoles[]> = {
        SPICE: [createRole({ name: 'CHW', groupName: SPICE })],
        REPORTS: [],
        INSIGHTS: []
      };

      result.current.roleChange({
        allRoles: [createRole({ name: 'CHW', groupName: SPICE })],
        index: 0,
        appTypeBasedRoles
      });

      expect(onRoleChange).toHaveBeenCalledTimes(1);
      const [callArg] = onRoleChange.mock.calls[0];
      expect(callArg.showVillages).toEqual([true]);
    });
  });
});
