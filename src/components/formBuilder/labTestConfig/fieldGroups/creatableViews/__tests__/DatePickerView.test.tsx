import DATE_PICKER_CONFIG from '../DatePickerView';
import APPCONSTANTS from '../../../../../../constants/appConstants';

describe('DatePickerView Configuration', () => {
  describe('getEmptyData', () => {
    it('should return default empty data structure', () => {
      const result = DATE_PICKER_CONFIG.getEmptyData();

      expect(result.id).toMatch(/\d+DatePicker$/);

      expect(result).toEqual(
        expect.objectContaining({
          viewType: 'DatePicker',
          title: '',
          fieldName: '',
          family: '',
          isMandatory: false,
          isEnabled: true,
          visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
          isDefault: false,
          disableFutureDate: false,
          minDays: null,
          maxDays: null
        })
      );
    });
  });

  describe('customizableFieldMeta', () => {
    it('should have the correct customizable fields', () => {
      expect(DATE_PICKER_CONFIG.customizableFieldMeta).toEqual({
        title: {},
        fieldName: {},
        isMandatory: {},
        disableFutureDate: {},
        minDays: {},
        maxDays: {}
      });
    });
  });

  describe('getJSON', () => {
    it('should handle json with fieldName as an object with label', () => {
      const input = {
        fieldName: { label: 'testField' },
        otherProp: 'value'
      };

      const result: any = DATE_PICKER_CONFIG.getJSON?.(input);

      expect(result).toEqual({
        fieldName: 'testField',
        otherProp: 'value'
      });
    });

    it('should handle json with fieldName as a string', () => {
      const input = {
        fieldName: 'testField',
        otherProp: 'value'
      };

      const result: any = DATE_PICKER_CONFIG.getJSON?.(input);

      expect(result).toEqual({
        fieldName: 'testField',
        otherProp: 'value'
      });
    });

    it('should handle json with undefined fieldName', () => {
      const input = {
        otherProp: 'value'
      };

      const result: any = DATE_PICKER_CONFIG.getJSON?.(input);

      expect(result).toEqual({
        fieldName: undefined,
        otherProp: 'value'
      });
    });
  });
});
