import {
  fetchCustomizationFormRequest,
  fetchClinicalWorkflowSuccess,
  fetchClinicalWorkflowFailure,
  createWorkflowModule,
  fetchClinicalWorkflow,
  updateWorkflowModule,
  deleteWorkflowModule,
  fetchCustomizationFormSuccess,
  fetchCustomizationFormFailure,
  fetchConsentFormSuccess,
  fetchConsentFormFailure,
  fetchFormMetaRequest,
  fetchFormMetaSuccess,
  fetchFormMetaFailure,
  clearFormMeta,
  clearFormJSON,
  customizeFormRequest,
  customizeFormSuccess,
  customizeFormFailure,
  deactivateConsentRequest,
  deactivateConsentSuccess,
  deactivateConsentFailure,
  clearConsentForm,
  createWorkflowModuleSuccess,
  createWorkflowModuleFailure,
  updateWorkflowModuleSuccess,
  updateWorkflowModuleFailure,
  deleteWorkflowModuleSuccess,
  deleteWorkflowModuleFailure,
  resetClinicalWorkflow
} from '../actions';
import * as WORKFLOW_TYPES from '../actionTypes';
import { FormType } from '../types';

describe('Action Creators tests', () => {
  it('fetchCustomizationFormRequest should create an action to request customization form', () => {
    const apiData = {
      tenantId: '1',
      countryId: '1',
      districtId: '1',
      formType: 'type1',
      category: 'category1',
      cultureId: 1,
      clinicalWorkflowId: 'workflow1',
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = fetchCustomizationFormRequest(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST,
      ...apiData
    });
  });

  it('fetchClinicalWorkflowSuccess should create an action for successful fetch', () => {
    const payload = { data: [], total: 0 };
    const action = fetchClinicalWorkflowSuccess(payload);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS,
      payload
    });
  });

  it('fetchClinicalWorkflowFailure should create an action for failed fetch', () => {
    const action = fetchClinicalWorkflowFailure();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_FAILURE
    });
  });

  it('createWorkflowModule should create an action to create a workflow module', () => {
    const apiData = {
      data: { name: 'newModule', tenantId: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = createWorkflowModule(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_REQUEST,
      ...apiData
    });
  });

  it('clearFormJSON should create an action to clear form JSON', () => {
    const action = clearFormJSON();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CLEAR_FORM_JSON
    });
  });

  it('fetchFormMetaSuccess should create an action for successful fetch of form meta', () => {
    const apiData = { formType: 'Screening' as FormType, payload: { someMetaData: 'data' } };
    const action = fetchFormMetaSuccess(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_FORM_META_SUCCESS,
      ...apiData
    });
  });

  it('customizeFormRequest should create an action to request form customization', () => {
    const apiData = {
      formType: 'Screening' as FormType,
      formId: 'form1',
      category: 'category1',
      payload: { field: 'value' },
      tenantId: '1',
      countryId: '1',
      districtId: '1',
      workflowId: 'workflow1',
      cultureId: 1,
      clinicalWorkflowId: 'workflow1',
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = customizeFormRequest(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CUSTOMIZE_FORM_REQUEST,
      ...apiData
    });
  });

  // Add similar test cases for other action creators

  it('resetClinicalWorkflow should create an action to reset clinical workflow', () => {
    const action = resetClinicalWorkflow();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST
    });
  });
  it('fetchClinicalWorkflow should create an action to fetch clinical workflow', () => {
    const data = { countryId: '1', limit: null, skip: 1, searchTerm: '' }; // Example payload
    const action = fetchClinicalWorkflow(data);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST,
      data
    });
  });

  it('updateWorkflowModule should create an action to update  workflow module', () => {
    const apiData = {
      data: { name: 'updatedModule', tenantId: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = updateWorkflowModule(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_REQUEST,
      ...apiData
    });
  });

  it('deleteWorkflowModule should create an action to delete  workflow module', () => {
    const apiData = {
      data: { id: '1', tenantId: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = deleteWorkflowModule(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_REQUEST,
      ...apiData
    });
  });

  it('fetchCustomizationFormSuccess should create an action for successful customization form fetch', () => {
    const payload = { formId: 'form123', formData: {} }; // Example payload
    const action = fetchCustomizationFormSuccess({ payload });

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_SUCCESS,
      payload
    });
  });

  it('fetchCustomizationFormFailure should create an action for failed customization form fetch', () => {
    const error = new Error('Failed to fetch');
    const action = fetchCustomizationFormFailure(error);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_FAILURE,
      error
    });
  });

  it('fetchConsentFormSuccess should create an action for successful consent form fetch', () => {
    const payload = { consentId: 'consent123', consentData: {} }; // Example payload
    const action = fetchConsentFormSuccess({ payload });

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CONSENT_FORM_SUCCESS,
      payload
    });
  });

  it('fetchConsentFormFailure should create an action for failed consent form fetch', () => {
    const error = new Error('Failed to fetch');
    const action = fetchConsentFormFailure(error);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_CONSENT_FORM_FAILURE,
      error
    });
  });

  it('fetchFormMetaRequest should create an action to request form meta', () => {
    const apiData = {
      formType: 'Screening' as FormType,
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = fetchFormMetaRequest(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_FORM_META_REQUEST,
      ...apiData
    });
  });

  it('customizeFormSuccess should create an action for successful form customization', () => {
    const action = customizeFormSuccess();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CUSTOMIZE_FORM_SUCCESS
    });
  });

  it('customizeFormFailure should create an action for failed form customization', () => {
    const action = customizeFormFailure();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CUSTOMIZE_FORM_FAILURE
    });
  });

  it('deactivateConsentRequest should create an action to request deactivation of consent', () => {
    const apiData = {
      formType: 'Screening' as FormType,
      formId: 'form123',
      category: 'category1',
      tenantId: 'tenant1',
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = deactivateConsentRequest(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_REQUEST,
      ...apiData
    });
  });

  it('deactivateConsentSuccess should create an action for successful deactivation of consent', () => {
    const action = deactivateConsentSuccess();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_SUCCESS
    });
  });

  it('deactivateConsentFailure should create an action for failed deactivation of consent', () => {
    const action = deactivateConsentFailure();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_FAILURE
    });
  });

  it('clearConsentForm should create an action to clear consent form', () => {
    const action = clearConsentForm();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CLEAR_CONSENT_FORM
    });
  });

  it('createWorkflowModule should create an action to create a workflow module', () => {
    const apiData = {
      data: { name: 'newModule', tenantId: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = createWorkflowModule(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_REQUEST,
      ...apiData
    });
  });

  it('createWorkflowModuleSuccess should create an action for successful creation of a workflow module', () => {
    const action = createWorkflowModuleSuccess();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_SUCCESS
    });
  });

  it('createWorkflowModuleFailure should create an action for failed creation of a workflow module', () => {
    const error = new Error('Creation failed');
    const action = createWorkflowModuleFailure(error);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CREATE_WORKFLOW_MODULE_FAILURE,
      error
    });
  });

  it('updateWorkflowModule should create an action to update a workflow module', () => {
    const apiData = {
      data: { name: 'newModule', tenantId: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = updateWorkflowModule(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_REQUEST,
      ...apiData
    });
  });

  it('updateWorkflowModuleSuccess should create an action for successful update of a workflow module', () => {
    const action = updateWorkflowModuleSuccess();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_SUCCESS
    });
  });

  it('updateWorkflowModuleFailure should create an action for failed update of a workflow module', () => {
    const error = new Error('Update failed');
    const action = updateWorkflowModuleFailure(error);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.UPDATE_WORKFLOW_MODULE_FAILURE,
      error
    });
  });

  it('deleteWorkflowModule should create an action to delete a workflow module', () => {
    const apiData = {
      data: { id: '1', tenantId: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = deleteWorkflowModule(apiData);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_REQUEST,
      ...apiData
    });
  });

  it('deleteWorkflowModuleSuccess should create an action for successful deletion of a workflow module', () => {
    const action = deleteWorkflowModuleSuccess();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_SUCCESS
    });
  });

  it('deleteWorkflowModuleFailure should create an action for failed deletion of a workflow module', () => {
    const error = new Error('Deletion failed');
    const action = deleteWorkflowModuleFailure(error);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.DELETE_WORKFLOW_MODULE_FAILURE,
      error
    });
  });
  it('fetchFormMetaFailure should create an action for failed form meta fetch', () => {
    const action = fetchFormMetaFailure();

    expect(action).toEqual({
      type: WORKFLOW_TYPES.FETCH_FORM_META_FAILURE
    });
  });

  it('clearFormMeta should create an action to clear form meta', () => {
    const formType = 'Screening'; // Example form type
    const action = clearFormMeta(formType);

    expect(action).toEqual({
      type: WORKFLOW_TYPES.CLEAR_FORM_META,
      formType
    });
  });
});
