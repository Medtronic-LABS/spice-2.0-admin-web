import DIALOG_CHECKBOX_CONFIG from '../DialogCheckbox';
import APPCONSTANTS from '../../../../../../constants/appConstants';

describe('DIALOG_CHECKBOX_CONFIG', () => {
  describe('getEmptyData', () => {
    it('should return default empty data structure', () => {
      const result = DIALOG_CHECKBOX_CONFIG.getEmptyData();

      // Test ID format
      expect(result.id).toMatch(/\d+DialogCheckbox$/);

      // Test default values
      expect(result).toEqual(
        expect.objectContaining({
          viewType: 'DialogCheckbox',
          title: '',
          fieldName: '',
          family: '',
          isSummary: false,
          isMandatory: false,
          isEnabled: true,
          isEnrollment: true,
          visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
          condition: [],
          hint: '',
          errorMessage: '',
          isNotDefault: true,
          minLength: undefined,
          maxLength: undefined
        })
      );
    });
  });

  describe('customizableFieldMeta', () => {
    it('should have the correct structure', () => {
      expect(DIALOG_CHECKBOX_CONFIG.customizableFieldMeta).toEqual({
        visibility: {},
        isEnabled: {},
        isEnrollment: {},
        isMandatory: {},
        maxLength: {},
        minLength: {},
        errorMessage: {},
        title: {},
        condition: {},
        fieldName: {}
      });
    });
  });

  describe('getJSON', () => {
    it('should handle fieldName with label property', () => {
      const input = {
        fieldName: { label: 'testField' },
        condition: ['condition1', null, 'condition2']
      };

      const result: any = DIALOG_CHECKBOX_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('testField');
      expect(result.condition).toEqual(['condition1', 'condition2']);
    });

    it('should handle fieldName without label property', () => {
      const input = {
        fieldName: 'directField',
        condition: ['condition1']
      };

      const result: any = DIALOG_CHECKBOX_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('directField');
    });

    it('should convert minValue and maxValue to numbers', () => {
      const input = {
        minValue: '10',
        maxValue: '20'
      };

      const result: any = DIALOG_CHECKBOX_CONFIG.getJSON?.(input);

      expect(result.minValue).toBe(10);
      expect(result.maxValue).toBe(20);
    });

    it('should filter out falsy conditions', () => {
      const input = {
        condition: [null, undefined, false, 'valid', 0, '']
      };

      const result: any = DIALOG_CHECKBOX_CONFIG.getJSON?.(input);

      expect(result.condition).toEqual(['valid']);
    });

    it('should handle empty input', () => {
      const input = {};

      const result: any = DIALOG_CHECKBOX_CONFIG.getJSON?.(input);

      expect(result).toEqual({});
    });
  });
});
