import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { countryIdSelector } from '../store/user/selectors';
import sessionStorageServices from '../global/sessionStorageServices';
import APPCONSTANTS from '../constants/appConstants';

const useCountryId = () => {
  const country = useSelector(countryIdSelector);

  return useMemo(
    () => Number(country?.id) || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID)),
    [country]
  );
};

export default useCountryId;
