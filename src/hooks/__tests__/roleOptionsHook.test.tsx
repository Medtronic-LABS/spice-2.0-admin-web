import { renderHook } from '@testing-library/react';
import { useRoleOptions } from '../roleOptionsHook';
import { IRoles } from '../../store/user/types';
import { reportAdminRole } from '../../constants/roleConstants';

jest.mock('../appTypeBasedConfigs', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../components/userForm/userFormUtils', () => ({
  __esModule: true,
  filterRolesByAppTypeFn: jest.fn((roles: Record<string, IRoles[]>) => roles)
}));

jest.mock('../roleHook', () => ({
  __esModule: true,
  filterSPICERoles: jest.fn((roles: IRoles[]) => roles)
}));

import useAppTypeConfigs from '../appTypeBasedConfigs';

const mockUseAppTypeConfigs = useAppTypeConfigs as jest.Mock;

const createRole = (name: string, displayName = name): IRoles => ({
  id: 1,
  name,
  displayName,
  level: 1,
  suiteAccessName: 'admin',
  groupName: 'REPORTS',
  appTypes: ['COMMUNITY']
});

describe('useRoleOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters report roles to report admin roles for community when module is not region', () => {
    mockUseAppTypeConfigs.mockReturnValue({
      isCommunity: true,
      appTypes: ['COMMUNITY'],
      region: { s: 'Region' }
    });

    const roleOptionsFn = jest.fn();
    const reportAdmin = createRole(reportAdminRole[0], 'Report Admin');
    const nonReportAdmin = createRole('OTHER_REPORT_ROLE', 'Other Report Role');

    const { result } = renderHook(() =>
      useRoleOptions({
        isHF: false,
        isHFCreate: false,
        isEdit: false,
        isSiteUser: false,
        allRoles: {
          SPICE: [],
          REPORTS: [nonReportAdmin, reportAdmin],
          INSIGHTS: []
        },
        currentModule: 'district',
        roleOptionsFn
      })
    );

    result.current.getRoleOptions(0, []);

    expect(roleOptionsFn).toHaveBeenCalledTimes(1);
    const [{ reportRoleOptions }] = roleOptionsFn.mock.calls[0];
    expect(reportRoleOptions).toEqual([reportAdmin]);
  });
});
