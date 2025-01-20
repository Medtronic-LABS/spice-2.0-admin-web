import {
  isEmpty,
  required,
  validateEmail,
  validatePassword,
  maxLength,
  composeValidators,
  convertToNumber,
  convertToFloatNumber,
  checkIfFloatNumber,
  isWholeNumber,
  checkifNumberIncDecimal,
  camel2Title,
  convertToCaptilize,
  convertToLowerCase,
  convertToSubString,
  validateText,
  minLength,
  validateName,
  validateLastName,
  validateFullName,
  validateMobile,
  containsOnlyLettersAndNumbers,
  validateEntityName,
  checkIfLessThan,
  checkIfGreater,
  validateCountryCode,
  normalizePhone,
  validateCheckbox,
  formatDate,
  formValidators,
  normalizeFloatingNumber,
  validateLatitude,
  validateLongitude
} from '../validation';

describe('Validation', () => {
  describe('Validation Test cases', () => {
    describe('isEmpty', () => {
      it('returns true for empty values', () => {
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty([] as any)).toBe(true);
      });

      it('returns false for non-empty values', () => {
        expect(isEmpty('value')).toBe(false);
        expect(isEmpty(['item'] as any)).toBe(false);
      });
    });

    describe('required', () => {
      it('returns an error message for empty values', () => {
        expect(required(undefined)).toBe('Please enter ');
        expect(required(null)).toBe('Please enter ');
        expect(required('')).toBe('Please enter ');
        expect(required([])).toBe('Please enter ');
      });

      it('returns undefined for non-empty values', () => {
        expect(required('value')).toBeUndefined();
        expect(required(['item'])).toBeUndefined();
      });
    });

    describe('validateEmail', () => {
      it('returns an error message for invalid email', () => {
        expect(validateEmail('invalid')).toBe('Please enter a valid ');
        expect(validateEmail('test@example')).toBe('Please enter a valid ');
      });

      it('returns an empty string for valid email', () => {
        expect(validateEmail('test@example.com')).toBe('');
        expect(validateEmail('user@gmail.com')).toBe('');
      });
    });
    describe('validatePassword', () => {
      it('returns an error message for invalid password', () => {
        expect(validatePassword('abc')).toBe('Please enter a valid password.');
        expect(validatePassword('password')).toBe('Please enter a valid password.');
      });

      it('returns an empty string for valid password', () => {
        expect(validatePassword('Password123')).toBe('');
      });
    });

    describe('maxLength', () => {
      it('returns an error message for values exceeding the maximum length', () => {
        const max5 = maxLength(5);
        expect(max5('123456')).toBe('Please enter a valid ');
        expect(max5('abcdef')).toBe('Please enter a valid ');
      });

      it('returns undefined for values within the maximum length', () => {
        const max10 = maxLength(10);
        expect(max10('12345')).toBeUndefined();
        expect(max10('abcdefghij')).toBeUndefined();
      });
    });

    describe('composeValidators', () => {
      test('should return undefined when all validators pass', () => {
        const validator1 = jest.fn().mockReturnValue(undefined);
        const validator2 = jest.fn().mockReturnValue(undefined);
        const validator3 = jest.fn().mockReturnValue(undefined);

        const composedValidator = composeValidators(validator1, validator2, validator3);
        const value = 'Test value';
        const allValues = {};

        const result = composedValidator(value, allValues);
        expect(result).toBeUndefined();

        expect(validator1).toHaveBeenCalledWith(value, allValues);
        expect(validator2).toHaveBeenCalledWith(value, allValues);
        expect(validator3).toHaveBeenCalledWith(value, allValues);
      });

      test('should return the first error message when a validator fails', () => {
        const validator1 = jest.fn().mockReturnValue(undefined);
        const validator2 = jest.fn().mockReturnValue('Error 1');
        const validator3 = jest.fn().mockReturnValue('Error 2');

        const composedValidator = composeValidators(validator1, validator2, validator3);
        const value = 'Test value';
        const allValues = {};

        const result = composedValidator(value, allValues);
        expect(result).toBe('Error 1');

        expect(validator1).toHaveBeenCalledWith(value, allValues);
        expect(validator2).toHaveBeenCalledWith(value, allValues);
        expect(validator3).not.toHaveBeenCalled();
      });
    });

    describe('convertToNumber', () => {
      test('should remove all non-numeric characters from the string', () => {
        const input = 'abc123xyz456';
        const result = convertToNumber(input);
        expect(result).toBe('123456');
      });

      test('should return an empty string for an empty input', () => {
        const input = '';
        const result = convertToNumber(input);
        expect(result).toBe('');
      });
    });

    describe('convertToFloatNumber', () => {
      test('should remove all non-numeric and non-decimal characters from the string', () => {
        const input = 'abc123.45xyz678.90';
        const result = convertToFloatNumber(input);
        expect(result).toBe('123.45678.90');
      });

      test('should return an empty string for an empty input', () => {
        const input = '';
        const result = convertToFloatNumber(input);
        expect(result).toBe('');
      });
    });

    describe('checkIfFloatNumber', () => {
      test('should return an error message for a negative float number', () => {
        const input = '-1.23';
        const result = checkIfFloatNumber(input);
        expect(result).toBe('Please enter a valid');
      });

      test('should return undefined for a non-negative float number', () => {
        const input = '4.56';
        const result = checkIfFloatNumber(input);
        expect(result).toBeUndefined();
      });
    });

    describe('isWholeNumber', () => {
      test('should return true for a string containing at least one digit', () => {
        const input = 'abc123xyz';
        const result = isWholeNumber(input);
        expect(result).toBe(true);
      });

      test('should return false for a string without any digits', () => {
        const input = 'abcdef';
        const result = isWholeNumber(input);
        expect(result).toBe(false);
      });
    });

    describe('checkIfNumberIncDecimal', () => {
      test('should return true for a string containing at least one digit or a decimal point', () => {
        const input = 'abc123.xyz';
        const result = checkifNumberIncDecimal(input);
        expect(result).toBe(true);
      });

      test('should return false for a string without any digits or decimal point', () => {
        const input = 'abcdef';
        const result = checkifNumberIncDecimal(input);
        expect(result).toBe(false);
      });
    });

    describe('camel2Title', () => {
      test('should convert a camel case string to title case', () => {
        const input = 'helloWorld';
        const result = camel2Title(input);
        expect(result).toBe('Hello World');
      });

      test('should return an empty string for an empty input', () => {
        const input = '';
        const result = camel2Title(input);
        expect(result).toBe('');
      });
    });

    describe('convertToCaptilize', () => {
      test('should convert the first character of the string to uppercase', () => {
        const input = 'hello';
        const result = convertToCaptilize(input);
        expect(result).toBe('Hello');
      });

      test('should return an empty string for an empty input', () => {
        const input = '';
        const result = convertToCaptilize(input);
        expect(result).toBe('');
      });
    });

    describe('convertToLowerCase', () => {
      test('should convert the string to lowercase', () => {
        const input = 'HeLLo';
        const result = convertToLowerCase(input);
        expect(result).toBe('hello');
      });

      test('should return an empty string for an empty input', () => {
        const input = '';
        const result = convertToLowerCase(input);
        expect(result).toBe('');
      });
    });

    describe('convertToSubString', () => {
      const testTitle =
        'should return the original string if its length is less than or equal to the specified character length';
      test(testTitle, () => {
        const input = 'Lorem ipsum dolor sit amet.';
        const result = convertToSubString(input, 30);
        expect(result).toBe(input);
      });

      test('should return a substring of the original string with an ellipsis (...) if its length is greater than the specified character length', () => {
        const input = 'Lorem ipsum dolor sit amet.';
        const result = convertToSubString(input, 10);
        expect(result).toBe('Lorem ipsu...');
      });
    });

    describe('validateText', () => {
      test('should return an empty string for a string containing only letters and spaces', () => {
        const input = 'Hello World';
        const result = validateText(input);
        expect(result).toBe('');
      });

      test('should return an error message for a string containing non-letter characters', () => {
        const input = 'Hello123';
        const result = validateText(input);
        expect(result).toBe('Please enter text in ');
      });
    });

    describe('minLength', () => {
      test('should return an error message if the string length is less than the specified minimum length', () => {
        const input = 'Hello';
        const result = minLength(10)(input);
        expect(result).toBe('Please enter a valid ');
      });

      const testTitle1 =
        'should return undefined if the string length is greater than or equal to the specified minimum length';
      test(testTitle1, () => {
        const input = 'Hello World';
        const result = minLength(5)(input);
        expect(result).toBeUndefined();
      });
    });

    describe('validateName', () => {
      const testTitle = `should return an empty string for a name with 2 to 100 letters, dots, hyphens, single quotes, or spaces`;
      test(testTitle, () => {
        const input = 'John Doe';
        const result = validateName(input);
        expect(result).toBe('');
      });

      test('should return an error message for a name with invalid characters or length', () => {
        const input = 'John123';
        const result = validateName(input);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('validateLastName', () => {
      const testTitle =
        'should return an empty string for a last name with 1 to 100 letters, dots, hyphens, single quotes, or spaces';
      test(testTitle, () => {
        const input = 'Doe';
        const result = validateLastName(input);
        expect(result).toBe('');
      });

      test('should return an error message for a last name with invalid characters or length', () => {
        const input = 'Doe123';
        const result = validateLastName(input);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('validateFullName', () => {
      const testTitle =
        'should return an empty string for a full name with 2 to 30 letters, dots, hyphens, single quotes, or spaces';
      test(testTitle, () => {
        const input = 'John Doe';
        const result = validateFullName(input);
        expect(result).toBe('');
      });

      test('should return an error message for a full name with invalid characters or length', () => {
        const input = 'John Doe 123';
        const result = validateFullName(input);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('validateMobile', () => {
      test('should return an empty string for a mobile number with 8 to 10 digits', () => {
        const input = '12345678';
        const result = validateMobile(input, false);
        expect(result).toBe('');
      });

      test('should return an empty string for an empty mobile number', () => {
        const input = '';
        const result = validateMobile(input, false);
        expect(result).toBe('');
      });

      test('should return an error message for a mobile number with invalid characters or length', () => {
        const input = '12345';
        const result = validateMobile(input, false);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('containsOnlyLettersAndNumbers', () => {
      test('should return an empty string for a string containing only letters, numbers, or spaces', () => {
        const input = 'Hello123';
        const result = containsOnlyLettersAndNumbers(input);
        expect(result).toBe('');
      });

      test('should return an error message for a string containing invalid characters', () => {
        const input = 'Hello$123';
        const result = containsOnlyLettersAndNumbers(input);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('validateEntityName', () => {
      test('should return an empty string for a valid entity name with 2 to 64 letters, numbers, dots, hyphens, single quotes, commas, parentheses, ampersands, slashes, or spaces', () => {
        const input = `Example Inc.'s Company`;
        const result = validateEntityName(input);
        expect(result).toBe('');
      });

      test('should return an error message for an entity name with invalid characters or length', () => {
        const input = '1';
        const result = validateEntityName(input);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('checkIfLessThan', () => {
      test('should return an empty string for a value less than the max value', () => {
        const max = 100;
        const value = 50;
        const result = checkIfLessThan(max)(value);
        expect(result).toBe(undefined);
      });

      test('should return an error message for a value greater than or equal to the max value', () => {
        const max = 100;
        const value = 150;
        const result = checkIfLessThan(max)(value);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('checkIfGreater', () => {
      test('should return an empty string for a value greater than the min value', () => {
        const min = 0;
        const value = 10;
        const result = checkIfGreater(min)(value);
        expect(result).toBe(undefined);
      });

      test('should return an error message for a value less than or equal to the min value', () => {
        const min = 0;
        const value = -5;
        const result = checkIfGreater(min)(value);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('validateCountryCode', () => {
      test('should return an empty string for a valid country code with 1 to 5 digits', () => {
        const code = '12345';
        const result = validateCountryCode(code);
        expect(result).toBe('');
      });

      test('should return an error message for an invalid country code', () => {
        const code = 'ABCDE';
        const result = validateCountryCode(code);
        expect(result).toBe('Please enter a valid ');
      });
    });

    describe('normalizePhone', () => {
      test('should return the first 10 digits of a phone number string', () => {
        const phone = '123-456-7890';
        const result = normalizePhone(phone);
        expect(result).toBe('1234567890');
      });

      test('should return undefined for an empty phone number', () => {
        const phone = '';
        const result = normalizePhone(phone);
        expect(result).toBe(undefined);
      });

      test('should return undefined for a phone number with no digits', () => {
        const phone = '- ( )';
        const result = normalizePhone(phone);
        expect(result).toBe('');
      });

      describe('validateCheckbox', () => {
        test('should return an error message for an empty array', () => {
          const value: any = [];
          const result = validateCheckbox(value);
          expect(result).toBe('Please enter');
        });

        test('should return undefined for a non-empty array', () => {
          const value = [1, 2, 3];
          const result = validateCheckbox(value);
          expect(result).toBeUndefined();
        });
      });
    });

    describe('formatDate', () => {
      test('should format the date with short month name', () => {
        const value = new Date('2022-01-15');
        const options = { month: 'short', format: 'DD-MM-YYYY' };
        const result = formatDate(value, options);
        expect(result).toBe('15-Jan-2022');
      });

      test('should format the date with long month name', () => {
        const value = new Date('2022-02-20');
        const options = { month: 'long', format: 'DD-MM-YYYY' };
        const result = formatDate(value, options);
        expect(result).toBe('20-February-2022');
      });

      test('should format the date with numeric month', () => {
        const value = new Date('2022-03-25');
        const options = { month: 'numeric', format: 'DD-MM-YYYY' };
        const result = formatDate(value, options);
        expect(result).toBe('25-02-2022');
      });

      test('should format the date with custom format', () => {
        const value = new Date('2022-04-30');
        const options = { month: 'long', format: 'YYYY/MM/DD' };
        const result = formatDate(value, options);
        expect(result).toBe('2022/April/30');
      });

      test('should format the date from string input', () => {
        const value = '2022-05-10';
        const options = { month: 'short', format: 'DD-MM-YYYY' };
        const result = formatDate(value, options);
        expect(result).toBe('10-May-2022');
      });

      test('should format the date from numeric input', () => {
        const value = 1679683200000;
        const options = { month: 'long', format: 'DD-MM-YYYY' };
        const result = formatDate(value, options);
        expect(result).toBe('25-March-2023');
      });
    });

    describe('formValidators', () => {
      test('should return an empty array if no input props provided', () => {
        const inputProps = {};
        const result = formValidators(inputProps);
        expect(result).toEqual([]);
      });

      test('should include required validator if "required" prop is true', () => {
        const inputProps = { required: true };
        const result = formValidators(inputProps);
        expect(result).toContain(required);
      });

      test('should not include required validator if "required" prop is false', () => {
        const inputProps = { required: false };
        const result = formValidators(inputProps);
        expect(result).not.toContain(required);
      });

      test('should include minLength validator if "minLength" prop is provided', () => {
        const inputProps = { minLength: 5 };
        formValidators(inputProps);
      });

      test('should not include minLength validator if "minLength" prop is null', () => {
        const inputProps = { minLength: null };
        const result = formValidators(inputProps);
        expect(result).not.toContain(minLength(null as any));
      });

      test('should not include minLength validator if "minLength" prop is undefined', () => {
        const inputProps = { minLength: undefined };
        const result = formValidators(inputProps);
        expect(result).not.toContain(minLength(undefined as any));
      });

      test('should include custom validator function if "customValidator" prop is provided', () => {
        const customValidator = (value: string) => {
          if (value !== 'custom') {
            return 'Please enter "custom" value.';
          }
        };
        const inputProps = { customValidator };
        const result = formValidators(inputProps);
        expect(result).toContain(customValidator);
      });

      test('should return an array of all included validators', () => {
        // tslint:disable-next-line:no-empty
        const inputProps = { required: true, minLength: 3, customValidator: () => {} };
        const result = formValidators(inputProps);
        expect(result).toContain(required);
        expect(result).toContain(inputProps.customValidator);
        expect(result.length).toBe(3);
      });
    });
  });

  describe('normalizeFloatingNumber', () => {
    it('should return undefined for empty input', () => {
      expect(normalizeFloatingNumber('')).toBeUndefined();
      expect(normalizeFloatingNumber(null)).toBeUndefined();
      expect(normalizeFloatingNumber(undefined)).toBeUndefined();
    });

    it('should normalize valid floating numbers', () => {
      expect(normalizeFloatingNumber('123.45')).toBe('123.45');
      expect(normalizeFloatingNumber('   678.90  ')).toBe('678.90');
      expect(normalizeFloatingNumber('-123.45')).toBe('-123.45');
      expect(normalizeFloatingNumber('0.99')).toBe('0.99');
      expect(normalizeFloatingNumber('.5')).toBe('.5');
    });

    it('should remove non-numeric characters', () => {
      expect(normalizeFloatingNumber('123.45abc')).toBe('123.45');
      expect(normalizeFloatingNumber('abc123.45')).toBe('123.45');
      expect(normalizeFloatingNumber('$123.45')).toBe('123.45');
      expect(normalizeFloatingNumber('123.45$')).toBe('123.45');
    });

    it('should return undefined for invalid number formats', () => {
      expect(normalizeFloatingNumber('123..45')).toBeUndefined();
      expect(normalizeFloatingNumber('123.45.67')).toBeUndefined();
      expect(normalizeFloatingNumber('--123.45')).toBeUndefined();
      expect(normalizeFloatingNumber('123-45')).toBeUndefined();
      expect(normalizeFloatingNumber('-123-45')).toBeUndefined();
    });
  });

  describe('validateLatitude', () => {
    test('should return undefined for empty or undefined values', () => {
      expect(validateLatitude(undefined)).toBeUndefined();
      expect(validateLatitude(null)).toBeUndefined();
      expect(validateLatitude('')).toBeUndefined();
    });

    test('should return an empty string for valid latitude values', () => {
      expect(validateLatitude('90')).toBe('');
      expect(validateLatitude('-90')).toBe('');
      expect(validateLatitude('45.1234567')).toBe('');
      expect(validateLatitude('0')).toBe('');
      expect(validateLatitude('+45.0')).toBe('');
    });

    test('should return an error message for invalid latitude values', () => {
      expect(validateLatitude('91')).toBe('Please enter a valid');
      expect(validateLatitude('-91')).toBe('Please enter a valid');
      expect(validateLatitude('100')).toBe('Please enter a valid');
      expect(validateLatitude('abc')).toBe('Please enter a valid');
      expect(validateLatitude('45.')).toBe('Please enter a valid');
    });
  });

  describe('validateLongitude', () => {
    test('should return undefined for empty or undefined values', () => {
      expect(validateLongitude(undefined)).toBeUndefined();
      expect(validateLongitude(null)).toBeUndefined();
      expect(validateLongitude('')).toBeUndefined();
    });

    test('should return an empty string for valid longitude values', () => {
      expect(validateLongitude('180')).toBe('');
      expect(validateLongitude('-180')).toBe('');
      expect(validateLongitude('45.1234567')).toBe('');
      expect(validateLongitude('0')).toBe('');
      expect(validateLongitude('+45.0')).toBe('');
      expect(validateLongitude('179.9999999')).toBe('');
    });

    test('should return an error message for invalid longitude values', () => {
      expect(validateLongitude('181')).toBe('Please enter a valid');
      expect(validateLongitude('-181')).toBe('Please enter a valid');
      expect(validateLongitude('200')).toBe('Please enter a valid');
      expect(validateLongitude('abc')).toBe('Please enter a valid');
      expect(validateLongitude('45.')).toBe('Please enter a valid');
    });
    test('should return an empty string for empty email input', () => {
      expect(validateEmail('')).toBe('');
    });
  });

  describe('required', () => {
    it('returns an error message for empty arrays', () => {
      const emptyArray: any[] = [];
      expect(required(emptyArray)).toBe('Please enter ');
    });

    it('returns undefined for non-empty arrays', () => {
      const nonEmptyArray = [1, 2, 3];
      expect(required(nonEmptyArray)).toBeUndefined();
    });
  });

  describe('mobile validation', () => {
    it('should return error message when number starts with 0', () => {
      const input = '0123456789';
      const result = validateMobile(input, true);
      expect(result).toBe('Please enter a valid ');
    });

    it('should return empty string for valid SL number not starting with 0', () => {
      const input = '123456789';
      const result = validateMobile(input, true);
      expect(result).toBe('');
    });

    it('should return error for SL number with 5 consecutive same digits', () => {
      const input = '111110000';
      const result = validateMobile(input, true);
      expect(result).toBe('Please enter a valid ');
    });
  });

  describe('mobile validation', () => {
    it('should return error for numbers with 5 or more consecutive same digits', () => {
      expect(validateMobile('111110000', true)).toBe('Please enter a valid ');
      expect(validateMobile('777777890', true)).toBe('Please enter a valid ');
      expect(validateMobile('123444444', true)).toBe('Please enter a valid ');
    });

    it('should accept numbers with less than 5 consecutive same digits', () => {
      expect(validateMobile('11112222', true)).toBe('');
      expect(validateMobile('123333456', true)).toBe('');
      expect(validateMobile('999912345', true)).toBe('');
    });

    it('should validate number length for SL numbers', () => {
      expect(validateMobile('1234567', true)).toBe('Please enter a valid ');
      expect(validateMobile('12345678', true)).toBe('');
      expect(validateMobile('123456789', true)).toBe('');
      expect(validateMobile('1234567890', true)).toBe('');
      expect(validateMobile('12345678901', true)).toBe('Please enter a valid ');
    });
  });
});
