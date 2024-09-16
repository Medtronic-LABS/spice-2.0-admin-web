import { useMemo } from 'react';
import APPCONSTANTS from '../../constants/appConstants';

const useUserFormMeta = () => {
  const { SUPER_ADMIN, HEALTH_FACILITY_ADMIN, REGION_ADMIN, DISTRICT_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  const mobileRoles = useMemo(() => ['COMMUNITY_HEALTH_ASSISTANT'], []);
  const adminRoles = useMemo(
    () => [HEALTH_FACILITY_ADMIN, DISTRICT_ADMIN, CHIEFDOM_ADMIN, REGION_ADMIN, SUPER_ADMIN],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const isCHPRole = useMemo(() => ['COMMUNITY_HEALTH_PROMOTER'], []);
  const peerSupervisorRoles = useMemo(() => ['COMMUNITY_HEALTH_ASSISTANT', 'PEER_SUPERVISOR'], []);
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
  return { mobileRoles, isCHPRole, adminRoles, peerSupervisorRoles, superAdminRoles, hfCreateRoles, isHFAdminRole };
};

export default useUserFormMeta;
