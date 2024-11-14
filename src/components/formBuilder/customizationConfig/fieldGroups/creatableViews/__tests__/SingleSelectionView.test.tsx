import SINGLE_SELECTION_VIEW_CONFIG from '../SingleSelectionView';
import APPCONSTANTS from '../../../../../../constants/appConstants';

describe('SingleSelectionView Configuration', () => {
  describe('getEmptyData', () => {
    it('should return default empty data structure', () => {
      const result = SINGLE_SELECTION_VIEW_CONFIG.getEmptyData();

      expect(result).toEqual({
        id: expect.stringContaining('SingleSelectionView'),
        viewType: 'SingleSelectionView',
        title: '',
        fieldName: '',
        family: '',
        isSummary: false,
        isMandatory: false,
        isEnabled: true,
        isEnrollment: true,
        visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
        condition: [],
        optionsList: [],
        orientation: 0,
        errorMessage: '',
        isNotDefault: true
      });
    });

    it('should generate unique IDs for multiple calls', () => {
      const result1 = SINGLE_SELECTION_VIEW_CONFIG.getEmptyData();
      jest.advanceTimersByTime(1); // Advance the timer by 1ms
      const result2 = SINGLE_SELECTION_VIEW_CONFIG.getEmptyData();

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('customizableFieldMeta', () => {
    it('should have all required customizable fields', () => {
      expect(SINGLE_SELECTION_VIEW_CONFIG.customizableFieldMeta).toEqual({
        orientation: {},
        visibility: {},
        title: {},
        fieldName: {},
        isMandatory: {},
        optionsList: {},
        condition: {},
        errorMessage: {},
        isEnabled: {},
        isEditable: {},
        isEnrollment: {}
      });
    });
  });

  describe('getJSON', () => {
    it('should handle json with fieldName as an object', () => {
      const input = {
        fieldName: { label: 'testField' },
        condition: [null, 'condition1', false, 'condition2']
      };

      const result: any = SINGLE_SELECTION_VIEW_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('testField');
      expect(result.condition).toEqual(['condition1', 'condition2']);
    });

    it('should handle json with fieldName as a string', () => {
      const input = {
        fieldName: 'testField',
        condition: ['condition1']
      };

      const result: any = SINGLE_SELECTION_VIEW_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBe('testField');
      expect(result.condition).toEqual(['condition1']);
    });

    it('should handle json with empty/undefined values', () => {
      const input = {
        fieldName: undefined,
        condition: undefined
      };

      const result: any = SINGLE_SELECTION_VIEW_CONFIG.getJSON?.(input);

      expect(result.fieldName).toBeUndefined();
      expect(result.condition).toBeUndefined();
    });
  });
});
