import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { APP_TYPE } from '../constants/appConstants';
import { countryIdSelector, getAppTypeSelector } from '../store/user/selectors';
import { labelNameSelector } from '../store/common/selectors';

// Common labels shared across app types
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
    s: 'County',
    p: 'Counties'
  },
  chiefdom: { s: 'Sub County', p: 'Sub Counties' }
};

// Community-specific label overrides
const communityLabelOverrides = {
  ...commonLabels,
  district: {
    s: 'District',
    p: 'Districts'
  },
  chiefdom: { s: 'Chiefdom', p: 'Chiefdoms' }
};

// Configuration for COMMUNITY app type
const COMMUNITY = {
  isCommunity: true,
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Non-Binary', label: 'Non-Binary' }
  ],
  hfDetails: {
    map: { available: true },
    language: { disabled: false },
    linkedVillages: { required: true },
    city: { isCityVillage: true, isRequired: true }
  },
  hfCreate: {
    user: { optional: { available: true } }
  },

  user: {
    timezone: { available: false },
    culture: { available: true, disabled: false },
    redrisk: { available: false },
    designation: { available: false },
    dhisId: { available: true },
    community: { available: false }
  },
  userList: {
    filters: { available: true },
    activeToogle: { available: true },
    passwordPreference: { available: true }
  },
  medication: { categories: { available: true, isMandatory: false }, groups: { available: true } },
  filterComponent: { filterIcon: { available: true } },
  village: { s: 'Village', p: 'Villages' }
};

// Configuration for NON_COMMUNITY app type
const NON_COMMUNITY = {
  isCommunity: false,
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ],
  hfDetails: {
    map: { available: false },
    language: { disabled: false },
    linkedVillages: { required: false },
    city: { isCityVillage: false, isRequired: false }
  },
  hfCreate: {
    user: { optional: { available: false } }
  },
  user: {
    timezone: { available: true },
    culture: { available: true, disabled: false },
    redrisk: { available: true },
    designation: { available: true },
    dhisId: { available: false },
    community: { available: true }
  },
  userList: {
    filters: { available: true },
    activeToogle: { available: false },
    passwordPreference: { available: false }
  },
  medication: { categories: { available: true, isMandatory: true }, groups: { available: true } },
  filterComponent: { filterIcon: { available: true } },
  village: { s: 'Village', p: 'Villages' }
};

// Fallback configuration when no app types are defined
const noAppTypes = {
  ...COMMUNITY,
  GENDER_OPTIONS: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ]
};

/**
 * Custom hook to get the application configuration based on the current app type.
 * Returns different configurations for COMMUNITY vs NON_COMMUNITY app types.
 * @return {Object} Configuration object with app type specific settings
 */
const useAppTypeConfigs = () => {
  const appTypesFromUser = useSelector(getAppTypeSelector);
  const userCountry = useSelector(countryIdSelector);
  const labelNamesFromStore = useSelector(labelNameSelector);

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

  return useMemo(() => {
    const hasDisplayValues =
      labelNamesFromStore && Object.keys(labelNamesFromStore).length > 0;
    // When both community and non-community exist, prefer non-community
    const preferNonCommunity =
      Array.isArray(appTypes) && appTypes.includes(APP_TYPE.NON_COMMUNITY);
    // When displayValues present use them; when absent use app-type defaults (prefer non-community when both)
    const resolvedLabelNames = hasDisplayValues
      ? labelNamesFromStore
      : preferNonCommunity
        ? commonLabels
        : communityLabelOverrides;

    const baseConfig = preferNonCommunity ? NON_COMMUNITY : COMMUNITY;
    const noAppTypesOverrides =
      !appTypes || !appTypes.length ? noAppTypes : {};

    return {
      ...baseConfig,
      ...noAppTypesOverrides,
      appTypes,
      ...resolvedLabelNames
    };
  }, [appTypes, labelNamesFromStore]);
};
export default useAppTypeConfigs;
