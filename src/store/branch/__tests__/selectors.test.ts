import {
  branchListSelector,
  branchesByUnionSelector,
  branchLoadingSelector,
  branchTotalCountSelector,
  branchErrorSelector,
  branchSummarySelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  branch: mainInitialState
};

test('branchListSelector should return branches from state', () => {
  expect(branchListSelector(initialState)).toEqual(initialState.branch.branches);
});

test('branchesByUnionSelector should return branchesByUnion from state', () => {
  expect(branchesByUnionSelector(initialState)).toEqual(initialState.branch.branchesByUnion);
});

test('branchesByUnionSelector should return updated branches when state changes', () => {
  const stateWithBranchesByUnion = {
    branch: {
      ...mainInitialState,
      branchesByUnion: [{ id: 1, name: 'Branch A', code: 'BR001' }]
    }
  };
  expect(branchesByUnionSelector(stateWithBranchesByUnion)).toHaveLength(1);
  expect(branchesByUnionSelector(stateWithBranchesByUnion)[0].name).toBe('Branch A');
});

test('branchLoadingSelector should return loading from state', () => {
  expect(branchLoadingSelector(initialState)).toEqual(initialState.branch.loading);
});

test('branchTotalCountSelector should return totalCount from state', () => {
  expect(branchTotalCountSelector(initialState)).toEqual(initialState.branch.totalCount);
});

test('branchErrorSelector should return error from state', () => {
  expect(branchErrorSelector(initialState)).toEqual(initialState.branch.error);
});

test('branchListSelector should return updated branches when state changes', () => {
  const stateWithBranches = {
    branch: {
      ...mainInitialState,
      branches: [{ id: 1, name: 'Branch A', code: 'BR001' }]
    }
  };
  expect(branchListSelector(stateWithBranches)).toHaveLength(1);
  expect(branchListSelector(stateWithBranches)[0].name).toBe('Branch A');
});

test('branchLoadingSelector should return true when loading', () => {
  const loadingState = { branch: { ...mainInitialState, loading: true } };
  expect(branchLoadingSelector(loadingState)).toBe(true);
});

test('branchErrorSelector should return error when present', () => {
  const error = new Error('Test error');
  const errorState = { branch: { ...mainInitialState, error } };
  expect(branchErrorSelector(errorState)).toBe(error);
});

test('branchSummarySelector should return branchSummary from state', () => {
  expect(branchSummarySelector(initialState)).toEqual(initialState.branch.branchSummary);
});

test('branchSummarySelector should return branch summary when set', () => {
  const branchSummary = {
    id: 1,
    name: 'Branch A',
    code: 'BR001',
    currentAccountCode: 'ACC001',
    district: { id: 1, name: 'District 1' },
    chiefdom: { id: 1, name: 'Chiefdom 1' }
  };
  const stateWithSummary = { branch: { ...mainInitialState, branchSummary } };
  expect(branchSummarySelector(stateWithSummary)).toEqual(branchSummary);
});
