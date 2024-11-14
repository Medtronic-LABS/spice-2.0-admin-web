import APPCONSTANTS from '../../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../../types/BaseFieldMeta';
import { IFieldViewType } from '../../../../types/ComponentConfig';
import DROPDOWN_CONFIG from '../Dropdown';

describe('Spinner Container Test Cases', () => {
  it('should export an object with the expected properties', () => {
    expect(DROPDOWN_CONFIG).toEqual({
      getEmptyData: expect.any(Function),
      customizableFieldMeta: expect.any(Object),
      getJSON: expect.any(Function)
    });
  });

  describe('getEmptyData', () => {
    it('should return an object with the expected properties', () => {
      const emptyData: any = DROPDOWN_CONFIG.getEmptyData();

      expect(emptyData).toEqual({
        id: expect.any(String),
        viewType: 'Spinner',
        title: '',
        fieldName: '',
        family: '',
        isMandatory: false,
        isEnabled: true,
        visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
        hint: '',
        optionsList: [],
        errorMessage: '',
        isDefault: false,
        isResult: true
      });
    });
  });

  describe('customizableFieldMeta', () => {
    it('should be an object with the expected properties', () => {
      const customizableFieldMeta: IBaseFieldMeta = DROPDOWN_CONFIG.customizableFieldMeta;

      expect(customizableFieldMeta).toEqual({
        isMandatory: {},
        title: {},
        fieldName: {},
        optionsList: {},
        isEditable: {},
        code: {},
        isResult: {},
        resource: {},
        url: {}
      });
    });
  });

  describe('getJSON', () => {
    it('should return the input object with the fieldName transformed if it has a label property', () => {
      const inputObject: any = {
        foo: 'bar',
        baz: 42,
        fieldName: { label: 'Spinner' },
        condition: ['new']
      };
      const expectedOutput: any = {
        foo: 'bar',
        baz: 42,
        fieldName: 'Spinner',
        condition: ['new']
      };
      if (DROPDOWN_CONFIG.getJSON) {
        const result: IFieldViewType = DROPDOWN_CONFIG.getJSON(inputObject);
        expect(result).toEqual(expectedOutput);
      } else {
        fail('getJSON is not defined');
      }
    });

    it('should return the input object with the fieldName unchanged if it does not have a label property', () => {
      const inputObject: any = {
        foo: 'bar',
        baz: 42,
        fieldName: 'Spinner',
        condition: ['new']
      };
      if (DROPDOWN_CONFIG.getJSON) {
        const result: IFieldViewType = DROPDOWN_CONFIG.getJSON(inputObject);
        expect(result).toBe(inputObject);
      } else {
        fail('getJSON is not defined');
      }
    });
  });
});
