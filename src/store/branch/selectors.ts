import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getBranches = (state: AppState) => state.branch.branches;
const getBranchesByUnion = (state: AppState) => state.branch.branchesByUnion;
const getLoading = (state: AppState) => state.branch.loading;
const getLoadingBranchesByUnion = (state: AppState) => state.branch.loadingBranchesByUnion;
const getTotalCount = (state: AppState) => state.branch.totalCount;
const getError = (state: AppState) => state.branch.error;
const getBranchSummary = (state: AppState) => state.branch.branchSummary;

export const branchListSelector = createSelector(getBranches, (branches) => branches);

export const branchesByUnionSelector = createSelector(getBranchesByUnion, (branchesByUnion) => branchesByUnion);

export const branchLoadingSelector = createSelector(getLoading, (loading) => loading);

export const branchLoadingByUnionSelector = createSelector(
  getLoadingBranchesByUnion,
  (loadingBranchesByUnion) => loadingBranchesByUnion
);

export const branchTotalCountSelector = createSelector(getTotalCount, (totalCount) => totalCount);

export const branchErrorSelector = createSelector(getError, (error) => error);

export const branchSummarySelector = createSelector(getBranchSummary, (branchSummary) => branchSummary);
