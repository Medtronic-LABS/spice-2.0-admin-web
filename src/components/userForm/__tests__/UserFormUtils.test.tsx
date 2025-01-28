import { renderHook, act } from '@testing-library/react-hooks';
import useUserFormUtils from '../userFormUtils';
import { IRoles } from '../../../store/user/types';

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

    expect(mockInput.onChange).toBeCalled();
  });
});
