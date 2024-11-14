import COLLAPSIBLE_VIEW_CONFIG from '../CollapsibleView';
import APPCONSTANTS from '../../../../../../constants/appConstants';

describe('COLLAPSIBLE_VIEW_CONFIG', () => {
  describe('getEmptyData', () => {
    it('should return default empty data structure', () => {
      const result = COLLAPSIBLE_VIEW_CONFIG.getEmptyData();

      expect(result.id).toMatch(/\d+CollapsibleView$/);

      expect(result).toEqual(
        expect.objectContaining({
          viewType: 'CollapsibleView',
          title: '',
          fieldName: '',
          family: '',
          isSummary: false,
          isMandatory: false,
          isEnabled: true,
          visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
          condition: [],
          hint: '',
          optionsList: [],
          targetViews: [],
          errorMessage: '',
          defaultValue: '',
          isNotDefault: true
        })
      );
    });
  });

  describe('customizableFieldMeta', () => {
    it('should have all required field metadata properties', () => {
      const expectedFields = [
        'visibility',
        'isEnabled',
        'isMandatory',
        'defaultValue',
        'title',
        'fieldName',
        'optionsList',
        'targetViews',
        'condition',
        'errorMessage',
        'isEditable',
        'unitMeasurement'
      ];

      expectedFields.forEach((field) => {
        expect(COLLAPSIBLE_VIEW_CONFIG.customizableFieldMeta).toHaveProperty(field);
      });
    });
  });

  describe('getJSON', () => {
    it('should handle json with fieldName as an object', () => {
      const input = {
        fieldName: { label: 'Test Field' },
        condition: ['condition1', '', 'condition2']
      };

      const result: any = COLLAPSIBLE_VIEW_CONFIG.getJSON?.(input);

      expect(result?.fieldName).toBe('Test Field');
      expect(result?.condition).toEqual(['condition1', 'condition2']);
    });

    it('should handle json with fieldName as a string', () => {
      const input = {
        fieldName: 'Test Field',
        condition: ['condition1', null, 'condition2']
      };

      const result: any = COLLAPSIBLE_VIEW_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('Test Field');
      expect(result.condition).toEqual(['condition1', 'condition2']);
    });

    it('should handle json without condition', () => {
      const input = {
        fieldName: 'Test Field'
      };

      const result: any = COLLAPSIBLE_VIEW_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('Test Field');
      expect(result.condition).toBeUndefined();
    });

    it('should filter out falsy conditions', () => {
      const input = {
        fieldName: 'Test Field',
        condition: [null, undefined, '', false, 0, 'validCondition']
      };

      const result: any = COLLAPSIBLE_VIEW_CONFIG.getJSON?.(input);

      expect(result.condition).toEqual(['validCondition']);
    });
  });
});
