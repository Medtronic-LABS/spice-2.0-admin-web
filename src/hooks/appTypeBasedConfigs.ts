import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { APP_TYPE } from '../constants/appConstants';
import { countryIdSelector, getAppTypeSelector } from '../store/user/selectors';
import { labelNameSelector } from '../store/common/selectors';

const commonLabels = {
  region: {
    s: 'Region',
    p: 'Regions'
  },
  healthFacility: {
    s: 'Health Facility',
    p: 'Health Facilities'
  },
  district: {
    s: 'District',
    p: 'Districts'
  },
  chiefdom: { s: 'Chiefdom', p: 'Chiefdoms' }
};

const COMMUNITY = {
  isCommunity: true,
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Non-Binary', label: 'Non-Binary' }
  ],
  hfDetails: {
    supervisor: { s: 'Linked Peer Supervisor', p: 'Linked Peer Supervisors' }
  },
  user: {
    timezone: { available: false },
    culture: { available: true },
    redrisk: { available: false },
    designation: { available: false },
    community: { available: false },
    supervisor: {
      label: 'Select Peer Supervisor',
      error: 'select peer supervisor'
    }
  },
  userList: { filters: { available: true } },
  medication: { categories: { available: false } },
  filterComponent: { filterIcon: { available: true } }
};

const NON_COMMUNITY = {
  isCommunity: false,
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ],
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
  medication: { categories: { available: true } },
  filterComponent: { filterIcon: { available: false } }
};

const noAppTypes = {
  ...COMMUNITY,
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ]
};

/**
 * Custom hook to get the label base on the appType.
 * @return {string}
 */
const useAppTypeConfigs = () => {
  const appTypesFromUser = useSelector(getAppTypeSelector);
  const userCountry = useSelector(countryIdSelector);
  const nonCommunityLabelNames = useSelector(labelNameSelector);
  const labelNames =
    nonCommunityLabelNames && Object.keys(nonCommunityLabelNames).length ? nonCommunityLabelNames : commonLabels;
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
      Array.isArray(appTypes) && appTypes.includes(APP_TYPE.NON_COMMUNITY)
        ? { ...NON_COMMUNITY, appTypes, ...labelNames }
        : { ...COMMUNITY, appTypes, ...(!appTypes || !appTypes.length ? noAppTypes : {}), ...labelNames },
    [appTypes, labelNames]
  );
};
export default useAppTypeConfigs;
