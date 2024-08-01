import { useMemo } from 'react';

const useUserFormMeta = () => {
  const mobileRoles = useMemo(() => ['COMMUNITY_HEALTH_ASSISTANT'], []);
  const adminRoles = useMemo(
    () => ['HEALTH_FACILITY_ADMIN', 'COUNTY_ADMIN', 'SUBCOUNTY_ADMIN', 'REGION_ADMIN', 'SUPER_ADMIN'],
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

  return { mobileRoles, isCHPRole, adminRoles, peerSupervisorRoles, superAdminRoles, hfCreateRoles };
};

export default useUserFormMeta;
