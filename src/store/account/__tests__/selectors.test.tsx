import {
  accountsLoadingSelector,
  getAccountsSelector,
  accountsCountSelector,
  accountSelector,
  accDashboardListSelector,
  accDashboardLoadingMoreSelector,
  accountOptionsSelector,
  accountOptionsLoadingSelector,
  getAccountAdminSelector,
  getClinicalWorkflowSelector,
  getClinicalWorkflowsCountSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  account: mainInitialState
};

// Test accountsLoadingSelector
test('accountsLoadingSelector should return loading from state', () => {
  return expect(accountsLoadingSelector(initialState)).toEqual(initialState.account.loading);
});

// Test getAccountsSelector
test('getAccountsSelector should return loading from state', () => {
  return expect(getAccountsSelector(initialState)).toEqual(initialState.account.accounts);
});

// Test accountsCountSelector
test('accountsCountSelector should return loading from state', () => {
  return expect(accountsCountSelector(initialState)).toEqual(initialState.account.total);
});

// Test accountSelector
test('accountSelector should return loading from state', () => {
  return expect(accountSelector(initialState)).toEqual(initialState.account.account);
});

// Test accDashboardListSelector
test('accDashboardListSelector should return loading from state', () => {
  return expect(accDashboardListSelector(initialState)).toEqual(initialState.account.dashboardList);
});

// Test accDashboardLoadingMoreSelector
test('accDashboardLoadingMoreSelector should return loading from state', () => {
  return expect(accDashboardLoadingMoreSelector(initialState)).toEqual(initialState.account.loadingMore);
});

// Test accountOptionsSelector
test('accountOptionsSelector should return loading from state', () => {
  return expect(accountOptionsSelector(initialState)).toEqual(initialState.account.accountOptions);
});

// Test accountOptionsLoadingSelector
test('accountOptionsLoadingSelector should return loading from state', () => {
  return expect(accountOptionsLoadingSelector(initialState)).toEqual(initialState.account.loadingOptions);
});

// Test getAccountAdminSelector
test('getAccountAdminSelector should return loading from state', () => {
  return expect(getAccountAdminSelector(initialState)).toEqual(initialState.account.admins);
});

// Test getClinicalWorkflowSelector
test('getClinicalWorkflowSelector should return loading from state', () => {
  return expect(getClinicalWorkflowSelector(initialState)).toEqual(initialState.account.clinicalWorkflows);
});

// Test getClinicalWorkflowsCountSelector
test('getClinicalWorkflowsCountSelector should return loading from state', () => {
  return expect(getClinicalWorkflowsCountSelector(initialState)).toEqual(initialState.account.clinicalWorkflowsCount);
});
