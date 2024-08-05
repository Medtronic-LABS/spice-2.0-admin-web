import APPCONSTANTS from '../../constants/appConstants';
import { IHFUserGet, IUserRole } from '../../store/healthFacility/types';


const { ACCOUNT_ADMIN, HEALTH_FACILITY_ADMIN, SUB_COUNTY_ADMIN } = APPCONSTANTS.ROLES;
/**
 * Formats the user's full name by concatenating the first name and last name.
 *
 * @param {IHFUserGet} user - The user object containing first name and last name.
 * @returns {string} The formatted full name of the user.
 */
const formatName = (user: IHFUserGet): string => `${user.firstName} ${user.lastName}`;

/**
 * Formats the user's roles into a comma-separated string of role display names.
 *
 * @param {IHFUserGet} user - The user object containing roles.
 * @returns {string} A comma-separated list of the user's role display names.
 */
const formatRoles = (user: IHFUserGet): string =>
  `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(',')}`;


/**
 * Formats the organization names for a given user and role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @param {string} roleName - The role name to check against the user's current admin role.
 * @returns {string} A comma-separated list of organization names if the role matches; otherwise, an empty string.
 */
const formatOrganizations = (user: IHFUserGet, roleName: string): string => {
  const [currentAdmin] = user.roles;
  return currentAdmin.name === roleName
    ? (user.organizations || []).map((org) => org.name).join(', ')
    : '';
};

/**
 * Formats health facility names for the user with the HEALTH_FACILITY_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of health facility names if the user has the HEALTH_FACILITY_ADMIN role.
 */
const formatHealthFacility = (user: IHFUserGet): string =>
  formatOrganizations(user, HEALTH_FACILITY_ADMIN);

/**
 * Formats county names for the user with the ACCOUNT_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of county names if the user has the ACCOUNT_ADMIN role.
 */
const formatCounty = (user: IHFUserGet): string =>
  formatOrganizations(user, ACCOUNT_ADMIN);

/**
 * Formats sub-county names for the user with the SUB_COUNTY_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of sub-county names if the user has the SUB_COUNTY_ADMIN role.
 */
const formatSubCounty = (user: IHFUserGet): string =>
  formatOrganizations(user, SUB_COUNTY_ADMIN);

export const columnDef = [
  {
    id: 1,
    name: 'name',
    label: 'Name',
    width: '20%',
    cellFormatter: formatName
  },
  {
    id: 2,
    name: 'role',
    label: 'ROLE',
    width: '20%',
    cellFormatter: formatRoles
  },
  {
    id: 3,
    name: 'county',
    label: 'County',
    width: '20%',
    cellFormatter: formatCounty
  },
  {
    id: 3,
    name: 'subCounty',
    label: 'Sub County',
    width: '20%',
    cellFormatter: formatSubCounty
  },
  {
    id: 3,
    name: 'healthFacility',
    label: 'HEALTH FACILITY',
    width: '20%',
    cellFormatter: formatHealthFacility
  },
  {
    id: 4,
    name: 'gender',
    label: 'GENDER',
    width: '10%'
  },
  {
    id: 5,
    name: 'phoneNumber',
    label: 'CONTACT NUMBER',
    width: '18%',
    cellFormatter: (user: IHFUserGet) => `+${user.countryCode} ${user.phoneNumber}`
  }
];
