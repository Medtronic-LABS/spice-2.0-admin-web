import { renderHook } from '@testing-library/react-hooks/dom';
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

  it('should return countryId from Redux store if available', () => {
    (useSelector as jest.Mock).mockReturnValue({ id: '123' });

    const { result } = renderHook(() => useCountryId());

    expect(result.current).toBe(123);
    expect(sessionStorageServices.getItem).not.toHaveBeenCalled();
  });

  it('should return countryId from sessionStorage if not available in Redux store', () => {
    (useSelector as jest.Mock).mockReturnValue(undefined);
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue('456');

    const { result } = renderHook(() => useCountryId());

    expect(result.current).toBe(456);
    expect(sessionStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.COUNTRY_ID);
  });

  it('should return 0 if countryId is not available in both Redux store and sessionStorage', () => {
    (useSelector as jest.Mock).mockReturnValue(undefined);
    (sessionStorageServices.getItem as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useCountryId());

    expect(result.current).toBe(0);
    expect(sessionStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.COUNTRY_ID);
  });
});
