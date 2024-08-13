import APPCONSTANTS from '../../constants/appConstants';
import { IHFUserGet, IUserRole } from '../../store/healthFacility/types';

const { DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
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
  return currentAdmin.name === roleName ? (user.organizations || []).map((org) => org.name).join(', ') : '';
};

/**
 * Formats health facility names for the user with the HEALTH_FACILITY_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of health facility names if the user has the HEALTH_FACILITY_ADMIN role.
 */
const formatHealthFacility = (user: IHFUserGet): string => formatOrganizations(user, HEALTH_FACILITY_ADMIN);

/**
 * Formats district names for the user with the DISTRICT_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of district names if the user has the DISTRICT_ADMIN role.
 */
const formatDistrict = (user: IHFUserGet): string => formatOrganizations(user, DISTRICT_ADMIN);

/**
 * Formats chiefdom names for the user with the CHIEFDOM_ADMIN role.
 *
 * @param {IHFUserGet} user - The user object containing roles and organizations.
 * @returns {string} A comma-separated list of chiefdom names if the user has the CHIEFDOM_ADMIN role.
 */
const formatChiefdom = (user: IHFUserGet): string => formatOrganizations(user, CHIEFDOM_ADMIN);

export const columnDef = ({
  chiefdomModuleName,
  districtModuleName
}: {
  chiefdomModuleName: string;
  districtModuleName: string;
}) => {
  return [
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
      name: 'district',
      label: districtModuleName,
      width: '20%',
      cellFormatter: formatDistrict
    },
    {
      id: 3,
      name: 'chiefdom',
      label: chiefdomModuleName,
      width: '20%',
      cellFormatter: formatChiefdom
    },
    {
      id: 3,
      name: 'healthFacility',
      label: 'HEALTH FACILITY',
      width: '20%',
      cellFormatter: formatHealthFacility
    },
    {
      id: 5,
      name: 'phoneNumber',
      label: 'CONTACT NUMBER',
      width: '18%',
      cellFormatter: (user: IHFUserGet) => `+${user.countryCode} ${user.phoneNumber}`
    }
  ];
};
