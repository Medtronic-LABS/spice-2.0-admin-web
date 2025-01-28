import MENTAL_HEALTH_CONFIG from '../MentalHealthView';
import APPCONSTANTS from '../../../../../constants/appConstants';

describe('MENTAL_HEALTH_CONFIG', () => {
  describe('getEmptyData', () => {
    it('should return default mental health view fields', () => {
      const result = MENTAL_HEALTH_CONFIG.getEmptyData();

      // Test ID format
      expect(result.id).toMatch(/\d+MentalHealthView$/);

      // Test all default values
      expect(result).toMatchObject({
        viewType: 'MentalHealthView',
        title: 'Title',
        fieldName: 'Field name',
        family: 'phq4',
        visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
        isMandatory: undefined,
        isEnabled: undefined,
        isEnrollment: true,
        localDataCache: 'PHQ4',
        isNotDefault: false
      });
    });
  });

  describe('customizableFieldMeta', () => {
    it('should have the correct structure', () => {
      expect(MENTAL_HEALTH_CONFIG.customizableFieldMeta).toEqual({
        isMandatory: {},
        title: {},
        fieldName: {},
        visibility: {},
        isEnabled: {},
        isEnrollment: {},
        isEditable: {},
        unitMeasurement: {}
      });
    });
  });

  describe('getJSON', () => {
    it('should handle json with fieldName as an object with label', () => {
      const input = {
        fieldName: { label: 'Test Field' },
        otherProp: 'value'
      };

      const result = MENTAL_HEALTH_CONFIG.getJSON?.(input);

      expect(result).toEqual({
        fieldName: 'Test Field',
        otherProp: 'value'
      });
    });

    it('should handle json with fieldName as a string', () => {
      const input = {
        fieldName: 'Test Field',
        otherProp: 'value'
      };

      const result = MENTAL_HEALTH_CONFIG.getJSON?.(input);

      expect(result).toEqual({
        fieldName: 'Test Field',
        otherProp: 'value'
      });
    });

    it('should handle json without fieldName', () => {
      const input = {
        otherProp: 'value'
      };

      const result = MENTAL_HEALTH_CONFIG.getJSON?.(input);

      expect(result).toEqual({
        otherProp: 'value'
      });
    });
  });
});
