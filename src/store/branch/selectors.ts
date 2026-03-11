import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getBranches = (state: AppState) => state.branch.branches;
const getLoading = (state: AppState) => state.branch.loading;
const getTotalCount = (state: AppState) => state.branch.totalCount;
const getError = (state: AppState) => state.branch.error;

export const branchListSelector = createSelector(getBranches, (branches) => branches);

export const branchLoadingSelector = createSelector(getLoading, (loading) => loading);

export const branchTotalCountSelector = createSelector(getTotalCount, (totalCount) => totalCount);

export const branchErrorSelector = createSelector(getError, (error) => error);
