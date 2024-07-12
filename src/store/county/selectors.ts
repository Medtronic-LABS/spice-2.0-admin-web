import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.county.loading;
const getAccounts = (state: AppState) => state.county.accounts;
const getAccount = (state: AppState) => state.county.account;
const getAccountOptions = (state: AppState) => state.county.accountOptions;
const getAccountOptionsLoading = (state: AppState) => state.county.loadingOptions;

const getAccountsCount = (state: AppState) => state.county.total;
const getAccountDashboardList = (state: AppState) => state.county.dashboardList;
const getLoadMore = (state: AppState) => state.county.loadingMore;
const getAccountAdmins = (state: AppState) => state.county.admins;
const getClinicalWorkflows = (state: AppState) => state.county.clinicalWorkflows;
const getClinicalWorkflowsCount = (state: AppState) => state.county.clinicalWorkflowsCount;

export const accountsLoadingSelector = createSelector(getLoading, (loading) => loading);

export const getAccountsSelector = createSelector(getAccounts, (accounts) => accounts);

export const accountsCountSelector = createSelector(getAccountsCount, (accountCount) => accountCount);

export const accountSelector = createSelector(getAccount, (county) => county);

export const accDashboardListSelector = createSelector(getAccountDashboardList, (dashboardList) => dashboardList);

export const accDashboardLoadingMoreSelector = createSelector(getLoadMore, (loadingMore) => loadingMore);

export const accountOptionsSelector = createSelector(getAccountOptions, (accountOptions) => accountOptions);

export const accountOptionsLoadingSelector = createSelector(
  getAccountOptionsLoading,
  (accountOptionsLoading) => accountOptionsLoading
);
export const getAccountAdminSelector = createSelector(getAccountAdmins, (admins) => admins);

export const getClinicalWorkflowSelector = createSelector(getClinicalWorkflows, (workflows) => workflows);

export const getClinicalWorkflowsCountSelector = createSelector(getClinicalWorkflowsCount, (workflows) => workflows);
