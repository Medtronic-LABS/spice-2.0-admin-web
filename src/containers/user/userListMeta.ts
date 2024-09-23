import { IHFUserGet } from '../../store/healthFacility/types';
import { formatHealthFacility } from '../admins/adminListMeta';
import { formatRoles } from '../../utils/commonUtils';

const formatName = (user: IHFUserGet) => `${user.firstName} ${user.lastName}`;

export const columnDef = [
  {
    id: 1,
    name: 'name',
    label: 'Name',
    width: '14%',
    cellFormatter: formatName
  },
  {
    id: 2,
    name: 'username',
    label: 'Email ID',
    width: '21%'
  },
  {
    id: 3,
    name: 'role',
    label: 'ROLE',
    width: '16%',
    cellFormatter: formatRoles
  },
  {
    id: 4,
    name: 'healthFacility',
    label: 'HEALTH FACILITY',
    width: '16%',
    cellFormatter: formatHealthFacility
  },
  {
    id: 5,
    name: 'gender',
    label: 'GENDER',
    width: '7%'
  },
  {
    id: 6,
    name: 'phoneNumber',
    label: 'CONTACT NUMBER',
    width: '15%',
    cellFormatter: (user: IHFUserGet) => `+${user.countryCode} ${user.phoneNumber}`
  }
];
