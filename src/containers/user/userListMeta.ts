import { IHFUserGet, IUserRole } from '../../store/healthFacility/types';

const formatName = (user: IHFUserGet) => `${user.firstName} ${user.lastName}`;

const formatRoles = (user: IHFUserGet) =>
  `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(',')}`;

const formatHealthFacility = (user: IHFUserGet) => {
  return `${(user.organizations || []).map((org) => org.name).join(', ')}`;
};
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
