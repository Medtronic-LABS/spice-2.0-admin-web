import { useMemo } from 'react';
import APPCONSTANTS, { ADMIN_BASED_ON_URL } from '../constants/appConstants';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { REGION_ADMIN, SUPER_ADMIN, SUPER_USER } from '../routes';

interface IFieldVisibility {
  showTimezone: boolean;
  showCulture: boolean;
  showRedRisk: boolean;
  showDistrict: boolean;
  showChiefdom: boolean;
  showHealthFacility: boolean;
}

interface ISideMenuProps {
  className?: string;
}
type ModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';

const useFieldVisibility = (
  isSiteUser: boolean,
  isAdminForm: boolean,
  selectedAdmins: string,
  role: string,
  formDetails: any,
  index: number,
  isHFadminSelected: boolean
): IFieldVisibility => {
  const { pathname } = useLocation();
  const { DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  const currentModule: ModuleNames = pathname.split('/')[1];
  let fetchingFor: string;
  if (role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) {
    fetchingFor = role;
  } else {
    fetchingFor = ADMIN_BASED_ON_URL[currentModule];
  }

  return useMemo(() => {
    const showTimezone = true;
    const showCulture = isSiteUser || selectedAdmins === HEALTH_FACILITY_ADMIN;
    const showRedRisk = isSiteUser && !isHFadminSelected;

    const showDistrict =
      !isSiteUser &&
      !isAdminForm &&
      [DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== DISTRICT_ADMIN &&
      role !== CHIEFDOM_ADMIN &&
      role !== HEALTH_FACILITY_ADMIN &&
      fetchingFor === SUPER_ADMIN;

    const showChiefdom =
      !isSiteUser &&
      !isAdminForm &&
      [HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== CHIEFDOM_ADMIN &&
      role !== HEALTH_FACILITY_ADMIN &&
      (fetchingFor === SUPER_ADMIN || fetchingFor === REGION_ADMIN);

    const showHealthFacility =
      !isSiteUser && !isAdminForm && selectedAdmins === HEALTH_FACILITY_ADMIN && fetchingFor !== CHIEFDOM_ADMIN;

    return {
      showTimezone,
      showCulture,
      showRedRisk,
      showDistrict,
      showChiefdom,
      showHealthFacility
    };
  }, [isSiteUser, isAdminForm, selectedAdmins, role, formDetails, index]);
};

export default useFieldVisibility;
