import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { APP_TYPE } from '../constants/appConstants';
import { countryIdSelector, getAppTypeSelector } from '../store/user/selectors';

const commonLabels = {
  region: {
    s: 'Region',
    p: 'Regions'
  },
  healthFacility: {
    s: 'Health Facility',
    p: 'Health Facilities'
  }
};

const COMMUNITY = {
  // s for singular name
  // p for plural name
  ...commonLabels,
  isCommunity: true,
  district: {
    s: 'District',
    p: 'Districts'
  },
  chiefdom: { s: 'Chiefdom', p: 'Chiefdoms' },
  hfDetails: {
    supervisor: { s: 'Linked Peer Supervisor', p: 'Linked Peer Supervisors' }
  },
  user: {
    timezone: { available: false },
    culture: { available: false },
    redrisk: { available: false },
    designation: { available: false },
    community: { available: false },
    supervisor: {
      label: 'Select Peer Supervisor',
      error: 'select peer supervisor'
    }
  },
  userList: { filters: { available: false } },
  medication: { categories: { available: false } }
};

const NON_COMMUNITY = {
  // s for singular name
  // p for plural name
  isCommunity: false,
  ...commonLabels,
  district: {
    s: 'County',
    p: 'Counties'
  },
  chiefdom: {
    s: 'Sub County',
    p: 'Sub Counties'
  },
  hfDetails: {
    supervisor: { s: 'Linked Community Health Assistant', p: 'Linked Community Health Assistants' }
  },
  user: {
    timezone: { available: true },
    culture: { available: true },
    redrisk: { available: true },
    designation: { available: true },
    community: { available: true },
    supervisor: {
      label: 'Community Health Assistant',
      error: 'Community health assistant'
    }
  },
  userList: { filters: { available: true } },
  medication: { categories: { available: true } }
};

/**
 * Custom hook to get the label base on the appType.
 * @return {string}
 */
const useAppTypeConfigs = () => {
  const appTypesFromUser = useSelector(getAppTypeSelector);
  const userCountry = useSelector(countryIdSelector);
  const appTypes = useMemo(() => {
    // use app types from user object for super admin
    if (appTypesFromUser && appTypesFromUser.length) {
      return appTypesFromUser;
    } else if (userCountry && userCountry.appTypes && userCountry.appTypes.length) {
      // use app types from country for other admins
      return userCountry.appTypes;
    }
    return [];
  }, [appTypesFromUser, userCountry]);

  return useMemo(
    () =>
      Array.isArray(appTypes) && appTypes.length === 1 && appTypes[0] === APP_TYPE.COMMUNITY
        ? { ...COMMUNITY, appTypes }
        : { ...NON_COMMUNITY, appTypes },
    [appTypes]
  );
};
export default useAppTypeConfigs;
