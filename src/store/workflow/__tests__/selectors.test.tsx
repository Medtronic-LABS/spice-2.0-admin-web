import {
  formJSONSelector,
  consentFormSelector,
  loadingSelector,
  workflowLoadingSelector,
  getClinicalWorkflowsCountSelector,
  getClinicalWorkflowSelector,
  getFormMetaSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  workflow: mainInitialState
};

// Test formJSONSelector
test('formJSONSelector should return formJSON from state', () => {
  expect(formJSONSelector(initialState)).toEqual(initialState.workflow.formJSON);
});

// Test consentFormSelector
test('consentFormSelector should return consentForm from state', () => {
  expect(consentFormSelector(initialState)).toEqual(initialState.workflow.consentForm);
});

// Test loadingSelector
test('loadingSelector should return loading from state', () => {
  expect(loadingSelector(initialState)).toEqual(initialState.workflow.loading);
});

// Test workflowLoadingSelector
test('workflowLoadingSelector should return loading from state', () => {
  expect(workflowLoadingSelector(initialState)).toEqual(initialState.workflow.loading);
});

// Test getClinicalWorkflowsCountSelector
test('getClinicalWorkflowsCountSelector should return clinicalWorkflowsCount from state', () => {
  expect(getClinicalWorkflowsCountSelector(initialState)).toEqual(initialState.workflow.clinicalWorkflowsCount);
});

// Test getClinicalWorkflowSelector
test('getClinicalWorkflowSelector should return clinicalWorkflows from state', () => {
  expect(getClinicalWorkflowSelector(initialState)).toEqual(initialState.workflow.clinicalWorkflows);
});

// Test getFormMetaSelector
test('getFormMetaSelector should return formMeta from state', () => {
  expect(getFormMetaSelector(initialState)).toEqual(initialState.workflow.formMeta);
});
