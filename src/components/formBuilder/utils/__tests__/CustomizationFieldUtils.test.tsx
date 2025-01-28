import {
  creatableViews,
  unitMeasurementFields,
  isEditableFields,
  getConfigByViewType,
  inputTypesSwitch
} from '../CustomizationFieldUtils';
import { InputTypes } from '../../customizationConfig/BaseFieldConfig';
import BP_CONFIG from '../../customizationConfig/fieldGroups/creatableViews/BPInput';
import EDIT_TEXT_CONFIG from '../../customizationConfig/fieldGroups/creatableViews/EditText';

describe('CustomizationFieldUtils', () => {
  describe('creatableViews', () => {
    it('should contain all expected view types', () => {
      expect(creatableViews).toEqual([
        { label: 'Radio Input', value: 'RadioGroup' },
        { label: 'Text Input', value: 'EditText' },
        { label: 'Select Input', value: 'Spinner' },
        { label: 'Slider', value: 'ScaleIndicator' },
        { label: 'Multi Select Input', value: 'CheckBox' },
        { label: 'Single Selection', value: 'SingleSelectionView' },
        { label: 'Instructions', value: 'Instruction' }
      ]);
    });
  });

  describe('unitMeasurementFields', () => {
    it('should contain expected measurement fields', () => {
      expect(unitMeasurementFields).toEqual(['glucose', 'hba1c']);
    });
  });

  describe('isEditableFields', () => {
    it('should contain all expected editable fields', () => {
      expect(isEditableFields).toContain('firstName');
      expect(isEditableFields).toContain('phoneNumber');
      expect(isEditableFields).toContain('otherInsurance');
      expect(isEditableFields.length).toBe(11);
    });
  });

  describe('getConfigByViewType', () => {
    it('should return BP_CONFIG for BP view type', () => {
      expect(getConfigByViewType('BP')).toBe(BP_CONFIG);
    });

    it('should return default EDIT_TEXT_CONFIG for unknown view type', () => {
      expect(getConfigByViewType('UnknownType')).toBe(EDIT_TEXT_CONFIG);
    });

    // Test all other view types
    const viewTypes = [
      'RadioGroup',
      'SingleSelectionView',
      'Age',
      'Height',
      'TimeView',
      'EditText',
      'Spinner',
      'CollapsibleView',
      'CheckBox',
      'DialogCheckbox',
      'ScaleIndicator',
      'Instruction',
      'MentalHealthView',
      'TextLabel',
      'InformationLabel',
      'DatePicker',
      'CardView'
    ];

    viewTypes.forEach((viewType) => {
      it(`should return correct config for ${viewType}`, () => {
        const config = getConfigByViewType(viewType);
        expect(config).toBeDefined();
      });
    });
  });

  describe('inputTypesSwitch', () => {
    it('should set number-related fields for NUMBER input type', () => {
      const obj = {};
      inputTypesSwitch(InputTypes.NUMBER, obj);
      expect(obj).toEqual({
        minValue: null,
        maxValue: null
      });
    });

    it('should set number-related fields for DECIMAL input type', () => {
      const obj = {};
      inputTypesSwitch(InputTypes.DECIMAL, obj);
      expect(obj).toEqual({
        minValue: null,
        maxValue: null
      });
    });

    it('should set phone-related fields for PHONE_NUMBER input type', () => {
      const obj = {};
      inputTypesSwitch(InputTypes.PHONE_NUMBER, obj);
      expect(obj).toEqual({
        contentLength: null,
        startsWith: null
      });
    });

    it('should set default fields for DEFAULT input type', () => {
      const obj = {};
      inputTypesSwitch(InputTypes.DEFAULT, obj);
      expect(obj).toEqual({
        minLength: null,
        maxLength: null
      });
    });

    it('should remove irrelevant fields when switching input types', () => {
      const obj = {
        minValue: 1,
        maxValue: 10,
        contentLength: 8,
        startsWith: '0',
        minLength: 3,
        maxLength: 10
      };
      inputTypesSwitch(InputTypes.NUMBER, obj);
      expect(obj).toEqual({
        minValue: null,
        maxValue: null
      });
    });
  });
});
