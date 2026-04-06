import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { countryIdSelector } from '../store/user/selectors';
import sessionStorageServices from '../global/sessionStorageServices';
import APPCONSTANTS from '../constants/appConstants';
// import { getRegionDetailSelector } from '../store/region_com/selectors';

export interface IUseCountryIdParams {
  regionId?: string;
}

/**
 * Custom hook to get the current country ID.
 * When on a region-scoped route, pass regionId from URL so API calls use that context.
 * @param params - Optional URL params: regionId, districtId, chiefdomId. When regionId is present,
 * it is used as countryId.
 * @return {number} The country ID from URL (regionId), or from Redux store or session storage
 */
const useCountryId = (params?: IUseCountryIdParams) => {
  const country = useSelector(countryIdSelector);
  const { regionId } = params || {};

  return useMemo(() => {
    if (regionId) {
      return Number(regionId);
    }
    return (
      Number(country?.id) || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID))
    );
  }, [country?.id, regionId]);
};

export default useCountryId;
