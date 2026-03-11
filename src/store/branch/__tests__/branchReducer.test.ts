import branchReducer, { initialState } from '../reducer';
import * as BRANCH_TYPES from '../actionTypes';

describe('branchReducer', () => {
  it('should return initial state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(branchReducer(undefined, action as any)).toEqual(initialState);
  });

  it('should set loading to true for FETCH_BRANCH_LIST_REQUEST', () => {
    const state = branchReducer(initialState, { type: BRANCH_TYPES.FETCH_BRANCH_LIST_REQUEST, payload: {} } as any);
    expect(state.loading).toBe(true);
    expect(state).toEqual({ ...initialState, loading: true });
  });

  it('should set loading to true for CREATE_BRANCH_REQUEST', () => {
    const state = branchReducer(initialState, { type: BRANCH_TYPES.CREATE_BRANCH_REQUEST, payload: {} } as any);
    expect(state.loading).toBe(true);
  });

  it('should set loading to true for UPDATE_BRANCH_REQUEST', () => {
    const state = branchReducer(initialState, { type: BRANCH_TYPES.UPDATE_BRANCH_REQUEST, payload: {} } as any);
    expect(state.loading).toBe(true);
  });

  it('should handle FETCH_BRANCH_LIST_SUCCESS', () => {
    const branches = [{ id: 1, name: 'Branch A', code: 'BR001', district: {}, chiefdom: {} }];
    const action = {
      type: BRANCH_TYPES.FETCH_BRANCH_LIST_SUCCESS,
      payload: { branches, totalCount: 1 }
    };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.branches).toEqual(branches);
    expect(state.totalCount).toBe(1);
    expect(state.error).toBeNull();
  });

  it('should handle FETCH_BRANCH_LIST_FAILURE', () => {
    const error = new Error('Fetch failed');
    const action = { type: BRANCH_TYPES.FETCH_BRANCH_LIST_FAILURE, error };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle CREATE_BRANCH_FAILURE', () => {
    const error = new Error('Create failed');
    const action = { type: BRANCH_TYPES.CREATE_BRANCH_FAILURE, error };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle UPDATE_BRANCH_FAILURE', () => {
    const error = new Error('Update failed');
    const action = { type: BRANCH_TYPES.UPDATE_BRANCH_FAILURE, error };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle CREATE_BRANCH_SUCCESS', () => {
    const action = { type: BRANCH_TYPES.CREATE_BRANCH_SUCCESS };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle UPDATE_BRANCH_SUCCESS', () => {
    const action = { type: BRANCH_TYPES.UPDATE_BRANCH_SUCCESS };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle CLEAR_BRANCH_LIST', () => {
    const stateWithData = {
      branches: [{ id: 1, name: 'Branch A', code: 'BR001', district: {}, chiefdom: {} }],
      loading: false,
      totalCount: 1,
      error: null
    };
    const action = { type: BRANCH_TYPES.CLEAR_BRANCH_LIST };
    const state = branchReducer(stateWithData as any, action as any);
    expect(state).toEqual(initialState);
    expect(state.branches).toEqual([]);
    expect(state.totalCount).toBe(0);
  });
});
