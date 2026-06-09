import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.district.loading;
const getDistrictList = (state: AppState) => state.district.districtList;
const getTaggedDistrictList = (state: AppState) => state.district?.taggedDistrictList ?? [];
const getTaggedDistrictTotal = (state: AppState) => state.district?.taggedDistrictTotal ?? 0;
const getLoadingTaggedDistricts = (state: AppState) => state.district?.loadingTaggedDistricts ?? false;
const getAllDistrictList = (state: AppState) => state.district.allDistricts;
const getDistrict = (state: AppState) => state.district.district;
const getDistrictOptions = (state: AppState) => state.district.districtOptions;
const getDistrictOptionsLoading = (state: AppState) => state.district.loadingOptions;

const getDistrictCount = (state: AppState) => state.district.total;
const getDistrictDashboardList = (state: AppState) => state.district.dashboardList;
const getLoadMore = (state: AppState) => state.district.loadingMore;
const getDistrictAdmins = (state: AppState) => state.district.admins;
const getClinicalWorkflows = (state: AppState) => state.district.clinicalWorkflows;
const getClinicalWorkflowsCount = (state: AppState) => state.district.clinicalWorkflowsCount;

export const districtLoadingSelector = createSelector(getLoading, (loading) => loading);

export const getDistrictListSelector = createSelector(getDistrictList, (districtList) => districtList);

export const getTaggedDistrictListSelector = createSelector(
  getTaggedDistrictList,
  (taggedDistrictList) => taggedDistrictList
);

export const taggedDistrictCountSelector = createSelector(
  getTaggedDistrictTotal,
  (taggedDistrictTotal) => taggedDistrictTotal
);

export const taggedDistrictLoadingSelector = createSelector(
  getLoadingTaggedDistricts,
  (loadingTaggedDistricts) => loadingTaggedDistricts
);

export const getAllDistrictListSelector = createSelector(getAllDistrictList, (districtList) => districtList);

export const districtCountSelector = createSelector(getDistrictCount, (districtCount) => districtCount);

export const districtSelector = createSelector(getDistrict, (district) => district);

export const districtDashboardListSelector = createSelector(getDistrictDashboardList, (dashboardList) => dashboardList);

export const districtDashboardLoadingMoreSelector = createSelector(getLoadMore, (loadingMore) => loadingMore);

export const districtOptionsSelector = createSelector(getDistrictOptions, (districtOptions) => districtOptions);

export const districtOptionsLoadingSelector = createSelector(
  getDistrictOptionsLoading,
  (districtOptionsLoading) => districtOptionsLoading
);
export const getDistrictAdminSelector = createSelector(getDistrictAdmins, (admins) => admins);

export const getClinicalWorkflowSelector = createSelector(getClinicalWorkflows, (workflows) => workflows);

export const getClinicalWorkflowsCountSelector = createSelector(getClinicalWorkflowsCount, (workflows) => workflows);
