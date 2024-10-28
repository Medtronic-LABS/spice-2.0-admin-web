import { formMetaSelector, formJSONSelector, consentFormSelector, loadingSelector } from '../selectors';

const initialState: any = {
  workflow: {
    formJSON: '{key:value}',
    consentForm: 'data',
    formMeta: 'data',
    loading: true,
    loadingMeta: true
  }
};

test('formMetaSelector should return formJSONSelector from state', () => {
    return expect(formJSONSelector(initialState)).toEqual(initialState.workflow.formJSON);
  });

  test('formMetaSelector should return state', () => {
    return expect(formMetaSelector(initialState)).toEqual(initialState.workflow.formMeta);
  });

  test('consentFormSelector should return  state', () => {
    return expect(consentFormSelector(initialState)).toEqual(initialState.workflow.consentForm);
  });

  test('loadingSelector should return  state', () => {
    return expect(loadingSelector(initialState)).toEqual(initialState.workflow.loading);
  });
