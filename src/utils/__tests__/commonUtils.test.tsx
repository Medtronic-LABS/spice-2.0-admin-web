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
  filterByAppTypes,
  decodeURIText,
  removeRedRiskFromRoleArray
} from '../commonUtils';
import { IHFUserGet } from '../../store/healthFacility/types';
import APPCONSTANTS from '../../constants/appConstants';
import { redRisk } from '../../constants/roleConstants';

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

  describe('filterByAppTypes', () => {
    it('should filter the data by appTypes', () => {
      const result = filterByAppTypes(
        [
          { id: 1, name: APPCONSTANTS.appTypes.community, appTypes: [APPCONSTANTS.appTypes.community] },
          { id: 2, name: APPCONSTANTS.appTypes.non_community, appTypes: [APPCONSTANTS.appTypes.non_community] }
        ],
        [APPCONSTANTS.appTypes.community]
      );
      expect(result).toEqual([
        { id: 1, name: APPCONSTANTS.appTypes.community, appTypes: [APPCONSTANTS.appTypes.community] }
      ]);
    });
  });

  describe('decodeURIText', () => {
    it('should decode the text', () => {
      const result = decodeURIText('test');
      expect(result).toBe('test');
    });

    it('should return original text when decoding fails', () => {
      const originalDecodeURI = global.decodeURIComponent;
      global.decodeURIComponent = jest.fn(() => {
        throw new Error('Decoding failed');
      });

      const malformedText = '%E0%A4%A';
      const result = decodeURIText(malformedText);

      expect(result).toBe(malformedText);

      global.decodeURIComponent = originalDecodeURI;
    });
  });

  describe('removeRedRiskFromRoleArray', () => {
    it('should remove the redRisk role from the array', () => {
      const result = removeRedRiskFromRoleArray([
        { name: redRisk, displayName: null },
        { name: 'user', displayName: 'User' }
      ] as any);
      expect(result).toEqual([{ name: 'user', displayName: 'User' }]);
    });
    it('should remove the redRisk role with empty array', () => {
      const result = removeRedRiskFromRoleArray([]);
      expect(result).toEqual([]);
    });
  });
});
