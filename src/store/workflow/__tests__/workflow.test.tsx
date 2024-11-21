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
import * as ACTION_TYPES from '../actionTypes';
import { FormLogType, FormType } from '../types';
import WORKFLOW_MOCK_DATA from '../../../tests/mockData/workflowMockData';
import { AxiosPromise } from 'axios';
import { runSaga } from 'redux-saga';
import { FormTypes } from '../../../containers/region/RegionCustomization';

const formMetaResponsePayload = WORKFLOW_MOCK_DATA.FETCH_FORM_META_RESPONSE;
const inputFormRegionReqPayload = WORKFLOW_MOCK_DATA.FETCH_INPUT_FORM_REGION_REQ_PAYLOAD;
const inputFormRegionResPayload = WORKFLOW_MOCK_DATA.FETCH_INPUT_FORM_REGION_RES_PAYLOAD;
const inputFormAccountReqPayload = WORKFLOW_MOCK_DATA.FETCH_INPUT_FORM_REQ_PAYLOAD;
const consentFormRegionReqPayload = WORKFLOW_MOCK_DATA.FETCH_CONSENT_FORM_REGION_REQ_PAYLOAD;
const consentFormAccountReqPayload = WORKFLOW_MOCK_DATA.FETCH_CONSENT_FORM_REQ_PAYLOAD;
const updateInputFormReqPayload = WORKFLOW_MOCK_DATA.UPDATE_INPUT_FORM_REQ_PAYLOAD;

describe('Workflow Sagas', () => {
  // Test fetchCustomizationForm saga
  describe('Fetch customization and consent form in region and workflow', () => {
    [
      inputFormRegionReqPayload,
      inputFormAccountReqPayload,
      consentFormRegionReqPayload,
      consentFormAccountReqPayload
    ].forEach((requestPayload: any) => {
      it(`Fetch ${requestPayload.category === 'input_form' ? 'customization' : 'consent'} form for ${
        requestPayload?.districtId || requestPayload?.clinicalWorkflowId ? 'workflow' : 'country'
      } and dispatches success`, async () => {
        const fetchInputFormRegionSpy = jest.spyOn(workflowService, 'fetchCustomizationForm').mockImplementation(
          () =>
            Promise.resolve({
              data: { entity: inputFormRegionResPayload }
            }) as AxiosPromise
        );
        const payload =
          requestPayload.category === 'input_form'
            ? { ...inputFormRegionResPayload, form_input: JSON.parse(inputFormRegionResPayload?.formInput) }
            : inputFormRegionResPayload;
        const dispatched: any = [];
        await runSaga(
          {
            dispatch: (action) => dispatched.push(action)
          },
          fetchCustomizationForm,
          { ...requestPayload, type: ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST }
        ).toPromise();
        expect(fetchInputFormRegionSpy).toHaveBeenCalledWith(requestPayload);
        expect(dispatched).toEqual([
          requestPayload.category === 'input_form'
            ? workflowActions.fetchCustomizationFormSuccess({ payload })
            : workflowActions.fetchConsentFormSuccess({ payload: inputFormRegionResPayload })
        ]);
      });
    });

    it('Fails to fetch customization or consent form and dispatches failure with instance of error', async () => {
      const error = new Error('Failed to fetch customization or consent form');
      const fetchCustomizationSpy = jest
        .spyOn(workflowService, 'fetchCustomizationForm')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCustomizationForm,
        { ...inputFormRegionReqPayload, type: ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST }
      ).toPromise();
      expect(fetchCustomizationSpy).toHaveBeenCalledWith(inputFormRegionReqPayload);
      expect(dispatched).toEqual([workflowActions.fetchCustomizationFormFailure(error)]);
    });

    it('Fails to fetch customization or consent form and dispatches failure without instance of error', async () => {
      const error = 'Failed to fetch customization or consent form';
      const fetchCustomizationSpy = jest
        .spyOn(workflowService, 'fetchCustomizationForm')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCustomizationForm,
        { ...inputFormRegionReqPayload, type: ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST }
      ).toPromise();
      expect(fetchCustomizationSpy).toHaveBeenCalledWith(inputFormRegionReqPayload);
      expect(dispatched).not.toEqual([workflowActions.fetchCustomizationFormFailure(error)]);
    });
  });
  // Test fetchFormMeta saga
  describe('Fetch Form Meta', () => {
    (['screening', 'enrollment', 'assessment', ''] as unknown as FormType[]).forEach((formType) => {
      it(`Fetch form meta for ${formType} and dispatches success`, async () => {
        const fetchFormMetaSpy = jest.spyOn(workflowService, 'fetchFormMeta').mockImplementation(
          () =>
            Promise.resolve({
              data: {
                entity: { components: formMetaResponsePayload.components }
              }
            }) as AxiosPromise
        );
        const dispatched: any = [];
        await runSaga(
          {
            dispatch: (action) => dispatched.push(action)
          },
          fetchFormMeta,
          {
            formType,
            type: ACTION_TYPES.FETCH_FORM_META_REQUEST
          }
        ).toPromise();
        switch (formType) {
          case FormTypes.Screening:
            expect(fetchFormMetaSpy).toHaveBeenCalledWith('screeninglog');
            break;
          case FormTypes.Enrollment:
            expect(fetchFormMetaSpy).toHaveBeenCalledWith('patient');
            break;
          case FormTypes.Assessment:
            expect(fetchFormMetaSpy).toHaveBeenCalledWith('bplog');
            expect(fetchFormMetaSpy).toHaveBeenCalledWith('glucoselog');
            break;
          default:
            break;
        }
        expect(dispatched).toEqual([
          workflowActions.fetchFormMetaSuccess({
            formType,
            payload: formType ? formMetaResponsePayload.components || [] : []
          })
        ]);
      });
    });
    it('Fetch form meta for screening and dispatches failure with instance of error', async () => {
      const error = new Error('Failed to fetch form meta for screening');
      const fetchFormMetaSpy = jest
        .spyOn(workflowService, 'fetchFormMeta')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchFormMeta,
        {
          type: ACTION_TYPES.FETCH_FORM_META_REQUEST,
          formType: 'screening' as FormType
        }
      ).toPromise();
      expect(fetchFormMetaSpy).toHaveBeenCalledWith('screeninglog' as FormLogType);
      expect(dispatched).toEqual([workflowActions.fetchFormMetaFailure()]);
    });

    it('Fetch form meta for screening and dispatches failure without instance of error', async () => {
      const error = 'Failed to fetch form meta for screening';
      const fetchFormMetaSpy = jest
        .spyOn(workflowService, 'fetchFormMeta')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchFormMeta,
        {
          type: ACTION_TYPES.FETCH_FORM_META_REQUEST,
          formType: 'screening' as FormType
        }
      ).toPromise();
      expect(fetchFormMetaSpy).toHaveBeenCalledWith('screeninglog' as FormLogType);
      expect(dispatched).not.toEqual([workflowActions.fetchFormMetaFailure()]);
    });
  });

  // Test customizeForm saga
  describe('customizeForm Saga', () => {
    it('Update customization form and dispatches success', async () => {
      const updateFormDataSpy = jest
        .spyOn(workflowService, 'updateCustomizationForm')
        .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        customizeForm,
        {
          ...updateInputFormReqPayload,
          type: ACTION_TYPES.CUSTOMIZE_FORM_REQUEST
        }
      ).toPromise();
      expect(updateFormDataSpy).toHaveBeenCalledWith(updateInputFormReqPayload);
      expect(dispatched).toEqual([workflowActions.customizeFormSuccess()]);
    });

    it('Update customization form and dispatches failure with instance of error', async () => {
      const updateFormDataSpy = jest
        .spyOn(workflowService, 'updateCustomizationForm')
        .mockImplementation(() => Promise.reject(new Error('Failed to update the form')));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        customizeForm,
        {
          ...updateInputFormReqPayload,
          type: ACTION_TYPES.CUSTOMIZE_FORM_REQUEST
        }
      ).toPromise();
      expect(updateFormDataSpy).toHaveBeenCalledWith(updateInputFormReqPayload);
      expect(dispatched).toEqual([workflowActions.customizeFormFailure()]);
    });

    it('Update customization form and dispatches failure without instance of error', async () => {
      const updateFormDataSpy = jest
        .spyOn(workflowService, 'updateCustomizationForm')
        .mockImplementation(() => Promise.reject('Failed to update the form'));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        customizeForm,
        {
          ...updateInputFormReqPayload,
          type: ACTION_TYPES.CUSTOMIZE_FORM_REQUEST
        }
      ).toPromise();
      expect(updateFormDataSpy).toHaveBeenCalledWith(updateInputFormReqPayload);
      expect(dispatched).not.toEqual([workflowActions.customizeFormFailure()]);
    });
  });

  // Test deactivateConsentForm saga
  describe('deactivateConsentForm Saga', () => {
    it('should handle success', () => {
      const action: any = {
        formType: 'type',
        formId: '1',
        category: 'category',
        tenantId: 'tenantId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator: any = deactivateConsentForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.deactivateConsentForm as any, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          tenantId: 'tenantId'
        })
      );
      expect(generator.next().value).toEqual(put(workflowActions.deactivateConsentSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure with instance of error', () => {
      const action: any = {
        formType: 'type',
        formId: '1',
        category: 'category',
        tenantId: 'tenantId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error deactivating consent form');

      const generator: any = deactivateConsentForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.deactivateConsentForm as any, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          tenantId: 'tenantId'
        })
      );
      expect(generator.throw(error).value).toEqual(put(workflowActions.deactivateConsentFailure()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure without instance of error', () => {
      const action: any = {
        formType: 'type',
        formId: '1',
        category: 'category',
        tenantId: 'tenantId',
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = 'Error deactivating consent form';

      const generator: any = deactivateConsentForm(action);
      expect(generator.next().value).toEqual(
        call(workflowService.deactivateConsentForm as any, {
          formType: 'Type',
          formId: '1',
          category: 'category',
          tenantId: 'tenantId'
        })
      );
      expect(generator.throw(error).value).not.toEqual(put(workflowActions.deactivateConsentFailure()));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test fetchClinicalWorkflows saga
  describe('fetchClinicalWorkflows Saga', () => {
    it('should handle success with sorting workflows by moduleType', () => {
      const action: any = { data: {} };
      const response = {
        data: {
          entityList: [{ moduleType: 2 }, { moduleType: 1 }],
          totalCount: 2
        }
      };

      const sortedWorkflows = [{ moduleType: 1 }, { moduleType: 2 }];

      const generator = fetchClinicalWorkflows(action);

      expect(generator.next().value).toEqual(call(workflowService.fetchClinicalWorkflows, action.data));
      expect(generator.next(response).value).toEqual(
        put(
          workflowActions.fetchClinicalWorkflowSuccess({
            data: sortedWorkflows as any,
            total: response.data.totalCount
          })
        )
      );
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure with instance of error', () => {
      const action: any = { data: {} };
      const error = new Error('Error fetching clinical workflows');

      const generator: any = fetchClinicalWorkflows(action);
      expect(generator.next().value).toEqual(call(workflowService.fetchClinicalWorkflows, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.fetchClinicalWorkflowFailure()));
      expect(generator.next().done).toBe(true);
    });
    it('should handle failure without instance of error', () => {
      const action: any = { data: {} };
      const error = 'Error fetching clinical workflows';

      const generator: any = fetchClinicalWorkflows(action);
      expect(generator.next().value).toEqual(call(workflowService.fetchClinicalWorkflows, action.data));
      expect(generator.throw(error).value).not.toEqual(put(workflowActions.fetchClinicalWorkflowFailure()));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test createWorkflowRequest saga
  describe('createWorkflowRequest Saga', () => {
    it('should handle success', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator = createWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.createWorkflowModule as any, action.data));
      expect(generator.next().value).toEqual(put(workflowActions.createWorkflowModuleSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure with instance of error', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error creating workflow');

      const generator: any = createWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.createWorkflowModule, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.createWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure without instance of error', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error: any = 'Error creating workflow';

      const generator: any = createWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.createWorkflowModule, action.data));
      expect(generator.throw(error).value).not.toEqual(put(workflowActions.createWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test updateWorkflowRequest saga
  describe('updateWorkflowRequest Saga', () => {
    it('should handle success', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator = updateWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.updateWorkflowModule, action.data));
      expect(generator.next().value).toEqual(put(workflowActions.updateWorkflowModuleSuccess()));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure with instance of error', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error updating workflow');

      const generator: any = updateWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.updateWorkflowModule, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.updateWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure without instance of error', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error: any = 'Error updating workflow';

      const generator: any = updateWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.updateWorkflowModule, action.data));
      expect(generator.throw(error).value).not.toEqual(put(workflowActions.updateWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });
  });

  // Test deleteWorkflowRequest saga
  describe('deleteWorkflowRequest Saga', () => {
    it('should handle success', () => {
      const action: any = {
        data: { id: '1', tenantId: '1' },
        successCb: jest.fn(),
        failureCb: jest.fn()
      };

      const generator: any = deleteWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.deleteWorkflowModule, action.data));
      expect(generator.next().value).toEqual(put(workflowActions.deleteWorkflowModuleSuccess()));
      expect(generator.next().done).toBe(true);
    });
    it('should handle failure with instance of error', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error = new Error('Error deleting workflow');

      const generator: any = deleteWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.deleteWorkflowModule, action.data));
      expect(generator.throw(error).value).toEqual(put(workflowActions.deleteWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure without instance of error', () => {
      const action: any = {
        data: {},
        successCb: jest.fn(),
        failureCb: jest.fn()
      };
      const error: any = 'Error deleting workflow';

      const generator: any = deleteWorkflowRequest(action);
      expect(generator.next().value).toEqual(call(workflowService.deleteWorkflowModule, action.data));
      expect(generator.throw(error).value).not.toEqual(put(workflowActions.deleteWorkflowModuleFailure(error)));
      expect(generator.next().done).toBe(true);
    });
  });
});
