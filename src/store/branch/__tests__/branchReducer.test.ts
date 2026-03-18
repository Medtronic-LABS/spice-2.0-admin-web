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

  it('should set loading to true for FETCH_BRANCH_SUMMARY_REQUEST', () => {
    const state = branchReducer(initialState, {
      type: BRANCH_TYPES.FETCH_BRANCH_SUMMARY_REQUEST,
      branchId: 1
    } as any);
    expect(state.loading).toBe(true);
  });

  it('should set loadingBranchesByUnion to true for FETCH_BRANCHES_BY_UNION_REQUEST', () => {
    const state = branchReducer(initialState, {
      type: BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST,
      unionIds: [1, 2]
    } as any);
    expect(state.loadingBranchesByUnion).toBe(true);
    expect(state.loading).toBe(false);
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

  it('should handle FETCH_BRANCH_SUMMARY_SUCCESS', () => {
    const branchSummary = {
      id: 1,
      name: 'Branch A',
      code: 'BR001',
      currentAccountCode: 'ACC001',
      district: { id: 1, name: 'District 1' },
      chiefdom: { id: 1, name: 'Chiefdom 1' }
    } as any;
    const action = { type: BRANCH_TYPES.FETCH_BRANCH_SUMMARY_SUCCESS, payload: branchSummary };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.branchSummary).toEqual(branchSummary);
    expect(state.error).toBeNull();
  });

  it('should handle FETCH_BRANCH_LIST_FAILURE', () => {
    const error = new Error('Fetch failed');
    const action = { type: BRANCH_TYPES.FETCH_BRANCH_LIST_FAILURE, error };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle FETCH_BRANCH_SUMMARY_FAILURE', () => {
    const error = new Error('Fetch summary failed');
    const action = { type: BRANCH_TYPES.FETCH_BRANCH_SUMMARY_FAILURE, error };
    const state = branchReducer({ ...initialState, loading: true }, action as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle FETCH_BRANCHES_BY_UNION_SUCCESS', () => {
    const branches = [{ id: 1, name: 'Branch A', code: 'BR001', district: {}, chiefdom: {} }];
    const action = { type: BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_SUCCESS, payload: branches };
    const state = branchReducer({ ...initialState, loadingBranchesByUnion: true }, action as any);
    expect(state.loadingBranchesByUnion).toBe(false);
    expect(state.branchesByUnion).toEqual(branches);
    expect(state.error).toBeNull();
  });

  it('should handle FETCH_BRANCHES_BY_UNION_FAILURE', () => {
    const error = new Error('Fetch branches by union failed');
    const action = { type: BRANCH_TYPES.FETCH_BRANCHES_BY_UNION_FAILURE, error };
    const state = branchReducer({ ...initialState, loadingBranchesByUnion: true }, action as any);
    expect(state.loadingBranchesByUnion).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should handle CLEAR_BRANCHES_BY_UNION', () => {
    const stateWithBranchesByUnion = {
      ...initialState,
      branchesByUnion: [{ id: 1, name: 'Branch A', code: 'BR001', district: {}, chiefdom: {} }] as any[]
    };
    const action = { type: BRANCH_TYPES.CLEAR_BRANCHES_BY_UNION };
    const state = branchReducer(stateWithBranchesByUnion, action as any);
    expect(state.branchesByUnion).toEqual([]);
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

  it('should handle SET_BRANCH_SUMMARY', () => {
    const data = { name: 'Branch A', id: 1 };
    const action = { type: BRANCH_TYPES.SET_BRANCH_SUMMARY, data };
    const state = branchReducer(initialState, action as any);
    expect(state.branchSummary).toEqual({ ...data });
  });

  it('should handle SET_BRANCH_SUMMARY merging with existing branchSummary', () => {
    const existingSummary = { id: 1, name: 'Old', code: 'BR001' } as any;
    const data = { name: 'Updated Name' };
    const action = { type: BRANCH_TYPES.SET_BRANCH_SUMMARY, data };
    const state = branchReducer({ ...initialState, branchSummary: existingSummary }, action as any);
    expect(state.branchSummary).toEqual({ id: 1, name: 'Updated Name', code: 'BR001' });
  });

  it('should handle CLEAR_BRANCH_SUMMARY', () => {
    const stateWithSummary = {
      ...initialState,
      branchSummary: { id: 1, name: 'Branch A', code: 'BR001', district: {}, chiefdom: {} } as any
    };
    const action = { type: BRANCH_TYPES.CLEAR_BRANCH_SUMMARY };
    const state = branchReducer(stateWithSummary, action as any);
    expect(state.branchSummary).toBeNull();
  });

  it('should handle CLEAR_BRANCH_LIST', () => {
    const stateWithData = {
      ...initialState,
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
