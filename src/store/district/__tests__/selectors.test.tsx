import {
  districtLoadingSelector,
  getDistrictListSelector,
  getTaggedDistrictListSelector,
  taggedDistrictCountSelector,
  taggedDistrictLoadingSelector,
  districtCountSelector,
  districtSelector,
  districtDashboardListSelector,
  districtDashboardLoadingMoreSelector,
  districtOptionsSelector,
  districtOptionsLoadingSelector,
  getDistrictAdminSelector,
  getClinicalWorkflowSelector,
  getClinicalWorkflowsCountSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  district: mainInitialState
};

// Test districtLoadingSelector
test('districtLoadingSelector should return loading from state', () => {
  return expect(districtLoadingSelector(initialState)).toEqual(initialState.district.loading);
});

// Test getDistrictListSelector
test('getDistrictListSelector should return loading from state', () => {
  return expect(getDistrictListSelector(initialState)).toEqual(initialState.district.districtList);
});

test('getTaggedDistrictListSelector should return taggedDistrictList from state', () => {
  return expect(getTaggedDistrictListSelector(initialState)).toEqual(initialState.district.taggedDistrictList);
});

test('taggedDistrictCountSelector should return taggedDistrictTotal from state', () => {
  return expect(taggedDistrictCountSelector(initialState)).toEqual(initialState.district.taggedDistrictTotal);
});

test('taggedDistrictLoadingSelector should return loadingTaggedDistricts from state', () => {
  return expect(taggedDistrictLoadingSelector(initialState)).toEqual(initialState.district.loadingTaggedDistricts);
});

// Test districtCountSelector
test('districtCountSelector should return loading from state', () => {
  return expect(districtCountSelector(initialState)).toEqual(initialState.district.total);
});

// Test districtSelector
test('districtSelector should return loading from state', () => {
  return expect(districtSelector(initialState)).toEqual(initialState.district.district);
});

// Test districtDashboardListSelector
test('districtDashboardListSelector should return loading from state', () => {
  return expect(districtDashboardListSelector(initialState)).toEqual(initialState.district.dashboardList);
});

// Test districtDashboardLoadingMoreSelector
test('districtDashboardLoadingMoreSelector should return loading from state', () => {
  return expect(districtDashboardLoadingMoreSelector(initialState)).toEqual(initialState.district.loadingMore);
});

// Test districtOptionsSelector
test('districtOptionsSelector should return loading from state', () => {
  return expect(districtOptionsSelector(initialState)).toEqual(initialState.district.districtOptions);
});

// Test districtOptionsLoadingSelector
test('districtOptionsLoadingSelector should return loading from state', () => {
  return expect(districtOptionsLoadingSelector(initialState)).toEqual(initialState.district.loadingOptions);
});

// Test getDistrictAdminSelector
test('getDistrictAdminSelector should return loading from state', () => {
  return expect(getDistrictAdminSelector(initialState)).toEqual(initialState.district.admins);
});

// Test getClinicalWorkflowSelector
test('getClinicalWorkflowSelector should return loading from state', () => {
  return expect(getClinicalWorkflowSelector(initialState)).toEqual(initialState.district.clinicalWorkflows);
});

// Test getClinicalWorkflowsCountSelector
test('getClinicalWorkflowsCountSelector should return loading from state', () => {
  return expect(getClinicalWorkflowsCountSelector(initialState)).toEqual(initialState.district.clinicalWorkflowsCount);
});
