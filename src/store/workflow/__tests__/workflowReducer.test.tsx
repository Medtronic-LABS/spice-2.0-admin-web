import workflowReducer from '../reducer';
import * as WORKFLOW_TYPES from '../actionTypes';
import { initialState } from '../reducer';

describe('workflowReducer', () => {
  it('should return the initial state when an unknown action is passed', () => {
    const newState = workflowReducer(undefined, { type: 'UNKNOWN_ACTION' } as any);
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_CONSENT_FORM_SUCCESS', () => {
    const action: any = {
      type: WORKFLOW_TYPES.FETCH_CONSENT_FORM_SUCCESS,
      payload: { id: 1, name: 'Consent Form' }
    };
    const expectedState = {
      ...initialState,
      loading: false,
      consentForm: action.payload
    };
    const newState = workflowReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle DEACTIVATE_CONSENT_FORM_SUCCESS', () => {
    const action: any = {
      type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      consentForm: null
    };
    const newState = workflowReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_CUSTOMIZATION_FORM_REQUEST and set loading to true', () => {
    const action: any = {
      type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    const newState = workflowReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_FORM_META_SUCCESS', () => {
    const action: any = {
      type: WORKFLOW_TYPES.FETCH_FORM_META_SUCCESS,
      payload: { id: 1, name: 'Form Meta' }
    };
    const expectedState = {
      ...initialState,
      loading: false,
      formMeta: action.payload
    };
    const newState = workflowReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_CLINICAL_WORKFLOW_SUCCESS', () => {
    const action: any = {
      type: WORKFLOW_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS,
      payload: {
        data: [{ id: 1, name: 'Workflow 1' }],
        total: 1
      }
    };
    const expectedState = {
      ...initialState,
      clinicalWorkflows: action.payload.data,
      clinicalWorkflowsCount: action.payload.total,
      loading: false
    };
    const newState = workflowReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle CLEAR_FORM_META', () => {
    const modifiedState = {
      ...initialState,
      formMeta: { id: 1, name: 'Form Meta' }
    };
    const action: any = {
      type: WORKFLOW_TYPES.CLEAR_FORM_META
    };
    const expectedState = {
      ...modifiedState,
      formMeta: null
    };
    const newState = workflowReducer(modifiedState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle RESET_CLINICAL_WORKFLOW_REQUEST', () => {
    const modifiedState = {
      ...initialState,
      clinicalWorkflows: [{ id: 1, name: 'Workflow 1' }],
      clinicalWorkflowsCount: 1
    };
    const action: any = {
      type: WORKFLOW_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST
    };
    const expectedState = {
      ...modifiedState,
      clinicalWorkflows: [],
      clinicalWorkflowsCount: 0
    };
    const newState = workflowReducer(modifiedState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle CUSTOMIZE_FORM_SUCCESS', () => {
    const action: any = { type: WORKFLOW_TYPES.CUSTOMIZE_FORM_SUCCESS };
    const newState = workflowReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });

  it('should handle CUSTOMIZE_FORM_FAILURE', () => {
    const action: any = { type: WORKFLOW_TYPES.CUSTOMIZE_FORM_FAILURE };
    const newState = workflowReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });

  it('should handle DEACTIVATE_CONSENT_FORM_FAILURE', () => {
    const action: any = { type: WORKFLOW_TYPES.DEACTIVATE_CONSENT_FORM_FAILURE };
    const newState = workflowReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });

  it('should handle FETCH_FORM_META_FAILURE', () => {
    const action: any = { type: WORKFLOW_TYPES.FETCH_FORM_META_FAILURE };
    const newState = workflowReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });

  it('should handle FETCH_CUSTOMIZATION_FORM_FAILURE', () => {
    const action: any = { type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_FAILURE };
    const newState = workflowReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });

  it('should handle FETCH_CONSENT_FORM_FAILURE', () => {
    const action: any = { type: WORKFLOW_TYPES.FETCH_CONSENT_FORM_FAILURE };
    const newState = workflowReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });

  it('should handle CLEAR_FORM_JSON action', () => {
    const action: any = { type: WORKFLOW_TYPES.CLEAR_FORM_JSON };
    const expectedState = {
      ...initialState,
      formJSON: null
    };

    expect(workflowReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_CONSENT_FORM action', () => {
    const action: any = { type: WORKFLOW_TYPES.CLEAR_CONSENT_FORM };
    const expectedState = {
      ...initialState,
      consentForm: null
    };

    expect(workflowReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CUSTOMIZATION_FORM_SUCCESS action', () => {
    const payload = { key: 'value' }; // Example payload
    const action: any = {
      type: WORKFLOW_TYPES.FETCH_CUSTOMIZATION_FORM_SUCCESS,
      payload
    };

    const expectedState = {
      ...initialState,
      loading: false,
      formJSON: payload
    };

    expect(workflowReducer(initialState, action)).toEqual(expectedState);
  });
});
