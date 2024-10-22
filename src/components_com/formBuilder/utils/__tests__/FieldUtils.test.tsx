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
      const expectedLabels = ['Text', 'Dropdown', 'Date'];
      expect(creatableViews.map((view: any) => view.label)).toEqual(expectedLabels);
    });

    it('should have the correct values', () => {
      const expectedValues = ['EditText', 'Spinner', 'DatePicker'];
      expect(creatableViews.map((view: any) => view.value)).toEqual(expectedValues);
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
    resultSwitch(InputTypes.DEFAULT, obj, false);
    expect(obj).toEqual({ minLength: 10, maxLength: 20 });
  });

  it('should correctly set inputTypeRelatedFields for InputTypes.NUMBER', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2 };
    resultSwitch(InputTypes.NUMBER, obj, false);
    expect(obj).toEqual({ minValue: 1, maxValue: 2 });
  });

  it('should correctly set inputTypeRelatedFields for InputTypes.DECIMAL', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2 };
    resultSwitch(InputTypes.DECIMAL, obj, false);
    expect(obj).toEqual({ minValue: 1, maxValue: 2 });
  });

  it('should correctly set inputTypeRelatedFields for InputTypes.PHONE_NUMBER', () => {
    const obj = { minLength: 10, maxLength: 20, contentLength: 30, minValue: 1, maxValue: 2, startsWith: '123' };
    resultSwitch(InputTypes.PHONE_NUMBER, obj, false);
    expect(obj).toEqual({ contentLength: 30, startsWith: '123' });
  });
});
