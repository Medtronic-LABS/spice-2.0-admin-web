import { NAMING_VARIABLES } from '../../constants/appConstants';
import { IHFUserGet, IUserRole } from '../../store/healthFacility/types';

const { chiefdom, district, healthFacility } = NAMING_VARIABLES;

/**
 * Formats the user's full name by concatenating the first name and last name.
 *
 * @param {IHFUserGet} user - The user object containing first name and last name.
 * @returns {string} The formatted full name of the user.
 */
export const formatName = (user: IHFUserGet): string => `${user.firstName} ${user.lastName}`;

/**
 * Formats the user's roles into a comma-separated string of role display names.
 *
 * @param {IHFUserGet} user - The user object containing roles.
 * @returns {string} A comma-separated list of the user's role display names.
 */
export const formatRoles = (user: IHFUserGet): string =>
  `${(user.roles || [])
    .filter((filteredUserRole: IUserRole) => filteredUserRole.name !== NAMING_VARIABLES.redRisk)
    .map((userRole: IUserRole) => userRole.displayName)
    .join(', ')}`;

/**
 * Formats the organization names for a given user and role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @param {string} roleName - The role name to check against the user's current admin role.
 * @returns {string} A comma-separated list of organization names if the role matches; otherwise, an empty string.
 */
export const formatOrganizations = (user: IHFUserGet, roleName: string): string => {
  return (user.organizations || [])
    .map((org) => (org.formName === roleName ? org.name : null))
    .filter((name) => name) // Remove null or undefined names
    .join(', ');
};

/**
 * Formats health facility names for the user with the HEALTH_FACILITY_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of health facility names if the user has the HEALTH_FACILITY_ADMIN role.
 */
export const formatHealthFacility = (user: IHFUserGet): string => formatOrganizations(user, healthFacility);

/**
 * Formats district names for the user with the DISTRICT_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of district names if the user has the DISTRICT_ADMIN role.
 */
export const formatDistrict = (user: IHFUserGet): string => formatOrganizations(user, district);

/**
 * Formats chiefdom names for the user with the CHIEFDOM_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of chiefdom names if the user has the CHIEFDOM_ADMIN role.
 */
export const formatChiefdom = (user: IHFUserGet): string => formatOrganizations(user, chiefdom);

export const columnDef = ({
  chiefdomModuleName,
  districtModuleName,
  healthFacilityModuleName
}: {
  chiefdomModuleName: string;
  districtModuleName: string;
  healthFacilityModuleName: string;
}) => {
  return [
    {
      id: 1,
      name: 'name',
      label: 'Name',
      width: '14%',
      cellFormatter: formatName
    },
    {
      id: 2,
      name: 'role',
      label: 'ROLE',
      width: '14%',
      cellFormatter: formatRoles
    },
    {
      id: 3,
      name: district,
      label: districtModuleName,
      width: '14%',
      cellFormatter: formatDistrict
    },
    {
      id: 4,
      name: chiefdom,
      label: chiefdomModuleName,
      width: '14%',
      cellFormatter: formatChiefdom
    },
    {
      id: 5,
      name: 'healthFacility',
      label: healthFacilityModuleName,
      width: '14%',
      cellFormatter: formatHealthFacility
    },
    {
      id: 6,
      name: 'phoneNumber',
      label: 'CONTACT NUMBER',
      width: '14%',
      cellFormatter: (user: IHFUserGet) => `${user.countryCode ? '+' + user.countryCode : ''}  ${user.phoneNumber}`
    }
  ];
};
