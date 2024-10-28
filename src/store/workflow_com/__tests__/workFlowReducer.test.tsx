import workFlowReducer from '../reducer';
import * as WORKFLOWTYPES from '../actionTypes';
import { IWorkflowState } from '../types';

const initialState: IWorkflowState = {
  formJSON: null,
  consentForm: null || undefined,
  formMeta: null,
  loading: false,
  loadingMeta: false
};
describe('workflowreducer', () => {
  it('it should handle FETCH_CONSENT_FORM_SUCCESS', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_CONSENT_FORM_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      consentForm: action.payload
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });

  it('it should handle DEACTIVATE_CONSENT_FORM_SUCCESS', () => {
    const action: any = {
      type: WORKFLOWTYPES.DEACTIVATE_CONSENT_FORM_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      consentForm: null
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_CUSTOMIZATION_FORM_SUCCESS', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_CUSTOMIZATION_FORM_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      formJSON: action.payload
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_CUSTOMIZATION_FORM_REQUEST', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_CUSTOMIZATION_FORM_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle DEACTIVATE_CONSENT_FORM_REQUEST', () => {
    const action: any = {
      type: WORKFLOWTYPES.DEACTIVATE_CONSENT_FORM_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_FORM_META_REQUEST', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_FORM_META_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });

  it('it should handle CUSTOMIZE_FORM_REQUEST', () => {
    const action: any = {
      type: WORKFLOWTYPES.CUSTOMIZE_FORM_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_FORM_META_SUCCESS', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_FORM_META_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      formMeta: action.payload
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle CUSTOMIZE_FORM_SUCCESS', () => {
    const action: any = {
      type: WORKFLOWTYPES.CUSTOMIZE_FORM_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle CUSTOMIZE_FORM_FAILURE', () => {
    const action: any = {
      type: WORKFLOWTYPES.CUSTOMIZE_FORM_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  
  it('it should handle DEACTIVATE_CONSENT_FORM_FAILURE', () => {
    const action: any = {
      type: WORKFLOWTYPES.DEACTIVATE_CONSENT_FORM_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_FORM_META_FAILURE', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_FORM_META_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_CUSTOMIZATION_FORM_FAILURE', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_CUSTOMIZATION_FORM_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle FETCH_CONSENT_FORM_FAILURE', () => {
    const action: any = {
      type: WORKFLOWTYPES.FETCH_CONSENT_FORM_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle CLEAR_FORM_META', () => {
    const action: any = {
      type: WORKFLOWTYPES.CLEAR_FORM_META
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle WORKFLOW_TYPES.CLEAR_CONSENT_FORM', () => {
    const action: any = {
      type: WORKFLOWTYPES.CLEAR_FORM_JSON
    };
    const expectedState = {
      ...initialState,
      formMeta: null
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle WORKFLOW_TYPES.CLEAR_CONSENT_FORM', () => {
    const action: any = {
      type: WORKFLOWTYPES.CLEAR_FORM_JSON
    };
    const expectedState = {
      ...initialState,
      formJSON: null
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
  it('it should handle WORKFLOW_TYPES.CLEAR_CONSENT_FORM', () => {
    const action: any = {
      type: WORKFLOWTYPES.CLEAR_CONSENT_FORM
    };
    const expectedState = {
      ...initialState,
      consentForm: null
    };
    expect(workFlowReducer(initialState, action)).toEqual(expectedState);
  });
});
