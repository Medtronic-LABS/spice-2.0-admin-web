import { columnDef } from '../userListMeta';
import { IHFUserGet } from '../../../store/healthFacility/types';

describe('Column Definitions and Formatting Functions', () => {
  const user: IHFUserGet = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe@example.com',
    roles: [
      {
        displayName: 'Admin',
        id: 1,
        name: 'admin',
        appTypes: []
      },
      {
        displayName: 'Manager',
        id: 2,
        name: 'manager',
        appTypes: []
      }
    ],
    organizations: [
      {
        formName: 'HEALTH_FACILITY_ADMIN',
        name: 'Main Clinic',
        displayName: true,
        id: 1,
        parentOrganizationId: null,
        formDataId: 1
      }
    ],
    countryCode: '1',
    phoneNumber: '123-456-7890',
    gender: 'Male',
    tenantId: 0,
    supervisor: null
  };

  it('formats the full name correctly in the name column', () => {
    const nameFormatter = columnDef.find((col: { name: string }) => col.name === 'name')?.cellFormatter;
    const result = nameFormatter?.(user);
    expect(result).toBe('John Doe');
  });

  it('formats roles correctly in the role column', () => {
    const roleFormatter = columnDef.find((col: { name: string }) => col.name === 'role')?.cellFormatter;
    const result = roleFormatter?.(user);
    expect(result).toBe('Admin,Manager');
  });

  it('formats phone number correctly in the phoneNumber column', () => {
    const phoneFormatter = columnDef.find((col: { name: string }) => col.name === 'phoneNumber')?.cellFormatter;
    const result = phoneFormatter?.(user);
    expect(result).toBe('+1 123-456-7890');
  });

  it('verifies the column configuration', () => {
    expect(columnDef).toHaveLength(6);

    const [nameCol, emailCol, roleCol, healthFacilityCol, genderCol, phoneCol] = columnDef;

    expect(nameCol.name).toBe('name');
    expect(nameCol.label).toBe('Name');
    expect(nameCol.width).toBe('14%');
    expect(nameCol.cellFormatter).toBeDefined();

    expect(emailCol.name).toBe('username');
    expect(emailCol.label).toBe('Email ID');
    expect(emailCol.width).toBe('21%');

    expect(roleCol.name).toBe('role');
    expect(roleCol.label).toBe('ROLE');
    expect(roleCol.width).toBe('16%');
    expect(roleCol.cellFormatter).toBeDefined();

    expect(healthFacilityCol.name).toBe('healthFacility');
    expect(healthFacilityCol.label).toBe('HEALTH FACILITY');
    expect(healthFacilityCol.width).toBe('16%');
    expect(healthFacilityCol.cellFormatter).toBeDefined();

    expect(genderCol.name).toBe('gender');
    expect(genderCol.label).toBe('GENDER');
    expect(genderCol.width).toBe('7%');

    expect(phoneCol.name).toBe('phoneNumber');
    expect(phoneCol.label).toBe('CONTACT NUMBER');
    expect(phoneCol.width).toBe('15%');
    expect(phoneCol.cellFormatter).toBeDefined();
  });
});
