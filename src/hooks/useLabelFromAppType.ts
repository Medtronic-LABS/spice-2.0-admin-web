import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { APP_TYPE } from '../constants/appConstants';
import { getAppTypeSelector } from '../store/user/selectors';

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
  hfDetails: {
    district: {
      s: 'District',
      p: 'Districts'
    },
    chiefdom: { s: 'Chiefdom', p: 'Chiefdoms' },
    supervisor: { s: 'Linked Peer Supervisor', p: 'Linked Peer Supervisors' }
  },
  user: { timezone: { available: false }, culture: { available: false } },
  userList: { filters: { available: false } }
};

const NON_COMMUNITY = {
  // s for singular name
  // p for plural name
  isCommunity: false,
  ...commonLabels,
  hfDetails: {
    district: {
      s: 'County',
      p: 'Counties'
    },
    chiefdom: {
      s: 'Sub County',
      p: 'Sub Counties'
    },
    supervisor: { s: 'Linked Community Health Assistant', p: 'Linked Community Health Assistants' }
  },
  user: { timezone: { available: true }, culture: { available: true } },
  userList: { filters: { available: true } }
};

/**
 * Custom hook to get the label base on the appType.
 * @return {string}
 */
const useLabelFromAppType = () => {
  // const country = useSelector(countryIdSelector);
  const appTypes = useSelector(getAppTypeSelector);

  return useMemo(
    () =>
      Array.isArray(appTypes) && appTypes.length === 1 && appTypes[0] === APP_TYPE.COMMUNITY
        ? COMMUNITY
        : NON_COMMUNITY,
    [appTypes]
  );
};
export default useLabelFromAppType;
