import { call, put } from 'redux-saga/effects';
import {
  fetchCustomizationForm,
  fetchFormMeta,
  customizeForm,
  deactivateConsentForm,
  fetchClinicalWorkflows,
  createWorkflowRequest,
  deleteWorkflowRequest,
  updateWorkflowRequest
} from '../sagas'; // Import sagas
import * as workflowService from '../../../services/workflowAPI';
import * as workflowActions from '../actions';

describe('Workflow Sagas', () => {
  // Test fetchCustomizationForm saga
  describe('fetchCustomizationForm Saga', () => {
    it('should handle failure', () => {
      const action: any = {
        tenantId: '1',
        countryId: '1',
        countyId: '1',
        formType: 'someFormType',
        category: 'someCategory',
        cultureId: '1',
        clinicalWorkflowId: '1',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const generator = fetchCustomizationForm(action);
      // Advance the generator to the call to `workflowService.fetchCustomizationForm`
      expect(generator.next().value).toEqual(
        call(workflowService.fetchCustomizationForm, {
          tenantId: action.tenantId,
          countryId: action.countryId,
          countyId: action.countyId,
          formType: action.formType,
          category: action.category,
          cultureId: action.cultureId,
          clinicalWorkflowId: action.clinicalWorkflowId
        })
      );
      const error = new Error('Some error');
      expect(generator.throw(error).value).toEqual(put(workflowActions.fetchCustomizationFormFailure(error)));
    });
  });

  // Test fetchFormMeta saga
  describe('fetchFormMeta Saga', () => {
    it('should handle success for Screening formType', () => {
      const action = { formType: 'screening', successCb: jest.fn(), failureCb: jest.fn() };
      const response = { data: { entity: { components: [{ key: 'key1', type: 'type1', label: 'label1' }] } } };

      const generator = fetchFormMeta(action);
      expect(generator.next().value).toEqual(call(workflowService.fetchFormMeta, 'screeninglog'));
      expect(generator.next(response).value).toEqual(
        put(workflowActions.fetchFormMetaSuccess({ formType: 'screening', payload: response.data.entity.components }))
      );
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const action = { formType: 'screening', successCb: jest.fn(), failureCb: jest.fn() };
      const error = new Error('Error fetching form meta');

      const generator = fetchFormMeta(action);
      expect(generator.next().value).toEqual(call(workflowService.fetchFormMeta, 'screeninglog'));
      expect(generator.throw(error).value).toEqual(put(workflowActions.fetchFormMetaFailure()));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test customizeForm saga
  describe('customizeForm Saga', () => {
    it('should handle success', () => {
      const action = {
        formType: 'type',
        formId: '1',
        category: 'category',
        payload: {},
        tenantId: 'tenantId',
        countryId: 'countryId',
        countyId: 'countyId',
        cultureId: 'cultureId',
        clinicalWorkflowId: 'clinicalWorkflowId',
        workflowId: 'workflowId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator = customizeForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.updateCustomizationForm, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          payload: {},
          tenantId: 'tenantId',
          countryId: 'countryId',
          countyId: 'countyId',
          clinicalWorkflowId: 'clinicalWorkflowId',
          workflowId: 'workflowId',
          cultureId: 'cultureId'
        })
      );
      expect(generator.next().value).toEqual(put(workflowActions.customizeFormSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const action = {
        formType: 'type',
        formId: '1',
        category: 'category',
        payload: {},
        tenantId: 'tenantId',
        countryId: 'countryId',
        countyId: 'countyId',
        cultureId: 'cultureId',
        clinicalWorkflowId: 'clinicalWorkflowId',
        workflowId: 'workflowId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error customizing form');

      const generator = customizeForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.updateCustomizationForm, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          payload: {},
          tenantId: 'tenantId',
          countryId: 'countryId',
          countyId: 'countyId',
          clinicalWorkflowId: 'clinicalWorkflowId',
          workflowId: 'workflowId',
          cultureId: 'cultureId'
        })
      );
      expect(generator.throw(error).value).toEqual(put(workflowActions.customizeFormFailure()));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test deactivateConsentForm saga
  describe('deactivateConsentForm Saga', () => {
    it('should handle success', () => {
      const action = {
        formType: 'type',
        formId: '1',
        category: 'category',
        tenantId: 'tenantId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator = deactivateConsentForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.deactivateConsentForm, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          tenantId: 'tenantId'
        })
      );
      expect(generator.next().value).toEqual(put(workflowActions.deactivateConsentSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const action = {
        formType: 'type',
        formId: '1',
        category: 'category',
        tenantId: 'tenantId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error deactivating consent form');

      const generator = deactivateConsentForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.deactivateConsentForm, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          tenantId: 'tenantId'
        })
      );
      expect(generator.throw(error).value).toEqual(put(workflowActions.deactivateConsentFailure()));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test fetchClinicalWorkflows saga
  describe('fetchClinicalWorkflows Saga', () => {
    it('should handle success', () => {
      const action = { data: {} };
      const response = { data: { entityList: [], totalCount: 0 } };

      const generator = fetchClinicalWorkflows(action);
      expect(generator.next().value).toEqual(call(workflowService.fetchClinicalWorkflows, action.data));
      expect(generator.next(response).value).toEqual(
        put(
          workflowActions.fetchClinicalWorkflowSuccess({
            data: response.data.entityList,
            total: response.data.totalCount
          })
        )
      );
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const action = { data: {} };
      const error = new Error('Error fetching clinical workflows');

      const generator = fetchClinicalWorkflows(action);
      expect(generator.next().value).toEqual(call(workflowService.fetchClinicalWorkflows, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.fetchClinicalWorkflowFailure()));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test createWorkflowRequest saga
  describe('createWorkflowRequest Saga', () => {
    it('should handle success', () => {
      const action = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator = createWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.createWorkflowModule, action.data));
      expect(generator.next().value).toEqual(put(workflowActions.createWorkflowModuleSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const action = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error creating workflow');

      const generator = createWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.createWorkflowModule, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.createWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test deleteWorkflowRequest saga
  describe('deleteWorkflowRequest Saga', () => {
    it('should handle failure', () => {
      const action = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error deleting workflow');

      const generator = deleteWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.deleteWorkflowModule, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.deleteWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test updateWorkflowRequest saga
  describe('updateWorkflowRequest Saga', () => {
    it('should handle success', () => {
      const action = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator = updateWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.updateWorkflowModule, action.data));
      expect(generator.next().value).toEqual(put(workflowActions.updateWorkflowModuleSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const action = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error updating workflow');

      const generator = updateWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.updateWorkflowModule, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.updateWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });
  });
});
