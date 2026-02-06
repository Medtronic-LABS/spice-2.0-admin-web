import { renderHook } from '@testing-library/react';
import { useSelector } from 'react-redux';
import useCountryId from '../useCountryId';
import sessionStorageServices from '../../global/sessionStorageServices';
import APPCONSTANTS from '../../constants/appConstants';

// Mock the necessary modules
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('../../global/sessionStorageServices', () => ({
  getItem: jest.fn()
}));

jest.mock('../../constants/appConstants', () => ({
  COUNTRY_ID: 'country_id'
}));

describe('useCountryId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return countryId from regionId param when provided', () => {
    (useSelector as jest.Mock).mockReturnValue({ id: '123' });
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue('456');

    const { result } = renderHook(() => useCountryId({ regionId: '789' }));

    expect(result.current).toBe(789);
  });

  it('should prefer regionId over Redux store and sessionStorage', () => {
    (useSelector as jest.Mock).mockReturnValue({ id: '123' });
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue('456');

    const { result } = renderHook(() => useCountryId({ regionId: '999' }));

    expect(result.current).toBe(999);
    expect(sessionStorageServices.getItem).not.toHaveBeenCalled();
  });

  it('should return countryId from Redux store when no regionId is passed', () => {
    (useSelector as jest.Mock).mockReturnValue({ id: '123' });

    const { result } = renderHook(() => useCountryId());

    expect(result.current).toBe(123);
    expect(sessionStorageServices.getItem).not.toHaveBeenCalled();
  });

  it('should return countryId from Redux store when params is undefined', () => {
    (useSelector as jest.Mock).mockReturnValue({ id: 42 });

    const { result } = renderHook(() => useCountryId(undefined));

    expect(result.current).toBe(42);
  });

  it('should return countryId from sessionStorage when not available in Redux store', () => {
    (useSelector as jest.Mock).mockReturnValue(undefined);
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue('456');

    const { result } = renderHook(() => useCountryId());

    expect(result.current).toBe(456);
    expect(sessionStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.COUNTRY_ID);
  });

  it('should return 0 when countryId is not available in Redux store or sessionStorage', () => {
    (useSelector as jest.Mock).mockReturnValue(undefined);
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useCountryId());

    expect(result.current).toBe(0);
    expect(sessionStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.COUNTRY_ID);
  });

  it('should return 0 when regionId is "0"', () => {
    (useSelector as jest.Mock).mockReturnValue({ id: '123' });

    const { result } = renderHook(() => useCountryId({ regionId: '0' }));

    expect(result.current).toBe(0);
  });

  it('should return NaN when regionId is non-numeric and no fallback available', () => {
    (useSelector as jest.Mock).mockReturnValue(undefined);
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useCountryId({ regionId: 'abc' }));

    expect(result.current).toBe(NaN);
  });
});
