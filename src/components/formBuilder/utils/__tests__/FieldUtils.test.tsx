import { getConfigByViewType, resultSwitch, filterUnitsandGender, creatableViews } from '../FieldUtils';
import { InputTypes } from '../../labTestConfig/BaseFieldConfig';
import RADIO_GROUP_CONFIG from '../../labTestConfig/fieldGroups/creatableViews/RadioGroup';
import EDIT_TEXT_CONFIG from '../../labTestConfig/fieldGroups/creatableViews/EditText';
import DROPDOWN_CONFIG from '../../labTestConfig/fieldGroups/creatableViews/Dropdown';
import CHECKBOX_CONFIG from '../../labTestConfig/fieldGroups/creatableViews/CheckBox';
import TEXT_LABEL_CONFIG from '../../labTestConfig/fieldGroups/TextLabel';
import DATE_PICKER_CONFIG from '../../labTestConfig/fieldGroups/creatableViews/DatePickerView';
import CARD_VIEW_CONFIG from '../../labTestConfig/fieldGroups/CardView';

describe('FieldUtils', () => {
  describe('creatableViews', () => {
    it('should contain correct view options', () => {
      expect(creatableViews).toEqual([
        { label: 'Text', value: 'EditText' },
        { label: 'Dropdown', value: 'Spinner' }
      ]);
    });
  });

  describe('getConfigByViewType', () => {
    it('should return correct config for each view type', () => {
      expect(getConfigByViewType('RadioGroup')).toBe(RADIO_GROUP_CONFIG);
      expect(getConfigByViewType('EditText')).toBe(EDIT_TEXT_CONFIG);
      expect(getConfigByViewType('Spinner')).toBe(DROPDOWN_CONFIG);
      expect(getConfigByViewType('CheckBox')).toBe(CHECKBOX_CONFIG);
      expect(getConfigByViewType('TextLabel')).toBe(TEXT_LABEL_CONFIG);
      expect(getConfigByViewType('DatePicker')).toBe(DATE_PICKER_CONFIG);
      expect(getConfigByViewType('CardView')).toBe(CARD_VIEW_CONFIG);
      expect(getConfigByViewType('InvalidType')).toBe(EDIT_TEXT_CONFIG);
    });
  });

  describe('resultSwitch', () => {
    let testObj: any;

    beforeEach(() => {
      testObj = {
        code: 'test',
        url: 'test',
        resource: 'test',
        condition: 'test',
        minValue: 'test',
        maxValue: 'test',
        maxLength: 'test',
        minLength: 'test',
        contentLength: 'test',
        startsWith: 'test',
        unitList: 'test',
        ranges: 'test'
      };
    });

    it('should handle NUMBER input type with isResult=true', () => {
      resultSwitch(InputTypes.NUMBER, testObj);
      expect(testObj).toHaveProperty('minValue');
      expect(testObj).toHaveProperty('maxValue');
      expect(testObj).toHaveProperty('unitList');
      expect(testObj).toHaveProperty('ranges');
      expect(testObj).toHaveProperty('code');
      expect(testObj).toHaveProperty('url');
      expect(testObj).toHaveProperty('resource');
      expect(testObj).toHaveProperty('condition');
      expect(testObj).not.toHaveProperty('maxLength');
      expect(testObj).not.toHaveProperty('minLength');
    });

    it('should handle PHONE_NUMBER input type', () => {
      resultSwitch(InputTypes.PHONE_NUMBER, testObj, true);
      expect(testObj).toHaveProperty('contentLength');
      expect(testObj).toHaveProperty('startsWith');
      expect(testObj).toHaveProperty('unitList');
      expect(testObj).toHaveProperty('ranges');
    });

    it('should handle DEFAULT input type', () => {
      resultSwitch(InputTypes.DEFAULT, testObj, true);
      expect(testObj).toHaveProperty('minLength');
      expect(testObj).toHaveProperty('maxLength');
      expect(testObj).not.toHaveProperty('unitList');
      expect(testObj).not.toHaveProperty('ranges');
    });

    it('should handle null field value', () => {
      resultSwitch(null, testObj, true);
      expect(testObj).toHaveProperty('code');
      expect(testObj).toHaveProperty('url');
      expect(testObj).toHaveProperty('resource');
      expect(testObj).toHaveProperty('condition');
    });

    it('should handle null field value and isResult as false', () => {
      resultSwitch(null, testObj, false);
      expect(testObj).not.toHaveProperty('code');
      expect(testObj).not.toHaveProperty('url');
      expect(testObj).not.toHaveProperty('resource');
      expect(testObj).not.toHaveProperty('condition');
    });

    it('should handle isResult=false', () => {
      resultSwitch(InputTypes.NUMBER, testObj, false);
      expect(testObj).not.toHaveProperty('code');
      expect(testObj).not.toHaveProperty('url');
      expect(testObj).not.toHaveProperty('resource');
      expect(testObj).not.toHaveProperty('condition');
      expect(testObj).toHaveProperty('minValue');
      expect(testObj).toHaveProperty('maxValue');
    });
  });

  describe('filterUnitsandGender', () => {
    const unitList = [
      { name: 'Unit1', id: 'unit1' },
      { name: 'Unit2', id: 'unit2' },
      { name: 'Unit3', id: 'unit3' }
    ];

    it('should filter units with both genders', () => {
      const ranges = [
        { unitType: 'unit1', gender: 'Male', minRange: 0, maxRange: 10, displayRange: '0-10' },
        { unitType: 'unit1', gender: 'Female', minRange: 0, maxRange: 10, displayRange: '0-10' }
      ];

      const { filteredUnitList, removedUnits } = filterUnitsandGender(ranges, unitList);

      expect(filteredUnitList).toHaveLength(2);
      expect(removedUnits.units).toHaveLength(1);
      expect(removedUnits.indices).toContain(0);
      /* tslint:disable:no-string-literal */
      expect(removedUnits.genders['unit1']).toHaveLength(2);
    });

    it('should handle empty ranges', () => {
      const { filteredUnitList, removedUnits } = filterUnitsandGender([], unitList);

      expect(filteredUnitList).toEqual(unitList);
      expect(removedUnits.units).toHaveLength(0);
      expect(removedUnits.indices).toHaveLength(0);
      expect(Object.keys(removedUnits.genders)).toHaveLength(0);
    });

    it('should handle single gender range', () => {
      const ranges = [{ unitType: 'unit1', gender: 'Male', minRange: 0, maxRange: 10, displayRange: '0-10' }];

      const { filteredUnitList, removedUnits } = filterUnitsandGender(ranges, unitList);

      expect(filteredUnitList).toHaveLength(2);
      expect(removedUnits.indices).toContain(0);
      expect(removedUnits.genders['unit1']).toHaveLength(1);
    });

    it('should handle null inputs', () => {
      const { filteredUnitList, removedUnits } = filterUnitsandGender(null as any, null as any);

      expect(filteredUnitList).toHaveLength(0);
      expect(removedUnits.units).toHaveLength(0);
      expect(removedUnits.indices).toHaveLength(0);
      expect(Object.keys(removedUnits.genders)).toHaveLength(0);
    });
  });
});
