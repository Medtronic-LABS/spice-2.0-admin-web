import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getClinicalWorkflows = (state: AppState) => state.workflow.clinicalWorkflows;
const getClinicalWorkflowsCount = (state: AppState) => state.workflow.clinicalWorkflowsCount;
const formMetaSelector = (state: AppState) => state.workflow.formMeta;

export const formJSONSelector = (state: AppState) => state.workflow.formJSON;
export const consentFormSelector = (state: AppState) => state.workflow.consentForm;
export const loadingSelector = (state: AppState) => state.workflow.loading;
export const workflowLoadingSelector = createSelector(loadingSelector, (loading) => loading);
export const getClinicalWorkflowsCountSelector = createSelector(getClinicalWorkflowsCount, (workflows) => workflows);
export const getClinicalWorkflowSelector = createSelector(getClinicalWorkflows, (workflows) => workflows);
export const getFormMetaSelector = createSelector(formMetaSelector, (formMeta) => formMeta);
