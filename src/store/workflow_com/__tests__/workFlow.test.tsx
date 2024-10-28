import { fetchCustomizationForm, customizeForm, deactivateConsentForm } from '../sagas';
import { runSaga } from 'redux-saga';
import * as workFlowService from '../../../services/workflowAPI';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosResponse } from 'axios';
import * as workFlowActions from '../actions';

describe('workflow reducer', () => {
  it('fetchCustomizationForm success', async () => {
    jest.spyOn(workFlowService, 'fetchCustomizationForm').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            tenantId: '',
            countryId: '',
            accountId: '',
            formType: '',
            category: 'Consent_form',
            cultureId: 1,
            clinicalWorkflowId: '1'
          }
        }
      } as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCustomizationForm,
      {
        tenantId: '',
        countryId: '',
        accountId: '',
        formType: '',
        category: 'Consent_form',
        cultureId: 1,
        clinicalWorkflowId: '1',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.fetchCustomizationForm).toHaveBeenCalledWith({
      category: 'Consent_form',
      clinicalWorkflowId: '1',
      tenantId: '',
      countryId: '',
      accountId: '',
      formType: '',
      cultureId: 1
    });
    expect(dispatched).toEqual([
      workFlowActions.fetchConsentFormSuccess({
        payload: {
          tenantId: '',
          countryId: '',
          accountId: '',
          formType: '',
          cultureId: 1,
          category: 'Consent_form',
          clinicalWorkflowId: '1'
        }
      })
    ]);
  });

  it('fetchCustomizationForm Input_form success', async () => {
    jest.spyOn(workFlowService, 'fetchCustomizationForm').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            tenantId: '',
            countryId: '',
            accountId: '',
            formType: '',
            category: 'Input_form',
            cultureId: 1,
            clinicalWorkflowId: '1',
            formInput: '{"key":"value"}'
          }
        }
      } as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCustomizationForm,
      {
        tenantId: '',
        countryId: '',
        accountId: '',
        formType: '',
        category: 'Input_form',
        cultureId: 1,
        clinicalWorkflowId: '1',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.fetchCustomizationForm).toHaveBeenCalledWith({
      category: 'Input_form',
      clinicalWorkflowId: '1',
      tenantId: '',
      countryId: '',
      accountId: '',
      formType: '',
      cultureId: 1
    });
    expect(dispatched).toEqual([
      workFlowActions.fetchCustomizationFormSuccess({
        payload: {
          tenantId: '',
          countryId: '',
          accountId: '',
          formType: '',
          cultureId: 1,
          category: 'Input_form',
          clinicalWorkflowId: '1',
          form_input: {
            key: 'value'
          },
          formInput: '{"key":"value"}'
        }
      })
    ]);
  });

  it('fetchCustomizationForm Input_form success', async () => {
    jest.spyOn(workFlowService, 'fetchCustomizationForm').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCustomizationForm,
      {
        tenantId: '',
        countryId: '',
        accountId: '',
        formType: '',
        category: 'Input_form',
        cultureId: 1,
        clinicalWorkflowId: '1',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.fetchCustomizationForm).toHaveBeenCalledWith({
      category: 'Input_form',
      clinicalWorkflowId: '1',
      tenantId: '',
      countryId: '',
      accountId: '',
      formType: '',
      cultureId: 1
    });
    expect(dispatched).toEqual([workFlowActions.fetchCustomizationFormFailure(new Error('Error'))]);
  });

  it('customizeForm success', async () => {
    jest.spyOn(workFlowService, 'updateCustomizationForm').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      customizeForm,
      {
        tenantId: '',
        formId: '',
        countryId: '',
        accountId: '',
        formType: 'screening',
        category: 'Input_form',
        cultureId: 1,
        clinicalWorkflowId: '1',
        payload: '',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.CUSTOMIZE_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.updateCustomizationForm).toHaveBeenCalledWith({
      tenantId: '',
      formId: '',
      countryId: '',
      accountId: '',
      formType: 'Screening',
      category: 'Input_form',
      cultureId: 1,
      clinicalWorkflowId: '1',
      workflowId: undefined,
      payload: ''
    });
    expect(dispatched).toEqual([workFlowActions.customizeFormSuccess()]);
  });
  it('customizeForm failure', async () => {
    jest.spyOn(workFlowService, 'updateCustomizationForm').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      customizeForm,
      {
        tenantId: '',
        formId: '',
        countryId: '',
        accountId: '',
        formType: 'screening',
        category: 'Input_form',
        cultureId: 1,
        clinicalWorkflowId: '1',
        payload: '',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.CUSTOMIZE_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.updateCustomizationForm).toHaveBeenCalledWith({
      tenantId: '',
      formId: '',
      countryId: '',
      accountId: '',
      formType: 'Screening',
      category: 'Input_form',
      cultureId: 1,
      clinicalWorkflowId: '1',
      workflowId: undefined,
      payload: ''
    });
    expect(dispatched).toEqual([workFlowActions.customizeFormFailure()]);
  });
  it('deactivateConsentForm success', async () => {
    jest.spyOn(workFlowService, 'deactivateConsentForm').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deactivateConsentForm,
      {
        tenantId: '',
        formId: '',
        formType: 'screening',
        category: 'Input_form',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.DEACTIVATE_CONSENT_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.deactivateConsentForm).toHaveBeenCalledWith({
      tenantId: '',
      formId: '',
      formType: 'Screening',
      category: 'Input_form',
      
    });
    expect(dispatched).toEqual([workFlowActions.deactivateConsentSuccess()]);
  });

  it('deactivateConsentForm Failure', async () => {
    jest.spyOn(workFlowService, 'deactivateConsentForm').mockImplementation(() => {
      return Promise.reject(new Error('Error'));
    });

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deactivateConsentForm,
      {
        tenantId: '',
        formId: '',
        formType: 'screening',
        category: 'Input_form',
        successCb: jest.fn(),
        failureCb: jest.fn(),
        type: ACTION_TYPES.DEACTIVATE_CONSENT_FORM_REQUEST
      }
    ).toPromise();

    expect(workFlowService.deactivateConsentForm).toHaveBeenCalledWith({
      tenantId: '',
      formId: '',
      formType: 'Screening',
      category: 'Input_form',
      
    });
    expect(dispatched).toEqual([workFlowActions.deactivateConsentFailure()]);
  });
});
