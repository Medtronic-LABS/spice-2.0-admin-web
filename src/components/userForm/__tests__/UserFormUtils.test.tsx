import { renderHook, act } from '@testing-library/react';
import useUserFormUtils, { getHfFilteredByRole, getRoleFlags, getSpiceRoleOptionsForHF } from '../userFormUtils';
import { IRoles } from '../../../store/user/types';
import APPCONSTANTS from '../../../constants/appConstants';
import {
  areaManagerRole,
  chcpRole,
  divisionalManagerRole,
  foRole,
  heRole,
  nurseRole,
  poRole,
  shastiyaKormiRole
} from '../../../constants/roleConstants';
import { IHealthFacility } from '../../../store/healthFacility/types';

jest.mock('../userFormMeta', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    mobileRoles: ['MobileUser', 'MobileAdmin'],
    isCHPRole: ['CHPUser', 'CHPAdmin']
  }))
}));

describe('useUserFormUtils', () => {
  const mockRoles = [{ name: 'MobileUser' }, { name: 'Admin' }, { name: 'CHPUser' }] as IRoles[];

  test('should return true if a mobile role is selected', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { isCHASelected } = result.current;
    const isSelected = isCHASelected(mockRoles);

    expect(isSelected).toBe(true);
  });

  test('should return false if no mobile role is selected', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { isCHASelected } = result.current;
    const isSelected = isCHASelected([
      {
        name: 'Admin',
        id: 0,
        appTypes: []
      }
    ]);

    expect(isSelected).toBe(false);
  });

  test('should return false if no CHP role is selected', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { isCHPCHWSelected: isCHPSelected } = result.current;
    const isSelected = isCHPSelected([
      {
        name: 'Admin',
        id: 0,
        appTypes: []
      }
    ]);

    expect(isSelected).toBe(false);
  });

  test('should return true if a valid role exists', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { isRoleExists } = result.current;
    const exists = isRoleExists(mockRoles);

    expect(exists).toBe(true);
  });

  test('should return false if no valid role exists', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { isRoleExists } = result.current;
    const exists = isRoleExists([
      {
        name: 'User',
        id: 0,
        appTypes: []
      }
    ]);

    expect(exists).toBe(false);
  });

  test('should disable site roles based on edit state', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { disableSiteRoles } = result.current;
    const isDisabledEditTrue = disableSiteRoles(0, true, [false, true]);
    const isDisabledEditFalse = disableSiteRoles(0, false, [false, true]);

    expect(isDisabledEditTrue).toBe(true);
    expect(isDisabledEditFalse).toBe(false);
  });

  test('should change site roles based on edit state and autoFetched status', () => {
    const { result } = renderHook(() => useUserFormUtils());

    const { siteRolesChange } = result.current;
    const mockInput = { onChange: jest.fn() };
    const newValue = 'NewValue';

    act(() => {
      siteRolesChange(mockInput, newValue, 0, false, [false, true]);
    });

    expect(mockInput.onChange).toHaveBeenCalledWith(newValue);

    act(() => {
      siteRolesChange(mockInput, newValue, 0, true, [false, true]);
    });

    expect(mockInput.onChange).toHaveBeenCalled();
  });
});

describe('getHfFilteredByRole', () => {
  const hfList = [
    { id: 1, name: 'Upazila HF', type: APPCONSTANTS.UPAZILA_HEALTH_COMPLEX },
    { id: 2, name: 'Community Clinic HF', type: APPCONSTANTS.COMMUNITY_CLINIC },
    { id: 3, name: 'Other HF', type: 'Community Health Centre' }
  ] as IHealthFacility[];

  it('returns only Upazila Health Complex facilities when role is Nurse', () => {
    expect(getHfFilteredByRole(nurseRole, hfList)).toEqual([hfList[0]]);
  });

  it('returns only Community Clinic facilities when role is CHCP', () => {
    expect(getHfFilteredByRole(chcpRole, hfList)).toEqual([hfList[1]]);
  });

  it('returns all facilities when role is not Nurse or CHCP', () => {
    expect(getHfFilteredByRole('HE', hfList)).toEqual(hfList);
  });

  it('returns all facilities when role is undefined', () => {
    expect(getHfFilteredByRole(undefined, hfList)).toEqual(hfList);
  });
});

describe('getSpiceRoleOptionsForHF', () => {
  const roles = [
    { id: 1, name: chcpRole, displayName: 'CHCP', groupName: 'SPICE', appTypes: [] },
    { id: 2, name: nurseRole, displayName: 'Nurse', groupName: 'SPICE', appTypes: [] }
  ] as IRoles[];

  it('excludes Nurse when isHF is true and health facility type is not Upazila Health Complex', () => {
    expect(
      getSpiceRoleOptionsForHF(roles, {
        isHF: true,
        healthFacilityType: APPCONSTANTS.COMMUNITY_CLINIC
      })
    ).toEqual([roles[0]]);
  });

  it('excludes CHCP when isHF is true and health facility type is not Community Clinic', () => {
    expect(
      getSpiceRoleOptionsForHF(roles, {
        isHF: true,
        healthFacilityType: APPCONSTANTS.UPAZILA_HEALTH_COMPLEX
      })
    ).toEqual([roles[1]]);
  });

  it('includes Nurse when isHF is true and health facility type is Upazila Health Complex', () => {
    expect(
      getSpiceRoleOptionsForHF(roles, {
        isHF: true,
        healthFacilityType: APPCONSTANTS.UPAZILA_HEALTH_COMPLEX
      })
    ).toEqual([roles[1]]);
  });

  it('includes CHCP when isHF is true and health facility type is Community Clinic', () => {
    expect(
      getSpiceRoleOptionsForHF(roles, {
        isHF: true,
        healthFacilityType: APPCONSTANTS.COMMUNITY_CLINIC
      })
    ).toEqual([roles[0]]);
  });

  it('includes Nurse and CHCP when isHF is false regardless of health facility type', () => {
    expect(
      getSpiceRoleOptionsForHF(roles, {
        isHF: false,
        healthFacilityType: 'Community Health Centre'
      })
    ).toEqual(roles);
  });

  it('excludes Nurse and CHCP when isHF is true and health facility type is undefined', () => {
    expect(getSpiceRoleOptionsForHF(roles, { isHF: true })).toEqual([]);
  });
});

describe('getRoleFlags', () => {
  test('should return all flags as false when roles are undefined', () => {
    expect(getRoleFlags()).toEqual({
      isPoSelected: false,
      isFoSelected: false,
      isAreaManagerSelected: false,
      isDivisionalManagerSelected: false,
      isShastiyaKormiSelected: false,
      isHESelected: false
    });
  });

  test('should return correct flags for a single role object', () => {
    expect(getRoleFlags({ name: poRole })).toEqual({
      isPoSelected: true,
      isFoSelected: false,
      isAreaManagerSelected: false,
      isDivisionalManagerSelected: false,
      isShastiyaKormiSelected: false,
      isHESelected: false
    });
  });

  test('should return correct flags for multiple selected roles', () => {
    expect(
      getRoleFlags([
        { name: foRole },
        { name: areaManagerRole },
        { name: shastiyaKormiRole }
      ])
    ).toEqual({
      isPoSelected: false,
      isFoSelected: true,
      isAreaManagerSelected: true,
      isDivisionalManagerSelected: false,
      isShastiyaKormiSelected: true,
      isHESelected: false
    });
  });

  test('should detect divisional manager role in an array', () => {
    expect(getRoleFlags([{ name: divisionalManagerRole }])).toEqual({
      isPoSelected: false,
      isFoSelected: false,
      isAreaManagerSelected: false,
      isDivisionalManagerSelected: true,
      isShastiyaKormiSelected: false,
      isHESelected: false
    });
  });

  test('should detect HE role in an array', () => {
    expect(getRoleFlags([{ name: heRole }])).toEqual({
      isPoSelected: false,
      isFoSelected: false,
      isAreaManagerSelected: false,
      isDivisionalManagerSelected: false,
      isShastiyaKormiSelected: false,
      isHESelected: true
    });
  });
});
