import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { countryIdSelector } from '../store/user/selectors';
import sessionStorageServices from '../global/sessionStorageServices';
import APPCONSTANTS from '../constants/appConstants';

/**
 * Custom hook to get the current country ID.
 * @return {number} The country ID from the Redux store or session storage
 */
const useCountryId = () => {
  const country = useSelector(countryIdSelector);

  return useMemo(
    () => Number(country?.id) || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID)),
    [country]
  );
};

export default useCountryId;
