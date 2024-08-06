import {
  countyLoadingSelector,
  getCountyListSelector,
  countyCountSelector,
  countySelector,
  countyDashboardListSelector,
  countyDashboardLoadingMoreSelector,
  countyOptionsSelector,
  countyOptionsLoadingSelector,
  getCountyAdminSelector,
  getClinicalWorkflowSelector,
  getClinicalWorkflowsCountSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  county: mainInitialState
};

// Test countyLoadingSelector
test('countyLoadingSelector should return loading from state', () => {
  return expect(countyLoadingSelector(initialState)).toEqual(initialState.county.loading);
});

// Test getCountyListSelector
test('getCountyListSelector should return loading from state', () => {
  return expect(getCountyListSelector(initialState)).toEqual(initialState.county.countyList);
});

// Test countyCountSelector
test('countyCountSelector should return loading from state', () => {
  return expect(countyCountSelector(initialState)).toEqual(initialState.county.total);
});

// Test countySelector
test('countySelector should return loading from state', () => {
  return expect(countySelector(initialState)).toEqual(initialState.county.county);
});

// Test countyDashboardListSelector
test('countyDashboardListSelector should return loading from state', () => {
  return expect(countyDashboardListSelector(initialState)).toEqual(initialState.county.dashboardList);
});

// Test countyDashboardLoadingMoreSelector
test('countyDashboardLoadingMoreSelector should return loading from state', () => {
  return expect(countyDashboardLoadingMoreSelector(initialState)).toEqual(initialState.county.loadingMore);
});

// Test countyOptionsSelector
test('countyOptionsSelector should return loading from state', () => {
  return expect(countyOptionsSelector(initialState)).toEqual(initialState.county.countyOptions);
});

// Test countyOptionsLoadingSelector
test('countyOptionsLoadingSelector should return loading from state', () => {
  return expect(countyOptionsLoadingSelector(initialState)).toEqual(initialState.county.loadingOptions);
});

// Test getCountyAdminSelector
test('getCountyAdminSelector should return loading from state', () => {
  return expect(getCountyAdminSelector(initialState)).toEqual(initialState.county.admins);
});

// Test getClinicalWorkflowSelector
test('getClinicalWorkflowSelector should return loading from state', () => {
  return expect(getClinicalWorkflowSelector(initialState)).toEqual(initialState.county.clinicalWorkflows);
});

// Test getClinicalWorkflowsCountSelector
test('getClinicalWorkflowsCountSelector should return loading from state', () => {
  return expect(getClinicalWorkflowsCountSelector(initialState)).toEqual(initialState.county.clinicalWorkflowsCount);
});
