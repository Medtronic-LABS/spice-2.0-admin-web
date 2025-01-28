import {
  formatOrganizations,
  formatHealthFacility,
  columnDef,
  formatName,
  formatRoles,
  formatDistrict,
  formatChiefdom
} from '../adminListMeta';
import { IHFUserGet } from '../../../store/healthFacility/types';

const config = {
  chiefdomModuleName: 'Chiefdoms',
  districtModuleName: 'Districts'
};
describe('Formatting Functions', () => {
  const user: IHFUserGet = {
    firstName: 'John',
    lastName: 'Doe',
    roles: [
      {
        displayName: 'Admin',
        id: 0,
        name: '',
        appTypes: []
      },
      {
        displayName: 'Manager',
        id: 0,
        name: '',
        appTypes: []
      }
    ],
    organizations: [
      {
        formName: 'HEALTH_FACILITY_ADMIN',
        name: 'Clinic A',
        displayName: false,
        id: 0,
        parentOrganizationId: null,
        formDataId: 0
      }
    ],
    countryCode: '1',
    phoneNumber: '123-456-7890',
    gender: '',
    username: '',
    tenantId: 0,
    supervisor: null
  };

  it('formats the full name correctly', () => {
    const result = formatName(user);
    expect(result).toBe('John Doe');
  });

  it('formats roles correctly', () => {
    const result = formatRoles(user);
    expect(result).toBe('Admin, Manager');
  });

  it('formats roles correctly without roles array', () => {
    const result = formatRoles({ ...user, roles: undefined as any });
    expect(result).toBe('');
  });

  it('formats health facility names when role matches', () => {
    const result = formatHealthFacility(user);
    expect(result).toBe('');
  });

  it('formats organizations correctly based on role name', () => {
    const result = formatOrganizations(user, 'HEALTH_FACILITY_ADMIN');
    expect(result).toBe('Clinic A');
  });

  it('returns an empty string when no organizations match', () => {
    const result = formatOrganizations(user, 'DISTRICT_ADMIN');
    expect(result).toBe('');
  });

  it('formats organizations without organizations array', () => {
    const result = formatOrganizations({ ...user, organizations: undefined as any }, 'HEALTH_FACILITY_ADMIN');
    expect(result).toBe('');
  });
  it('returns correct column definitions', () => {
    const columns = columnDef(config);

    expect(columns).toHaveLength(6);

    expect(columns[0].name).toBe('name');
    expect(columns[0].cellFormatter).toBeDefined();

    expect(columns[1].name).toBe('role');
    expect(columns[1].cellFormatter).toBeDefined();

    expect(columns[2].name).toBe('district');
    expect(columns[2].label).toBe('Districts');
    expect(columns[2].cellFormatter).toBeDefined();

    expect(columns[3].name).toBe('chiefdom');
    expect(columns[3].label).toBe('Chiefdoms');
    expect(columns[3].cellFormatter).toBeDefined();

    expect(columns[4].name).toBe('healthFacility');
    expect(columns[4].cellFormatter).toBeDefined();

    expect(columns[5].name).toBe('phoneNumber');
    expect(columns[5].cellFormatter).toBeDefined();
  });
  it('formats phone number correctly', () => {
    const columns = columnDef({
      chiefdomModuleName: 'Chiefdoms',
      districtModuleName: 'Districts'
    });
    const phoneFormatter = columns.find((col) => col.name === 'phoneNumber')?.cellFormatter;
    const result = phoneFormatter?.(user);
    expect(result).toBe('+1  123-456-7890');
  });

  it('should format district names based on user roles and organizations', () => {
    const mockUser: IHFUserGet = {
      firstName: 'John',
      lastName: 'Doe',
      roles: [],
      organizations: [
        {
          formName: 'district',
          name: 'District A',
          displayName: false,
          id: 0,
          parentOrganizationId: null,
          formDataId: 0
        },
        {
          formName: 'district',
          name: 'District B',
          displayName: false,
          id: 0,
          parentOrganizationId: null,
          formDataId: 0
        }
      ],
      gender: '',
      phoneNumber: '',
      username: '',
      countryCode: '',
      tenantId: 0,
      supervisor: null
    };

    const result = formatDistrict(mockUser);

    expect(result).toBe('District A, District B');
  });

  it('should return an empty string if no organizations match the district', () => {
    const mockUser: IHFUserGet = {
      firstName: 'John',
      lastName: 'Doe',
      roles: [],
      organizations: [
        {
          formName: 'healthFacility',
          name: 'Health Facility A',
          displayName: false,
          id: 0,
          parentOrganizationId: null,
          formDataId: 0
        }
      ],
      gender: '',
      phoneNumber: '',
      username: '',
      countryCode: '',
      tenantId: 0,
      supervisor: null
    };

    const result = formatDistrict(mockUser);

    expect(result).toBe('');
  });
  it('should format chiefdom names based on user roles and organizations', () => {
    const mockUser: IHFUserGet = {
      firstName: 'Jane',
      lastName: 'Doe',
      roles: [],
      organizations: [
        {
          formName: 'chiefdom',
          name: 'Chiefdom A',
          displayName: false,
          id: 0,
          parentOrganizationId: null,
          formDataId: 0
        },
        {
          formName: 'chiefdom',
          name: 'Chiefdom B',
          displayName: false,
          id: 0,
          parentOrganizationId: null,
          formDataId: 0
        }
      ],
      gender: '',
      phoneNumber: '',
      username: '',
      countryCode: '',
      tenantId: 0,
      supervisor: null
    };

    const result = formatChiefdom(mockUser);

    expect(result).toBe('Chiefdom A, Chiefdom B');
  });

  it('should return an empty string if no organizations match the chiefdom', () => {
    const mockUser: IHFUserGet = {
      firstName: 'Jane',
      lastName: 'Doe',
      roles: [],
      organizations: [
        {
          formName: 'district',
          name: 'District A',
          displayName: false,
          id: 0,
          parentOrganizationId: null,
          formDataId: 0
        }
      ],
      gender: '',
      phoneNumber: '',
      username: '',
      countryCode: '',
      tenantId: 0,
      supervisor: null
    };

    const result = formatChiefdom(mockUser);

    expect(result).toBe('');
  });
});
