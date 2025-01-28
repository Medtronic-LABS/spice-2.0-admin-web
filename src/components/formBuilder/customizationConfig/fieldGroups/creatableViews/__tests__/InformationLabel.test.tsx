import APPCONSTANTS from '../../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../../types/BaseFieldMeta';
import { IFieldViewType } from '../../../../types/CustomizationComponentConfig';
import INFORMATION_LABEL_CONFIG from '../InformationLabel';

describe('Information Label Test Cases', () => {
  it('should export an object with the expected properties', () => {
    expect(INFORMATION_LABEL_CONFIG).toEqual({
      getEmptyData: expect.any(Function),
      customizableFieldMeta: expect.any(Object),
      getJSON: expect.any(Function)
    });
  });

  describe('getEmptyData', () => {
    it('should return an object with the expected properties', () => {
      const emptyData: any = INFORMATION_LABEL_CONFIG.getEmptyData();

      expect(emptyData).toEqual({
        id: expect.any(String),
        viewType: 'InformationLabel',
        title: '',
        fieldName: '',
        family: '',
        isSummary: false,
        isMandatory: false,
        isEnabled: true,
        visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
        isNotDefault: true,
        isEnrollment: true
      });
    });
  });

  describe('customizableFieldMeta', () => {
    it('should be an object with the expected properties', () => {
      const customizableFieldMeta: IBaseFieldMeta = INFORMATION_LABEL_CONFIG.customizableFieldMeta;

      expect(customizableFieldMeta).toEqual({
        title: {},
        fieldName: {},
        isMandatory: {},
        isEnabled: {},
        visibility: {},
        isEnrollment: {}
      });
    });
  });

  describe('getJSON', () => {
    it('should return the input object with the fieldName transformed if it has a label property', () => {
      const inputObject: any = {
        foo: 'bar',
        baz: 42,
        fieldName: { label: 'InformationLabel' }
      };
      const expectedOutput: any = {
        foo: 'bar',
        baz: 42,
        fieldName: 'InformationLabel'
      };
      if (INFORMATION_LABEL_CONFIG.getJSON) {
        const result: IFieldViewType = INFORMATION_LABEL_CONFIG.getJSON(inputObject);
        expect(result).toEqual(expectedOutput);
      } else {
        fail('getJSON is not defined');
      }
    });

    it('should return the input object with the fieldName unchanged if it does not have a label property', () => {
      const inputObject: any = {
        foo: 'bar',
        baz: 42,
        fieldName: 'InformationLabel'
      };
      if (INFORMATION_LABEL_CONFIG.getJSON) {
        const result: IFieldViewType = INFORMATION_LABEL_CONFIG.getJSON(inputObject);
        expect(result).toBe(inputObject);
      } else {
        fail('getJSON is not defined');
      }
    });
  });
});
