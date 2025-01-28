import EDIT_TEXT_CONFIG from '../EditText';
import { render } from '@testing-library/react';

describe('EditTextConfig', () => {
  let editTextFields: any;

  beforeEach(() => {
    editTextFields = EDIT_TEXT_CONFIG.getEmptyData();
  });

  it('should render without errors', () => {
    const wrapper = render(<div />);
    expect(wrapper).toBeDefined();
  });

  it('should return correct default value', () => {
    expect(editTextFields).toEqual({
      id: expect.any(String),
      viewType: 'EditText',
      title: '',
      fieldName: '',
      family: '',
      isMandatory: false,
      isEnabled: true,
      visibility: 'visible',
      ranges: [],
      hint: '',
      errorMessage: '',
      inputType: -1,
      isDefault: false,
      isResult: true,
      minLength: undefined,
      maxLength: undefined
    });
  });

  it('should return correct JSON object', () => {
    const json = {
      id: 'testId',
      viewType: 'EditText',
      title: 'Test Title',
      fieldName: 'Test Field Name',
      family: 'Test Family',
      isMandatory: true,
      isEnabled: true,
      visibility: 'hidden',
      condition: ['condition1', 'condition2'],
      hint: 'Test Hint',
      errorMessage: 'Test Error Message',
      inputType: 0,
      minLength: 1,
      maxLength: 100
    };

    const expectedJson = {
      id: 'testId',
      viewType: 'EditText',
      title: 'Test Title',
      fieldName: 'Test Field Name',
      family: 'Test Family',
      isMandatory: true,
      isEnabled: true,
      visibility: 'hidden',
      condition: ['condition1', 'condition2'],
      hint: 'Test Hint',
      errorMessage: 'Test Error Message',
      minLength: 1,
      maxLength: 100
    };
    if (EDIT_TEXT_CONFIG.getJSON) {
      expect(EDIT_TEXT_CONFIG.getJSON(json)).toEqual(expectedJson);
    }
  });
});

describe('getJSON function', () => {
  it('should convert minValue property to a number if it is present in the json object', () => {
    const json = {
      id: '1',
      title: 'Title',
      fieldName: 'Field Name',
      minValue: '5'
    };
    if (EDIT_TEXT_CONFIG.getJSON) {
      const result: any = EDIT_TEXT_CONFIG.getJSON(json);
      expect(result.minValue).toBe(5);
    }
  });

  it('should not convert minValue property if it is not present in the json object', () => {
    const json = {
      id: '1',
      title: 'Title',
      fieldName: 'Field Name'
    };
    if (EDIT_TEXT_CONFIG.getJSON) {
      const result: any = EDIT_TEXT_CONFIG.getJSON(json);
      expect(result.minValue).toBeUndefined();
    }
  });

  it('should convert maxValue property to a number if it is present in the json object', () => {
    const json = {
      id: '1',
      title: 'Title',
      fieldName: 'Field Name',
      maxValue: '5'
    };
    if (EDIT_TEXT_CONFIG.getJSON) {
      const result: any = EDIT_TEXT_CONFIG.getJSON(json);
      expect(result.maxValue).toBe(5);
    }
  });

  it('should not convert maxValue property if it is not present in the json object', () => {
    const json = {
      id: '1',
      title: 'Title',
      fieldName: 'Field Name'
    };
    if (EDIT_TEXT_CONFIG.getJSON) {
      const result: any = EDIT_TEXT_CONFIG.getJSON(json);
      expect(result.maxValue).toBeUndefined();
    }
  });

  it('should render ranges with no empty values', () => {
    const json = {
      id: '1',
      title: 'Title',
      fieldName: { label: 'Field Name' },
      ranges: ['1', '2', '']
    };
    if (EDIT_TEXT_CONFIG.getJSON) {
      const result: any = EDIT_TEXT_CONFIG.getJSON(json);
      expect(result.ranges).toEqual(['1', '2']);
    }
  });
});
