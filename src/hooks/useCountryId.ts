import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { countryIdSelector } from '../store/user/selectors';
import sessionStorageServices from '../global/sessionStorageServices';
import APPCONSTANTS from '../constants/appConstants';

const useCountryId = () => {
  const countryId = useSelector(countryIdSelector);

  return useMemo(
    () => Number(countryId?.id) || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID)),
    [countryId]
  );
};

export default useCountryId;
