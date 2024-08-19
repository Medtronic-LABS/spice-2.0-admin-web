import axios from 'axios';
import {
  FormLogType,
  IWorkflowModuleReqPayload,
  ICustomizeFormRequest,
  IDeactivateConsentRequest,
  IFetchClinicalWorkflowReqPayload,
  IFetchCustomizationFormRequest,
  IDeleteWorkflowModuleReqPayload
} from '../store/workflow/types';

export const fetchCustomizationForm = ({
  tenantId,
  formType,
  category,
  cultureId,
  countryId,
  districtId,
  clinicalWorkflowId
}: IFetchCustomizationFormRequest) =>
  axios({
    method: 'POST',
    url: `/admin-service/${districtId || clinicalWorkflowId ? 'workflow' : 'country'}-customization/details`,
    data: {
      tenantId,
      type: formType,
      category,
      cultureId,
      countryId,
      districtId,
      clinicalWorkflowId
    }
  });

export const fetchFormMeta = (formType: FormLogType) =>
  axios({
    method: 'GET',
    url: `spice-service/static-data/get-meta-form?form=${formType}`
  });

export const updateCustomizationForm = ({
  formType,
  formId,
  category,
  tenantId,
  payload,
  countryId,
  districtId,
  workflowId,
  clinicalWorkflowId,
  cultureId
}: ICustomizeFormRequest) =>
  axios({
    method: formId ? 'PUT' : 'POST',
    url: `/admin-service/${districtId || clinicalWorkflowId ? 'workflow' : 'country'}-customization/${
      formId ? 'update' : 'create'
    }`,
    data: {
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    }
  });

export const deactivateConsentForm = ({ formType, formId, category, tenantId }: IDeactivateConsentRequest) =>
  axios({
    method: 'PUT',
    url: `/admin-service/workflow-customization/remove`,
    data: {
      type: formType,
      tenantId,
      category,
      id: formId
    }
  });

export const fetchClinicalWorkflows = (data: IFetchClinicalWorkflowReqPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/clinical-workflow/list',
    data
  });

export const createWorkflowModule = (data: IWorkflowModuleReqPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/clinical-workflow/create',
    data
  });

export const updateWorkflowModule = (data: IWorkflowModuleReqPayload) =>
  axios({
    method: 'PUT',
    url: '/admin-service/clinical-workflow/update',
    data
  });

export const deleteWorkflowModule = (data: IDeleteWorkflowModuleReqPayload) =>
  axios({
    method: 'PUT',
    url: '/admin-service/clinical-workflow/remove',
    data
  });
