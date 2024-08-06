import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.county.loading;
const getCountyList = (state: AppState) => state.county.countyList;
const getCounty = (state: AppState) => state.county.county;
const getCountyOptions = (state: AppState) => state.county.countyOptions;
const getCountyOptionsLoading = (state: AppState) => state.county.loadingOptions;

const getCountyCount = (state: AppState) => state.county.total;
const getCountyDashboardList = (state: AppState) => state.county.dashboardList;
const getLoadMore = (state: AppState) => state.county.loadingMore;
const getCountyAdmins = (state: AppState) => state.county.admins;
const getClinicalWorkflows = (state: AppState) => state.county.clinicalWorkflows;
const getClinicalWorkflowsCount = (state: AppState) => state.county.clinicalWorkflowsCount;

export const countyLoadingSelector = createSelector(getLoading, (loading) => loading);

export const getCountyListSelector = createSelector(getCountyList, (countyList) => countyList);

export const countyCountSelector = createSelector(getCountyCount, (countyCount) => countyCount);

export const countySelector = createSelector(getCounty, (county) => county);

export const countyDashboardListSelector = createSelector(getCountyDashboardList, (dashboardList) => dashboardList);

export const countyDashboardLoadingMoreSelector = createSelector(getLoadMore, (loadingMore) => loadingMore);

export const countyOptionsSelector = createSelector(getCountyOptions, (countyOptions) => countyOptions);

export const countyOptionsLoadingSelector = createSelector(
  getCountyOptionsLoading,
  (countyOptionsLoading) => countyOptionsLoading
);
export const getCountyAdminSelector = createSelector(getCountyAdmins, (admins) => admins);

export const getClinicalWorkflowSelector = createSelector(getClinicalWorkflows, (workflows) => workflows);

export const getClinicalWorkflowsCountSelector = createSelector(getClinicalWorkflowsCount, (workflows) => workflows);
