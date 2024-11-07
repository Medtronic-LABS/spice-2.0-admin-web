import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { countryIdSelector } from '../store/user/selectors';
import sessionStorageServices from '../global/sessionStorageServices';
import APPCONSTANTS from '../constants/appConstants';
// import { getRegionDetailSelector } from '../store/region_com/selectors';

/**
 * Custom hook to get the current country ID.
 * @return {number} The country ID from the Redux store or session storage
 */
const useCountryId = () => {
  const country = useSelector(countryIdSelector);
  // const appTypes = useSelector(getAppTypeSelector);
  // const communityCountryId = useSelector(getRegionDetailSelector)?.id;

  return useMemo(
    () =>
      // (Array.isArray(appTypes) && appTypes.length === 1 && appTypes[0] === APP_TYPE.COMMUNITY
      //   ? Number(communityCountryId)
      // :
      Number(country?.id) || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID)),
    [country?.id]
  );
};

export default useCountryId;
