import { AppState } from '../rootReducer';

export const formMetaSelector = (state: AppState) => state.workflowCom.formMeta;
export const formJSONSelector = (state: AppState) => state.workflowCom.formJSON;
export const consentFormSelector = (state: AppState) => state.workflowCom.consentForm;
export const loadingSelector = (state: AppState) => state.workflowCom.loading;
