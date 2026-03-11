import {
  branchListSelector,
  branchLoadingSelector,
  branchTotalCountSelector,
  branchErrorSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  branch: mainInitialState
};

test('branchListSelector should return branches from state', () => {
  expect(branchListSelector(initialState)).toEqual(initialState.branch.branches);
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
