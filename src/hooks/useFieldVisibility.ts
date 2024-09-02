import { useMemo } from 'react';
import APPCONSTANTS from '../constants/appConstants';

interface IFieldVisibility {
  showTimezone: boolean;
  showCulture: boolean;
  showRedRisk: boolean;
  showDistrict: boolean;
  showChiefdom: boolean;
  showHealthFacility: boolean;
}

const useFieldVisibility = (
  isSiteUser: boolean,
  isAdminForm: boolean,
  selectedAdmins: string,
  role: string,
  formDetails: any,
  index: number
): IFieldVisibility => {
  const { DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  return useMemo(() => {
    const showTimezone = true;

    const showCulture = isSiteUser;

    const showRedRisk = isSiteUser && formDetails.fields?.value[index]?.roleName?.value !== HEALTH_FACILITY_ADMIN;

    const showDistrict =
      !isSiteUser &&
      !isAdminForm &&
      [DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== DISTRICT_ADMIN &&
      role !== CHIEFDOM_ADMIN &&
      role !== HEALTH_FACILITY_ADMIN;

    const showChiefdom =
      !isSiteUser &&
      !isAdminForm &&
      [HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== CHIEFDOM_ADMIN &&
      role !== HEALTH_FACILITY_ADMIN;

    const showHealthFacility = !isSiteUser && !isAdminForm && selectedAdmins === HEALTH_FACILITY_ADMIN;

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
