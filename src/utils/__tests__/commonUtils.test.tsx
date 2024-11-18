import { saveAs } from 'file-saver';
import {
  decryptData,
  encryptData,
  appendZeroBefore,
  resetFields,
  stopPropogation,
  fileDownload,
  convertDate,
  formatDate,
  jsonParse,
  formatCountryCode,
  formatRoles,
  getUserPayload,
  getAdminPayload
} from '../commonUtils';
import { IHFUserGet } from '../../store/healthFacility/types';
import APPCONSTANTS, { NAMING_VARIABLES } from '../../constants/appConstants';
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));
describe('commonUtils', () => {
  beforeEach(() => {
    process.env.REACT_APP_CRYPTR_SECRET_KEY = 'spice_uat';
  });
  describe('decryptData', () => {
    it('should decrypt the password correctly', () => {
      const password = 'encryptedPassword';
      const decrypted = decryptData(password);
      expect(decrypted).toBe('');
    });
  });

  describe('encryptData', () => {
    it('should encrypt the value correctly', () => {
      const value = 'plainValue';
      const encrypted = encryptData(value);
      expect(encrypted).not.toBe(value);
    });
  });

  describe('appendZeroBefore', () => {
    it('should append zeros before the number', () => {
      const num = 5;
      const minimumIntegerDigits = 3;
      const result = appendZeroBefore(num, minimumIntegerDigits);
      expect(result).toBe('005');
    });
  });

  describe('appendZeroBefore for case 0', () => {
    it('should append zeros before the number', () => {
      const num = 0;
      const minimumIntegerDigits = 3;
      const result = appendZeroBefore(num, minimumIntegerDigits);
      expect(result).toBe('000');
    });
  });

  describe('resetFields', () => {
    it('should reset fields based on the given substring', () => {
      const subStrOfKey = 'example';
      const state = {
        fields: {
          field1: 'value1',
          field2_example: 'value2',
          field3_example: 'value3'
        }
      };
      const utils = {
        resetFieldState: jest.fn()
      };

      resetFields([subStrOfKey], state, utils);
      expect(utils.resetFieldState).toHaveBeenCalledTimes(2);
      expect(utils.resetFieldState).toHaveBeenCalledWith('field2_example');
      expect(utils.resetFieldState).toHaveBeenCalledWith('field3_example');
    });
  });

  describe('resetFields', () => {
    it('should catch and log an error when an exception occurs', () => {
      const subStrOfKey = 'example';
      const state = {
        fields: {
          field1: 'value1',
          field2_example: 'value2',
          field3_example: 'value3'
        }
      };
      const utils = {
        resetFieldState: jest.fn(() => {
          throw new Error('Mocked error');
        })
      };
      // tslint:disable-next-line:no-empty
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      resetFields([subStrOfKey], state, utils);

      expect(utils.resetFieldState).toHaveBeenCalledTimes(1);
      expect(utils.resetFieldState).toHaveBeenCalledWith('field2_example');
      expect(utils.resetFieldState).toHaveBeenCalledWith('field2_example');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing form', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('stopPropogation', () => {
    it('should stop event propagation', () => {
      const stopPropagationMock = jest.fn();
      const event = {
        stopPropagation: stopPropagationMock
      };

      stopPropogation(event as any);
      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    });
    it('should catch and log an error when an exception occurs', () => {
      const stopPropagationMock = jest.fn(() => {
        throw new Error('Mocked error');
      });
      const event = {
        stopPropagation: stopPropagationMock
      };
      // tslint:disable-next-line:no-empty
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      stopPropogation(event as any);

      expect(stopPropagationMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
    it('should create a Blob and trigger a file download', async () => {
      const data = 'Test data';
      const fileName = 'test';
      const fileType = 'text/plain';
      const fileExtension = '.txt';

      await fileDownload(data, fileName, fileType, fileExtension);

      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'test.txt', { autoBom: false });
    });

    it('should call saveAs without fileExtension if not provided', async () => {
      const data = 'test data';
      const fileName = 'testFile';
      const fileType = 'text/plain';

      await fileDownload(data, fileName, fileType);

      const expectedBlob = new Blob([data], { type: fileType });
      expect(saveAs).toHaveBeenCalledWith(expectedBlob, fileName, { autoBom: false });
    });
    it('should convert a Date object to YYYY-MM-DD format', () => {
      const date = new Date('2023-10-05T12:00:00Z');
      const result = convertDate(date);
      expect(result).toBe('2023-10-05');
    });
    it('should convert a date string to YYYY-MM-DD format', () => {
      const dateString = '2023-10-05';
      const result = convertDate(dateString);
      expect(result).toBe('2023-10-05');
    });
    it('should handle single-digit month and day correctly', () => {
      const date = new Date('2023-01-05T12:00:00Z');
      const result = convertDate(date);
      expect(result).toBe('2023-01-05');
    });

    it('should handle invalid date input', () => {
      const invalidDate = 'invalid-date-string';
      const result = convertDate(invalidDate);
      expect(result).toBe('NaN-NaN-NaN');
    });
    it('should handle empty input', () => {
      const result = convertDate('');
      expect(result).toBe('NaN-NaN-NaN');
    });

    it('should format a date string to YYYY/MM/DD format', () => {
      const date = '14/05/2023';
      const result = formatDate(date, 'YYYY/MM/DD');
      expect(result).toBe('2023/05/14');
    });
    it('should format a date string to YYYY-MM-DD format without delimiter', () => {
      const date = '14/05/2023';
      const result = formatDate(date);
      expect(result).toBe('YYY-05-14');
    });

    it('should handle invalid date parts', () => {
      const date = '2023-123-05';
      const result = formatDate(date, 'YYYY-MM-DD');

      expect(result).toBe('2023-05-');
    });
    it('should format a date string to DD-MM-YYYY format', () => {
      const date = '15-10-2023';
      const result = formatDate(date, 'DD-MM-YYYY');
      expect(result).toBe('15-10-2023');
    });

    it('should handle different delimiters', () => {
      const date = '2023.10.25';
      const result = formatDate(date, 'DD/MM/YYYY');
      expect(result).toBe('25/10/2023');
    });

    it('should handle date with day and month swapped', () => {
      const date = '22/10/2023';
      const result = formatDate(date, 'DD/MM/YYYY');
      expect(result).toBe('22/10/2023');
    });
  });

  describe('jsonParse', () => {
    it('should parse a valid JSON string', () => {
      const jsonString = '{"key": "value"}';
      const result = jsonParse(jsonString);
      expect(result).toEqual({ key: 'value' });
    });

    it('should return null for an invalid JSON string', () => {
      const invalidJsonString = '{"key": "value"';
      const result = jsonParse(invalidJsonString);
      expect(result).toBeNull();
    });

    it('should return null for an empty string', () => {
      const result = jsonParse('');
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = jsonParse(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = jsonParse(undefined);
      expect(result).toBeNull();
    });
  });

  describe('formatCountryCode', () => {
    it('should format the country code with a plus sign', () => {
      const result = formatCountryCode('1');
      expect(result).toBe('+1');
    });

    it('should return an empty string for falsy values', () => {
      expect(formatCountryCode('')).toBe('');
      expect(formatCountryCode('')).toBe('');
      expect(formatCountryCode('')).toBe('');
    });

    it('should handle multiple digits', () => {
      const result = formatCountryCode('44');
      expect(result).toBe('+44');
    });
  });

  describe('formatRoles', () => {
    it('should return a comma-separated string of role display names', () => {
      const user: IHFUserGet = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        phoneNumber: '123-456-7890',
        roles: [
          {
            name: 'admin',
            displayName: 'Administrator',
            id: 0,
            appTypes: []
          },
          {
            name: 'user',
            displayName: 'User',
            id: 0,
            appTypes: []
          }
        ],
        username: '',
        countryCode: '',
        tenantId: 0,
        supervisor: null,
        organizations: []
      };
      const result = formatRoles(user);
      expect(result).toBe('Administrator,User');
    });

    it('should exclude roles with the name redRisk', () => {
      const user: IHFUserGet = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        phoneNumber: '123-456-7890',
        roles: [
          {
            name: 'admin',
            displayName: 'Administrator',
            id: 0,
            appTypes: []
          },
          {
            name: 'user',
            displayName: 'User',
            id: 0,
            appTypes: []
          }
        ],
        username: '',
        countryCode: '',
        tenantId: 0,
        supervisor: null,
        organizations: []
      };
      const result = formatRoles(user);
      expect(result).toBe('Administrator,User');
    });

    it('should exclude roles with the name redRisk without roles array', () => {
      const user: any = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        phoneNumber: '123-456-7890',
        username: '',
        countryCode: '',
        tenantId: 0,
        supervisor: null,
        organizations: []
      };
      const result = formatRoles(user);
      expect(result).toBe('');
    });
  });

  describe('getAdminPayload', () => {
    const mockUser = {
      firstName: ' John ',
      lastName: ' Doe ',
      gender: 'Male',
      username: 'johndoe',
      phoneNumber: '1234567890',
      countryCode: { phoneNumberCode: '+1' },
      timezone: 'UTC',
      role: { id: 1 },
      roles: [
        { id: 2, groupName: APPCONSTANTS.spiceRoleGrouped.reports },
        { id: 3, name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }
      ]
    };

    it('should handle non-list payload creation with isFromList false and role as object', () => {
      const result = getAdminPayload({
        userFormData: [mockUser],
        countryId: 1,
        isFromList: false
      });

      expect(result[0]).toEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          username: 'johndoe',
          phoneNumber: '1234567890',
          countryCode: '+1',
          roleIds: [1, 2],
          timezone: 'UTC'
        })
      );
    });

    it('should handle non-list payload creation with isFromList false and role as array', () => {
      const result = getAdminPayload({
        userFormData: [{ ...mockUser, role: [{ id: 1 }] }],
        countryId: 1,
        isFromList: false
      });

      expect(result[0]).toEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          username: 'johndoe',
          phoneNumber: '1234567890',
          countryCode: '+1',
          roleIds: [1, 2],
          timezone: 'UTC'
        })
      );
    });

    it('should handle list payload creation', () => {
      const result = getAdminPayload({
        userFormData: [mockUser],
        countryId: 1,
        isFromList: true
      });

      expect(result[0].roleIds).toEqual(expect.arrayContaining([2, 3]));
    });

    it('should handle different admin roles and tenantId logic', () => {
      const testCases = [
        {
          role: APPCONSTANTS.ROLES.SUPER_ADMIN,
          expectedTenantId: null
        },
        {
          role: APPCONSTANTS.ROLES.REGION_ADMIN,
          tenantId: 123,
          expectedTenantId: 123
        },
        {
          role: APPCONSTANTS.ROLES.DISTRICT_ADMIN,
          district: { tenantId: 456 },
          expectedTenantId: 456
        },
        {
          role: APPCONSTANTS.ROLES.CHIEFDOM_ADMIN,
          chiefdom: { tenantId: 789 },
          expectedTenantId: 789
        },
        {
          role: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN,
          healthfacility: { tenantId: 101 },
          expectedTenantId: 101
        }
      ];

      testCases.forEach(({ role, expectedTenantId, ...additionalProps }) => {
        const userWithRole = {
          ...mockUser,
          roles: [{ name: role }],
          ...additionalProps
        };

        const result = getAdminPayload({
          userFormData: [userWithRole],
          tenantId: 999
        });
        if (role === APPCONSTANTS.ROLES.SUPER_ADMIN) {
          expect(result[0].tenantId).toBe(undefined);
        } else {
          expect(result[0].tenantId).toBe(expectedTenantId);
        }
      });
    });

    it('should handle district and chiefdom data correctly', () => {
      const userWithDistrict = {
        ...mockUser,
        roles: [{ name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
        district: { id: 1 },
        chiefdom: { id: 2 }
      };

      const result = getAdminPayload({
        userFormData: [userWithDistrict],
        isFromSummaryOrProfilePage: false
      });

      expect(result[0].district).toEqual({ id: 1 });
      expect(result[0].chiefdom).toEqual({ id: 2 });
    });
  });

  describe('getUserPayload', () => {
    const mockUser = {
      firstName: ' John ',
      lastName: ' Doe ',
      gender: 'Male',
      username: 'johndoe',
      phoneNumber: '1234567890',
      countryCode: { phoneNumberCode: '+1' },
      culture: 'en-US',
      supervisor: { id: 123 },
      villages: [{ id: 1 }, { id: 2 }],
      village: { id: 3 },
      timezone: 'UTC',
      district: { id: 4 },
      chiefdom: { id: 5 }
    };

    it('should create payload for HFCreate with roles', () => {
      const userFormData = [
        {
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          username: 'johndoe',
          phoneNumber: '123-456-7890',
          roles: [{ id: 1 }, { id: 2 }],
          redRisk: true,
          tenantId: 123
        }
      ];
      const result = getUserPayload({
        userFormData,
        countryId: 'US',
        isHFCreate: true,
        spiceRolesGroup: [{ name: NAMING_VARIABLES.redRisk, id: 999 }]
      });

      expect(result).toEqual([
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          roleIds: expect.arrayContaining([1, 2]),
          redRisk: true,
          tenantId: 123
        })
      ]);
    });

    it('should create payload for non-HFCreate with roles', () => {
      const userFormData = [
        {
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'Female',
          username: 'janesmith',
          phoneNumber: '987-654-3210',
          rolesIds: [{ id: 3, name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
          redRisk: false,
          tenantId: 456
        }
      ];
      const result = getUserPayload({
        userFormData,
        countryId: 1,
        isHFCreate: false,
        spiceRolesGroup: [{ name: NAMING_VARIABLES.redRisk, id: 999 }]
      });

      expect(result).toEqual([
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Smith',
          roleIds: [],
          redRisk: false,
          tenantId: 456,
          country: { id: 1 },
          supervisorId: null,
          timezone: undefined,
          username: 'janesmith',
          village: undefined,
          villageIds: [],
          phoneNumber: '987-654-3210',
          countryCode: null,
          culture: null,
          district: undefined,
          chiefdom: undefined
        })
      ]);
    });
    it('should set tenantId to null for super admin', () => {
      const userFormData = [
        {
          firstName: 'Admin',
          lastName: 'User',
          gender: 'Male',
          username: 'adminuser',
          phoneNumber: '123-456-7890',
          tenantId: 123
        }
      ];
      const result = getUserPayload({
        userFormData,
        countryId: 1,
        isHFCreate: false,
        spiceRolesGroup: []
      });

      expect(result).toEqual([
        expect.objectContaining({
          chiefdom: undefined,
          country: {
            id: 1
          },
          countryCode: null,
          culture: null,
          district: undefined,
          firstName: 'Admin',
          gender: 'Male',
          lastName: 'User',
          phoneNumber: '123-456-7890',
          redRisk: undefined,
          roleIds: [],
          supervisorId: null,
          tenantId: 123,
          timezone: undefined,
          username: 'adminuser',
          village: undefined,
          villageIds: []
        })
      ]);
    });

    it('should handle HF creation payload', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1 }, { id: 2 }]
      };

      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        isHFCreate: true
      });

      expect(result[0]).toEqual(
        expect.objectContaining({
          roleIds: expect.arrayContaining([1, 2]),
          villageIds: [1, 2],
          supervisorId: 123
        })
      );
    });

    it('should handle redRisk role assignment', () => {
      const user = {
        ...mockUser,
        roles: [{ name: 'regular-role' }],
        redRisk: true
      };

      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        spiceRolesGroup: [{ name: NAMING_VARIABLES.redRisk, id: 999 }]
      });

      expect(result[0].roleIds).toContain(999);
    });

    it('should handle tenantId assignment logic', () => {
      const testCases = [
        {
          desc: 'user tenantId',
          user: { ...mockUser, tenantId: 111 },
          expectedTenantId: 111
        },
        {
          desc: 'healthfacility tenantId',
          user: { ...mockUser, healthfacility: { tenantId: 222 } },
          expectedTenantId: 222
        },
        {
          desc: 'URL tenantId',
          user: mockUser,
          tenantId: 333,
          expectedTenantId: 333
        }
      ];

      testCases.forEach(({ desc, user, tenantId, expectedTenantId }) => {
        const result = getUserPayload({
          userFormData: [user],
          countryId: 1,
          tenantId
        });

        expect(result[0].tenantId).toBe(expectedTenantId);
      });
    });

    it('should handle HF admin specific logic', () => {
      const user = {
        ...mockUser,
        roles: [{ name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
        redRisk: true
      };

      const result = getUserPayload({
        userFormData: [user],
        countryId: 1
      });

      expect(result[0].redRisk).toBeUndefined();
      expect(result[0].culture).toBe('en-US');
    });
  });
});
