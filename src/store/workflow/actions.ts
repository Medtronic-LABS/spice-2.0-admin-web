import * as WORKFLOW_TYPES from './actionTypes';
import {
  IFetchFormMetaRequest,
  IFetchFormMetaSuccess,
  IFetchFormMetaFailure,
  ICustomizeFormRequest,
  ICustomizeFormSuccess,
  ICustomizeFormFailure,
  IClearFormMeta,
  FormType,
  IFetchCustomizationFormRequest,
  IFetchCustomizationFormSuccess,
  IFetchCustomizationFormFailure,
  IClearFormJSON,
  IFetchConsentFormSuccess,
  IFetchConsentFormFailure,
  IDeactivateConsentRequest,
  IDeactivateConsentSuccess,
  IDeactivateConsentFailure,
  IFetchClinicalWorkflowReq,
  IFetchClinicalWorkflowReqPayload,
  IClinicalWorkflow,
  ICreateWorkflowModule,
  ICreateWorkflowModuleSuccess,
  ICreateWorkflowModuleFail,
  IUpdateWorkflowModule,
  IUpdateWorkflowModuleSuccess,
  IUpdateWorkflowModuleFail,
  IDeleteWorkflowModule,
  IDeleteWorkflowModuleSuccess,
  IDeleteWorkflowModuleFail,
  IFetchClinicalWorkflowFailure,
  IFetchClinicalWorkflowSuccess
} from './types';

export const fetchCustomizationFormRequest = ({
  tenantId,
  countryId,
  districtId,
  formType,
  category,
  cultureId,
  clinicalWorkflowId,
  successCb,
  failureCb
}: Omit<IFetchCustomizationFormRequest, 'type'>): IFetchCustomizationFormRequest => ({
  type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST,
  tenantId,
  countryId,
  districtId,
  formType,
  category,
  cultureId,
  clinicalWorkflowId,
  successCb,
  failureCb
});

export const fetchClinicalWorkflowSuccess = (payload: {
  data: IClinicalWorkflow[];
  total: number;
}): IFetchClinicalWorkflowSuccess => ({
  type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS,
  payload
});

export const fetchClinicalWorkflowFailure = (): IFetchClinicalWorkflowFailure => ({
  type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_FAILURE
});

export const fetchClinicalWorkflow = (data: IFetchClinicalWorkflowReqPayload): IFetchClinicalWorkflowReq => ({
  type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST,
  data
});

export const fetchCustomizationFormSuccess = ({
  payload
}: Omit<IFetchCustomizationFormSuccess, 'type'>): IFetchCustomizationFormSuccess => ({
  type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_SUCCESS,
  payload
});

export const fetchCustomizationFormFailure = (error: any): IFetchCustomizationFormFailure => ({
  type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_FAILURE,
  error
});

export const fetchConsentFormSuccess = ({
  payload
}: Omit<IFetchConsentFormSuccess, 'type'>): IFetchConsentFormSuccess => ({
  type: WORKFLOW_TYPES.FETCH_CONSENT_FORM_SUCCESS,
  payload
});

export const fetchConsentFormFailure = (error: any): IFetchConsentFormFailure => ({
  type: WORKFLOW_TYPES.FETCH_CONSENT_FORM_FAILURE,
  error
});

export const fetchFormMetaRequest = ({
  formType,
  successCb,
  failureCb
}: Omit<IFetchFormMetaRequest, 'type'>): IFetchFormMetaRequest => ({
  type: WORKFLOW_TYPES.FETCH_FORM_META_REQUEST,
  formType,
  successCb,
  failureCb
});

export const fetchFormMetaSuccess = ({
  formType,
  payload
}: Omit<IFetchFormMetaSuccess, 'type'>): IFetchFormMetaSuccess => ({
  type: WORKFLOW_TYPES.FETCH_FORM_META_SUCCESS,
  payload,
  formType
});

export const fetchFormMetaFailure = (): IFetchFormMetaFailure => ({
  type: WORKFLOW_TYPES.FETCH_FORM_META_FAILURE
});

export const clearFormMeta = (formType: FormType): IClearFormMeta => ({
  type: WORKFLOW_TYPES.CLEAR_FORM_META,
  formType
});

export const clearFormJSON = (): IClearFormJSON => ({
  type: WORKFLOW_TYPES.CLEAR_FORM_JSON
});

export const customizeFormRequest = ({
  formType,
  formId,
  category,
  payload,
  tenantId,
  countryId,
  districtId,
  workflowId,
  cultureId,
  clinicalWorkflowId,
  successCb,
  failureCb
}: Omit<ICustomizeFormRequest, 'type'>): ICustomizeFormRequest => ({
  type: WORKFLOW_TYPES.CUSTOMIZE_FORM_REQUEST,
  payload,
  tenantId,
  countryId,
  formType,
  formId,
  category,
  districtId,
  workflowId,
  cultureId,
  clinicalWorkflowId,
  successCb,
  failureCb
});

export const customizeFormSuccess = (): ICustomizeFormSuccess => ({
  type: WORKFLOW_TYPES.CUSTOMIZE_FORM_SUCCESS
});

export const customizeFormFailure = (): ICustomizeFormFailure => ({
  type: WORKFLOW_TYPES.CUSTOMIZE_FORM_FAILURE
});

export const deactivateConsentRequest = ({
  formType,
  formId,
  category,
  tenantId,
  successCb,
  failureCb
}: Omit<IDeactivateConsentRequest, 'type'>): IDeactivateConsentRequest => ({
  type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_REQUEST,
  tenantId,
  formType,
  formId,
  category,
  successCb,
  failureCb
});

export const deactivateConsentSuccess = (): IDeactivateConsentSuccess => ({
  type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_SUCCESS
});

export const deactivateConsentFailure = (): IDeactivateConsentFailure => ({
  type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_FAILURE
});

export const clearConsentForm = () => ({
  type: WORKFLOW_TYPES.CLEAR_CONSENT_FORM
});

export const createWorkflowModule = ({
  data,
  successCb,
  failureCb
}: Omit<ICreateWorkflowModule, 'type'>): ICreateWorkflowModule => ({
  type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_REQUEST,
  data,
  successCb,
  failureCb
});

export const createWorkflowModuleSuccess = (): ICreateWorkflowModuleSuccess => ({
  type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_SUCCESS
});

export const createWorkflowModuleFailure = (error: Error): ICreateWorkflowModuleFail => ({
  type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_FAILURE,
  error
});

export const updateWorkflowModule = ({
  data,
  successCb,
  failureCb
}: Omit<IUpdateWorkflowModule, 'type'>): IUpdateWorkflowModule => ({
  type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateWorkflowModuleSuccess = (): IUpdateWorkflowModuleSuccess => ({
  type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_SUCCESS
});

export const updateWorkflowModuleFailure = (error: Error): IUpdateWorkflowModuleFail => ({
  type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_FAILURE,
  error
});

export const deleteWorkflowModule = ({
  data,
  successCb,
  failureCb
}: Omit<IDeleteWorkflowModule, 'type'>): IDeleteWorkflowModule => ({
  type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteWorkflowModuleSuccess = (): IDeleteWorkflowModuleSuccess => ({
  type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_SUCCESS
});

export const deleteWorkflowModuleFailure = (error: Error): IDeleteWorkflowModuleFail => ({
  type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_FAILURE,
  error
});

export const resetClinicalWorkflow = () => ({
  type: WORKFLOW_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST
});
