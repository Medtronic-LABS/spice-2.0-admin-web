import { ITimezone } from '../user/types';
import * as ACTION_TYPES from './actionTypes';

export type FormLogType = 'screeninglog' | 'bplog' | 'glucoselog' | 'patient';
export type FormType = 'Screening' | 'Enrollment' | 'Assessment' | 'Module';

export interface IWorkflowModuleReqPayload {
  name?: string;
  viewScreens?: string[];
  countryId?: string;
  tenantId: string;
  id?: string | number;
  appTypes?: string[];
}
export interface ICreateWorkflowModule {
  type: typeof ACTION_TYPES.CREATE_WORKFLOW_MODULE_REQUEST;
  data: IWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface IUpdateWorkflowModule {
  type: typeof ACTION_TYPES.UPDATE_WORKFLOW_MODULE_REQUEST;
  data: IWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface IAdminEditFormValues {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  gender: string;
  countryCode: string;
  timezone: ITimezone;
  country: { countryCode?: string; id?: string };
  tenantId?: string;
}
export interface IAccountAdmin extends Omit<IAdminEditFormValues, 'timezone'> {
  timezone: string;
}
export interface IClinicalWorkflow {
  id: string | number;
  name: string;
  isActive?: boolean;
  default?: boolean;
  isDeleted?: boolean;
  coreType?: string;
  workflowId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  moduleType?: string;
  country?: string;
  tenantId?: string;
  viewScreens?: string[];
  workflow?: string;
  ncdWorkflow?: boolean;
  workflowName?: string;
}

export interface IAccount {
  id: string;
  users: IAccountAdmin[];
  name: string;
  maxNoOfUsers: string;
  tenantId: string;
  updatedAt?: string;
  clinicalWorkflow?: IClinicalWorkflow[] | string[];
  customizedWorkflow?: IClinicalWorkflow[] | string[];
  country?: {
    countryCode: string;
    tenantId?: string;
    id?: string;
  };
}

export interface IWorkflowState {
  formJSON: null | any;
  consentForm: null | any;
  formMeta: null | any;
  loading: boolean;
  loadingMeta: boolean;
  clinicalWorkflowsCount: number;
  clinicalWorkflows: any[];
}

export interface IFetchClinicalWorkflowReq {
  type: typeof ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST;
  data: IFetchClinicalWorkflowReqPayload;
}

export interface IDeleteWorkflowModuleReqPayload {
  id: string;
  tenantId: string;
}

export interface IDeleteWorkflowModule {
  type: typeof ACTION_TYPES.DELETE_WORKFLOW_MODULE_REQUEST;
  data: IDeleteWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchClinicalWorkflowReqPayload {
  countryId: string;
  tenantId?: string;
  limit: number | null;
  skip: number;
  searchTerm: string;
}

export interface IFetchCustomizationFormRequest {
  type: typeof ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST;
  tenantId: string;
  formType: string;
  category: string;
  cultureId?: number;
  countryId: string;
  districtId?: string;
  clinicalWorkflowId?: string;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchCustomizationFormSuccess {
  type: typeof ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_SUCCESS;
  payload: any;
}

export interface IFetchCustomizationFormFailure {
  type: typeof ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_FAILURE;
  error: any;
}

export interface IFetchConsentFormSuccess {
  type: typeof ACTION_TYPES.FETCH_CONSENT_FORM_SUCCESS;
  payload: any;
}

export interface IFetchConsentFormFailure {
  type: typeof ACTION_TYPES.FETCH_CONSENT_FORM_FAILURE;
  error: any;
}

export interface IFetchFormMetaRequest {
  type: typeof ACTION_TYPES.FETCH_FORM_META_REQUEST;
  formType: FormType;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchFormMetaSuccess {
  type: typeof ACTION_TYPES.FETCH_FORM_META_SUCCESS;
  payload: any;
  formType: FormType;
}
export interface IFetchFormMetaFailure {
  type: typeof ACTION_TYPES.FETCH_FORM_META_FAILURE;
}

export interface ICustomizeFormRequest {
  type: typeof ACTION_TYPES.CUSTOMIZE_FORM_REQUEST;
  formType: FormType;
  formId: string;
  category: string;
  tenantId: string;
  countryId: string;
  cultureId?: number;
  payload: any;
  districtId?: string;
  clinicalWorkflowId?: string;
  workflowId?: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICustomizeFormSuccess {
  type: typeof ACTION_TYPES.CUSTOMIZE_FORM_SUCCESS;
}
export interface ICustomizeFormFailure {
  type: typeof ACTION_TYPES.CUSTOMIZE_FORM_FAILURE;
}
export interface IDeactivateConsentRequest {
  type: typeof ACTION_TYPES.DEACTIVATE_CONSENT_FORM_REQUEST;
  formType: FormType;
  formId: string;
  category: string;
  tenantId: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeactivateConsentSuccess {
  type: typeof ACTION_TYPES.DEACTIVATE_CONSENT_FORM_SUCCESS;
}
export interface IDeactivateConsentFailure {
  type: typeof ACTION_TYPES.DEACTIVATE_CONSENT_FORM_FAILURE;
}

export interface IClearFormMeta {
  type: typeof ACTION_TYPES.CLEAR_FORM_META;
  formType: FormType;
}

export interface IClearFormJSON {
  type: typeof ACTION_TYPES.CLEAR_FORM_JSON;
}

export interface IClearConsentForm {
  type: typeof ACTION_TYPES.CLEAR_CONSENT_FORM;
}
export interface IFetchClinicalWorkflowSuccessPayload {
  data: IClinicalWorkflow[];
  total: number;
}
export interface IFetchClinicalWorkflowSuccess {
  type: typeof ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS;
  payload: IFetchClinicalWorkflowSuccessPayload;
}

export interface IFetchClinicalWorkflowFailure {
  type: typeof ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_FAILURE;
}
export interface IAccountOption {
  name: string;
  id: string;
  tenantId: string;
}

export interface IDashboardAccounts {
  id: string;
  name: string;
  ouCount: number;
  siteCount: number;
  tenantId: string;
}

export interface IResetWorkFlowModule {
  type: typeof ACTION_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST;
}

export interface ICreateWorkflowModuleSuccess {
  type: typeof ACTION_TYPES.CREATE_WORKFLOW_MODULE_SUCCESS;
}

export interface ICreateWorkflowModuleFail {
  type: typeof ACTION_TYPES.CREATE_WORKFLOW_MODULE_FAILURE;
  error: Error;
}
export interface IDeleteWorkflowModule {
  type: typeof ACTION_TYPES.DELETE_WORKFLOW_MODULE_REQUEST;
  data: IDeleteWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateWorkflowModuleSuccess {
  type: typeof ACTION_TYPES.UPDATE_WORKFLOW_MODULE_SUCCESS;
}

export interface IUpdateWorkflowModuleFail {
  type: typeof ACTION_TYPES.UPDATE_WORKFLOW_MODULE_FAILURE;
  error: Error;
}
export interface IDeleteWorkflowModuleSuccess {
  type: typeof ACTION_TYPES.DELETE_WORKFLOW_MODULE_SUCCESS;
}

export interface IDeleteWorkflowModuleFail {
  type: typeof ACTION_TYPES.DELETE_WORKFLOW_MODULE_FAILURE;
  error: Error;
}

export interface IResetWorkFlowModule {
  type: typeof ACTION_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST;
}

export type WorkflowActions =
  | IFetchCustomizationFormRequest
  | IFetchCustomizationFormSuccess
  | IFetchCustomizationFormFailure
  | IFetchConsentFormSuccess
  | IFetchConsentFormFailure
  | ICustomizeFormRequest
  | ICustomizeFormSuccess
  | ICustomizeFormFailure
  | IFetchFormMetaRequest
  | IFetchFormMetaSuccess
  | IFetchFormMetaFailure
  | IClearFormMeta
  | IClearFormJSON
  | IClearConsentForm
  | IDeactivateConsentRequest
  | IDeactivateConsentSuccess
  | IDeactivateConsentFailure
  | IFetchClinicalWorkflowSuccess
  | IResetWorkFlowModule
  | ICreateWorkflowModule
  | ICreateWorkflowModule
  | ICreateWorkflowModuleSuccess
  | ICreateWorkflowModuleFail
  | IUpdateWorkflowModule
  | IUpdateWorkflowModuleSuccess
  | IUpdateWorkflowModuleFail
  | IDeleteWorkflowModule
  | IDeleteWorkflowModuleSuccess
  | IDeleteWorkflowModuleFail
  | IResetWorkFlowModule
  | IFetchClinicalWorkflowReq
  | IFetchClinicalWorkflowFailure;
