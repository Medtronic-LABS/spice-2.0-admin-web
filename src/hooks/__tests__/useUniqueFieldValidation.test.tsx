import { renderHook, act } from '@testing-library/react';
import { useUniqueFieldValidation } from '../useUniqueFieldValidation';

jest.mock('../../utils/toastCenter', () => ({
  __esModule: true,
  default: { error: jest.fn() },
  getErrorToastArgs: jest.fn(() => ['Oops', 'Something went wrong'])
}));

const createMockForm = () => ({
  change: jest.fn()
});

const defaultOptions = {
  apiFn: jest.fn(() => Promise.resolve({ data: { unique: true } })),
  existsErrorMsg: 'This value already exists',
  notValidatedMsg: 'Field is not validated.',
  errorLabel: 'field name',
  minLength: 2,
  form: createMockForm() as any,
  formName: 'testForm',
  fieldKey: 'name',
  isEdit: false,
  toastErrorMsg: 'Failed to validate'
};

describe('useUniqueFieldValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    defaultOptions.form = createMockForm() as any;
    defaultOptions.apiFn = jest.fn(() => Promise.resolve({ data: { unique: true } }));
  });

  it('returns initial state with loading false and networkError false', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    expect(result.current.loading).toBe(false);
    expect(result.current.networkError).toBe(false);
    expect(result.current.submitEnabledStatusRef.current).toBe(true);
    expect(result.current.lastCheckedRef.current).toBe('');
  });

  it('getErrorMsg returns notValidatedMsg when networkError is true', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    act(() => {
      result.current.setNetworkError(true);
    });

    expect(result.current.getErrorMsg({ touched: true, error: '' })).toBe('Field is not validated.');
  });

  it('getErrorMsg returns meta-based error when networkError is false', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    expect(result.current.getErrorMsg({ touched: true, error: 'Required' })).toBe('Required');
    expect(result.current.getErrorMsg({ touched: false, error: 'Required' })).toBeUndefined();
  });

  it('getErrorLabel returns empty string when error matches existsErrorMsg', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    expect(result.current.getErrorLabel({ error: 'This value already exists' })).toBe('');
  });

  it('getErrorLabel returns empty string when networkError is true', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    act(() => {
      result.current.setNetworkError(true);
    });
    expect(result.current.getErrorLabel({ error: 'Other' })).toBe('');
  });

  it('getErrorLabel returns errorLabel for other errors', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    expect(result.current.getErrorLabel({ error: 'Please enter ' })).toBe('field name');
  });

  it('getErrorLabel returns empty string for blocking space error', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    expect(result.current.getErrorLabel({ error: ' ' })).toBe('');
  });

  it('validateExist returns empty string when no error and not loading', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    expect(result.current.validateExist('hello')).toBe('');
  });

  it('checkUniqueFn calls apiFn even when isEdit is true', async () => {
    const apiFn = jest.fn(() => Promise.resolve({ data: { unique: true } }));
    const options = { ...defaultOptions, apiFn, isEdit: true };
    const { result } = renderHook(() => useUniqueFieldValidation(options));

    await act(async () => {
      await result.current.checkUniqueFn('test value');
    });

    expect(apiFn).toHaveBeenCalledWith('test value');
  });

  it('checkUniqueFn does not call apiFn when value is shorter than minLength', async () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('x');
    });

    expect(defaultOptions.apiFn).not.toHaveBeenCalled();
  });

  it('checkUniqueFn does not call apiFn when value equals lastChecked (no forceRetry)', async () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('ab');
    });
    expect(defaultOptions.apiFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.checkUniqueFn('ab');
    });
    expect(defaultOptions.apiFn).toHaveBeenCalledTimes(1);
  });

  it('checkUniqueFn calls apiFn when forceRetry is true even for same value', async () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('ab');
    });
    await act(async () => {
      await result.current.checkUniqueFn('ab', true);
    });

    expect(defaultOptions.apiFn).toHaveBeenCalledTimes(2);
    expect(defaultOptions.apiFn).toHaveBeenNthCalledWith(1, 'ab');
    expect(defaultOptions.apiFn).toHaveBeenNthCalledWith(2, 'ab');
  });

  it('checkUniqueFn calls apiFn, updates refs and form when unique is true', async () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('  test value  ');
    });

    expect(defaultOptions.apiFn).toHaveBeenCalledWith('test value');
    expect(result.current.lastCheckedRef.current).toBe('test value');
    expect(defaultOptions.form.change).toHaveBeenCalledWith('testForm.name', 'test value ');
    expect(defaultOptions.form.change).toHaveBeenCalledWith('testForm.name', 'test value');
    expect(result.current.loading).toBe(false);
    expect(result.current.networkError).toBe(false);
  });

  it('checkUniqueFn sets error ref when unique is false', async () => {
    (defaultOptions.apiFn as jest.Mock).mockResolvedValue({ data: { unique: false } });
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('duplicate');
    });

    expect(result.current.lastCheckedRef.current).toBe('duplicate');
    expect(result.current.validateExist('duplicate')).toBe('This value already exists');
  });

  it('checkUniqueFn sets networkError and clears lastChecked on API error', async () => {
    const toastCenter = require('../../utils/toastCenter').default;
    (defaultOptions.apiFn as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('fail');
    });

    expect(result.current.networkError).toBe(true);
    expect(result.current.lastCheckedRef.current).toBe('');
    expect(toastCenter.error).toHaveBeenCalled();
  });

  it('checkUniqueFn trims value before calling apiFn', async () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    await act(async () => {
      await result.current.checkUniqueFn('  trimmed  ');
    });

    expect(defaultOptions.apiFn).toHaveBeenCalledWith('trimmed');
  });

  it('setNetworkError updates networkError state', () => {
    const { result } = renderHook(() => useUniqueFieldValidation(defaultOptions));

    act(() => {
      result.current.setNetworkError(true);
    });
    expect(result.current.networkError).toBe(true);

    act(() => {
      result.current.setNetworkError(false);
    });
    expect(result.current.networkError).toBe(false);
  });
});
