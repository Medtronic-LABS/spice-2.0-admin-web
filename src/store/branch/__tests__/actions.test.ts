import * as branchActions from '../actions';
import * as BRANCH_TYPES from '../actionTypes';

describe('Branch actions', () => {
  it('fetchBranchListRequest should create an action with payload and callbacks', () => {
    const payload = {
      countryId: 1,
      limit: 10,
      skip: 0,
      searchTerm: '',
      districtIds: [],
      chiefdomIds: []
    };
    const successCb = jest.fn();
    const failureCb = jest.fn();
    const action = branchActions.fetchBranchListRequest({ payload, successCb, failureCb });
    expect(action.type).toBe(BRANCH_TYPES.FETCH_BRANCH_LIST_REQUEST);
    expect(action.payload).toEqual(payload);
    expect(action.successCb).toBe(successCb);
    expect(action.failureCb).toBe(failureCb);
  });

  it('fetchBranchListSuccess should create an action with payload', () => {
    const payload = { branches: [], totalCount: 0 };
    const action = branchActions.fetchBranchListSuccess(payload);
    expect(action.type).toBe(BRANCH_TYPES.FETCH_BRANCH_LIST_SUCCESS);
    expect(action.payload).toEqual(payload);
  });

  it('fetchBranchListFailure should create an action with error', () => {
    const error = new Error('Fetch failed');
    const action = branchActions.fetchBranchListFailure(error);
    expect(action.type).toBe(BRANCH_TYPES.FETCH_BRANCH_LIST_FAILURE);
    expect(action.error).toBe(error);
  });

  it('createBranchRequest should create an action with payload and callbacks', () => {
    const payload = {
      name: 'Branch A',
      code: 'BR001',
      currentAccountCode: 'ACC001',
      districtId: 1,
      chiefdomId: 1,
      skPositionCount: 0,
      ssPositionCount: 0,
      poPositionCount: 0,
      foPositionCount: 0
    };
    const successCb = jest.fn();
    const failureCb = jest.fn();
    const action = branchActions.createBranchRequest({ payload, successCb, failureCb });
    expect(action.type).toBe(BRANCH_TYPES.CREATE_BRANCH_REQUEST);
    expect(action.payload).toEqual(payload);
    expect(action.successCb).toBe(successCb);
    expect(action.failureCb).toBe(failureCb);
  });

  it('createBranchSuccess should create an action', () => {
    const action = branchActions.createBranchSuccess();
    expect(action.type).toBe(BRANCH_TYPES.CREATE_BRANCH_SUCCESS);
  });

  it('createBranchFailure should create an action with error', () => {
    const error = new Error('Create failed');
    const action = branchActions.createBranchFailure(error);
    expect(action.type).toBe(BRANCH_TYPES.CREATE_BRANCH_FAILURE);
    expect(action.error).toBe(error);
  });

  it('updateBranchRequest should create an action with payload and callbacks', () => {
    const payload = {
      id: 1,
      name: 'Branch A',
      code: 'BR001',
      currentAccountCode: 'ACC001',
      districtId: 1,
      chiefdomId: 1,
      skPositionCount: 0,
      ssPositionCount: 0,
      poPositionCount: 0,
      foPositionCount: 0
    };
    const successCb = jest.fn();
    const failureCb = jest.fn();
    const action = branchActions.updateBranchRequest({ payload, successCb, failureCb });
    expect(action.type).toBe(BRANCH_TYPES.UPDATE_BRANCH_REQUEST);
    expect(action.payload).toEqual(payload);
    expect(action.successCb).toBe(successCb);
    expect(action.failureCb).toBe(failureCb);
  });

  it('updateBranchSuccess should create an action', () => {
    const action = branchActions.updateBranchSuccess();
    expect(action.type).toBe(BRANCH_TYPES.UPDATE_BRANCH_SUCCESS);
  });

  it('updateBranchFailure should create an action with error', () => {
    const error = new Error('Update failed');
    const action = branchActions.updateBranchFailure(error);
    expect(action.type).toBe(BRANCH_TYPES.UPDATE_BRANCH_FAILURE);
    expect(action.error).toBe(error);
  });

  it('clearBranchList should create an action', () => {
    const action = branchActions.clearBranchList();
    expect(action.type).toBe(BRANCH_TYPES.CLEAR_BRANCH_LIST);
  });

  it('fetchBranchSummaryRequest should create an action with branchId and callbacks', () => {
    const successCb = jest.fn();
    const failureCb = jest.fn();
    const action = branchActions.fetchBranchSummaryRequest({
      branchId: 1,
      successCb,
      failureCb
    });
    expect(action.type).toBe(BRANCH_TYPES.FETCH_BRANCH_SUMMARY_REQUEST);
    expect(action.branchId).toBe(1);
    expect(action.successCb).toBe(successCb);
    expect(action.failureCb).toBe(failureCb);
  });

  it('fetchBranchSummarySuccess should create an action with payload', () => {
    const payload = {
      id: 1,
      name: 'Branch A',
      code: 'BR001',
      currentAccountCode: 'ACC001',
      district: { id: 1, name: 'District 1' },
      chiefdom: { id: 1, name: 'Chiefdom 1' }
    } as any;
    const action = branchActions.fetchBranchSummarySuccess(payload);
    expect(action.type).toBe(BRANCH_TYPES.FETCH_BRANCH_SUMMARY_SUCCESS);
    expect(action.payload).toEqual(payload);
  });

  it('fetchBranchSummaryFailure should create an action with error', () => {
    const error = new Error('Fetch summary failed');
    const action = branchActions.fetchBranchSummaryFailure(error);
    expect(action.type).toBe(BRANCH_TYPES.FETCH_BRANCH_SUMMARY_FAILURE);
    expect(action.error).toBe(error);
  });

  it('setBranchSummary should create an action with data', () => {
    const data = { name: 'Branch A', id: 1 };
    const action = branchActions.setBranchSummary(data);
    expect(action.type).toBe(BRANCH_TYPES.SET_BRANCH_SUMMARY);
    expect(action.data).toEqual(data);
  });

  it('clearBranchSummary should create an action', () => {
    const action = branchActions.clearBranchSummary();
    expect(action.type).toBe(BRANCH_TYPES.CLEAR_BRANCH_SUMMARY);
  });
});
