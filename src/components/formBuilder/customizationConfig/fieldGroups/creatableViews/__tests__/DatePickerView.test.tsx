import DATE_PICKER_CONFIG from '../DatePickerView';
import APPCONSTANTS from '../../../../../../constants/appConstants';

describe('DatePickerView', () => {
  describe('getEmptyData', () => {
    it('should return default empty data structure with correct properties', () => {
      const result: any = DATE_PICKER_CONFIG.getEmptyData();

      // Test all default properties
      expect(result.viewType).toBe('DatePicker');
      expect(result.title).toBe('');
      expect(result.fieldName).toBe('');
      expect(result.family).toBe('');
      expect(result.isSummary).toBe(false);
      expect(result.isMandatory).toBe(false);
      expect(result.isEnabled).toBe(true);
      expect(result.startDate).toBe('');
      expect(result.endDate).toBe('');
      expect(result.visibility).toBe(APPCONSTANTS.VALIDITY_OPTIONS.visible.key);
      expect(result.isNotDefault).toBe(true);

      // Test ID format
      expect(result.id).toMatch(/^\d+DatePicker$/);
    });
  });

  describe('customizableFieldMeta', () => {
    it('should have all required field definitions', () => {
      const meta = DATE_PICKER_CONFIG.customizableFieldMeta;

      // Verify all expected fields exist
      expect(meta).toHaveProperty('title');
      expect(meta).toHaveProperty('fieldName');
      expect(meta).toHaveProperty('isMandatory');
      expect(meta).toHaveProperty('isEnabled');
      expect(meta).toHaveProperty('visibility');
      expect(meta).toHaveProperty('startDate');
      expect(meta).toHaveProperty('endDate');
    });
  });

  describe('getJSON', () => {
    it('should handle json with label properties', () => {
      const input = {
        fieldName: { label: 'testField' },
        startDate: { label: 'testDate' },
        otherProp: 'value'
      };

      const result: any = DATE_PICKER_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('testField');
      expect(result.startDate).toBe('testDate');
      expect(result.otherProp).toBe('value');
    });

    it('should handle json without label properties', () => {
      const input = {
        fieldName: 'directField',
        startDate: 'directDate',
        otherProp: 'value'
      };

      const result: any = DATE_PICKER_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('directField');
      expect(result.startDate).toBe('directDate');
      expect(result.otherProp).toBe('value');
    });

    it('should handle json with mixed properties', () => {
      const input = {
        fieldName: { label: 'testField' },
        startDate: 'directDate',
        otherProp: 'value'
      };

      const result: any = DATE_PICKER_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('testField');
      expect(result.startDate).toBe('directDate');
      expect(result.otherProp).toBe('value');
    });
  });
});
