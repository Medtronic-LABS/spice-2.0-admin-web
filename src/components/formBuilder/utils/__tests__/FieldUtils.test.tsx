import { InputTypes } from '../../config/BaseFieldConfig';
import CARD_VIEW_CONFIG from '../../config/fieldGroups/CardView';
import TEXT_LABEL_CONFIG from '../../config/fieldGroups/TextLabel';
import CHECKBOX_CONFIG from '../../config/fieldGroups/creatableViews/CheckBox';
import EDIT_TEXT_CONFIG from '../../config/fieldGroups/creatableViews/EditText';
import RADIO_GROUP_CONFIG from '../../config/fieldGroups/creatableViews/RadioGroup';
import DROPDOWN_CONFIG from '../../config/fieldGroups/creatableViews/Dropdown';
import { creatableViews, getConfigByViewType, resultSwitch } from '../FieldUtils';
import DATE_PICKER_CONFIG from '../../config/fieldGroups/creatableViews/DatePickerView';

describe('Your Module', () => {
  describe('creatableViews', () => {
    it('should have the correct labels', () => {
      const expectedLabels = [
        'BP Input',
        'Radio Input',
        'Age Input',
        'Height Input',
        'Time View',
        'Text Input',
        'Select Input',
        'Slider',
        'Multi Select Input',
        'Instructions',
        'Information Label',
        'Date Input'
      ];
      expect(creatableViews.map((view: any) => view.label)).toEqual(expectedLabels);
    });

    it('should have the correct values', () => {
      const expectedValues = [
        'BP',
        'RadioGroup',
        'Age',
        'Height',
        'TimeView',
        'EditText',
        'Spinner',
        'ScaleIndicator',
        'CheckBox',
        'Instruction',
        'InformationLabel',
        'DatePicker'
      ];
      expect(creatableViews.map((view: any) => view.value)).toEqual(expectedValues);
    });

    it('should have the correct account customization flags', () => {
      const expectedFlags = [false, true, false, false, false, true, true, true, true, true, false, true];
      expect(
        creatableViews.map((view: any) => {
          return view.isAccountCustomizable;
        })
      ).toEqual(expectedFlags);
    });
  });

  describe('getConfigByViewType', () => {
    it('should return the correct config for RadioGroup', () => {
      expect(getConfigByViewType('RadioGroup')).toEqual(RADIO_GROUP_CONFIG);
    });

    it('should return the correct config for Date Input', () => {
      expect(getConfigByViewType('DatePicker')).toEqual(DATE_PICKER_CONFIG);
    });

    it('should return the correct config for EditText', () => {
      expect(getConfigByViewType('EditText')).toEqual(EDIT_TEXT_CONFIG);
    });

    it('should return the correct config for Spinner', () => {
      expect(getConfigByViewType('Spinner')).toEqual(DROPDOWN_CONFIG);
    });

    it('should return the correct config for CheckBox', () => {
      expect(getConfigByViewType('CheckBox')).toEqual(CHECKBOX_CONFIG);
    });

    it('should return the correct config for TextLabel', () => {
      expect(getConfigByViewType('TextLabel')).toEqual(TEXT_LABEL_CONFIG);
    });

    it('should return the correct config for CardView', () => {
      expect(getConfigByViewType('CardView')).toEqual(CARD_VIEW_CONFIG);
    });

    it('should return the default config for an unknown view type', () => {
      expect(getConfigByViewType('UnknownType')).toEqual(EDIT_TEXT_CONFIG);
    });
  });
});

describe('resultSwitch', () => {
  it('should correctly set inputTypeRelatedFields for InputTypes.DEFAULT', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2 };
    resultSwitch(InputTypes.DEFAULT, obj);
    expect(obj).toEqual({ minLength: null, maxLength: null });
  });

  it('should correctly set inputTypeRelatedFields for InputTypes.NUMBER', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2 };
    resultSwitch(InputTypes.NUMBER, obj);
    expect(obj).toEqual({ minValue: null, maxValue: null });
  });

  it('should correctly set inputTypeRelatedFields for InputTypes.DECIMAL', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2 };
    resultSwitch(InputTypes.DECIMAL, obj);
    expect(obj).toEqual({ minValue: null, maxValue: null });
  });

  it('should correctly set inputTypeRelatedFields for InputTypes.PHONE_NUMBER', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2 };
    resultSwitch(InputTypes.PHONE_NUMBER, obj);
    expect(obj).toEqual({ contentLength: null, startsWith: null });
  });
});
