import { useMemo } from 'react';
import APPCONSTANTS, { ADMIN_BASED_ON_URL } from '../constants/appConstants';
import { useLocation } from 'react-router-dom';
import { REGION_ADMIN, SUPER_ADMIN } from '../routes';

interface IFieldVisibility {
  showTimezone: boolean;
  showCulture: boolean;
  showRedRisk: boolean;
  showDistrict: boolean;
  showChiefdom: boolean;
  showHealthFacility: boolean;
}

type ModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';

/**
 * Custom hook to determine the visibility of various form fields based on user roles and form details.
 * @param {boolean} isSiteUser - Indicates if the user is a site user
 * @param {boolean} isAdminForm - Indicates if the form is an admin form
 * @param {string} selectedAdmins - The selected admin role
 * @param {string} role - The user's role
 * @param {any} formDetails - The form details
 * @param {number} index - The index of the form field
 * @param {boolean} isHFadminSelected - Indicates if the health facility admin is selected
 * @returns {IFieldVisibility} An object containing the visibility of various form fields
 */
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

    /**
     * Determines if the district field should be shown based on the user's role and form details.
     */
    const showDistrict =
      !isSiteUser &&
      !isAdminForm &&
      [DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== DISTRICT_ADMIN &&
      role !== CHIEFDOM_ADMIN &&
      role !== HEALTH_FACILITY_ADMIN &&
      fetchingFor === SUPER_ADMIN;

    /**
     * Determines if the chiefdom field should be shown based on the user's role and form details.
     */
    const showChiefdom =
      !isSiteUser &&
      !isAdminForm &&
      [HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) &&
      role !== CHIEFDOM_ADMIN &&
      role !== HEALTH_FACILITY_ADMIN &&
      (fetchingFor === SUPER_ADMIN || fetchingFor === REGION_ADMIN);

    /**
     * Determines if the health facility field should be shown based on the user's role and form details.
     */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSiteUser, isAdminForm, selectedAdmins, role, formDetails, index]);
};

export default useFieldVisibility;
