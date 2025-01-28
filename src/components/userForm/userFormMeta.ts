import { useMemo } from 'react';
import APPCONSTANTS from '../../constants/appConstants';

/**
 * Custom hook to provide metadata for the user form.
 * @returns {Object} An object containing various metadata values.
 */
const useUserFormMeta = () => {
  const { SUPER_ADMIN, HEALTH_FACILITY_ADMIN, REGION_ADMIN, DISTRICT_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  const mobileRoles = useMemo(() => ['COMMUNITY_HEALTH_ASSISTANT'], []);
  const onlyInsightUserRole = useMemo(() => ['SPICE_INSIGHTS_USER'], []);
  const adminRoles = useMemo(
    () => [HEALTH_FACILITY_ADMIN, DISTRICT_ADMIN, CHIEFDOM_ADMIN, REGION_ADMIN, SUPER_ADMIN],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const isCHPRole = useMemo(() => ['COMMUNITY_HEALTH_PROMOTER'], []);
  const CHRoles = useMemo(
    () => [APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_ASSISTANT, APPCONSTANTS.ALL_ROLES.COMMUNITY_HEALTH_PROMOTER],
    []
  );
  const superAdminRoles = useMemo(() => ['SUPER_ADMIN'], []);
  const hfCreateRoles = useMemo(
    () => [
      'HEALTH_FACILITY_ADMIN',
      'PROVIDER',
      'MID_WIFE',
      'LAB_ASSISTANT',
      'SRN',
      'SECHN',
      'CHA',
      'MCHA',
      'PEER_SUPERVISOR'
    ],
    []
  );
  const isHFAdminRole = useMemo(() => [HEALTH_FACILITY_ADMIN], [HEALTH_FACILITY_ADMIN]);
  return {
    mobileRoles,
    isCHPRole,
    adminRoles,
    CHRoles,
    superAdminRoles,
    hfCreateRoles,
    isHFAdminRole,
    onlyInsightUserRole
  };
};

export default useUserFormMeta;
