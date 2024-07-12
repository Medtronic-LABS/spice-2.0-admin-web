import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getSite = (state: AppState) => state.healthFacilityDashboardReducer.site;
const getLoading = (state: AppState) => state.healthFacilityDashboardReducer.loading;
const getTotal = (state: AppState) => state.healthFacilityDashboardReducer.total;
const getSiteListDetails = (state: AppState) => state.healthFacilityDashboardReducer.siteList;
const getSiteUserList = (state: AppState) => state.healthFacilityDashboardReducer.siteUserList;
const getSiteCountyDropdown = (state: AppState) => state.healthFacilityDashboardReducer.countyList;
const getSubCountyDropdown = (state: AppState) => state.healthFacilityDashboardReducer.subCountyList;
const getCultureDropdown = (state: AppState) => state.healthFacilityDashboardReducer.cultureList;
const getSiteCountyDropdownLoading = (state: AppState) => state.healthFacilityDashboardReducer.countyDropdownLoading;
const getSubCountyDropdownLoading = (state: AppState) => state.healthFacilityDashboardReducer.subCountyDropdownLoading;
const getCultureDropdownLoading = (state: AppState) => state.healthFacilityDashboardReducer.cultureListLoading;
const getLoadingMore = (state: AppState) => state.healthFacilityDashboardReducer.loadingMore;
const getSiteDashboardList = (state: AppState) => state.healthFacilityDashboardReducer.siteDashboardList;
const getSiteListDropdown = (state: AppState) => state.healthFacilityDashboardReducer.siteDropdownOptions;
const getSiteListDropdownLoading = (state: AppState) => state.healthFacilityDashboardReducer.siteDropdownLoading;

export const siteSelector = createSelector(getSite, (healthFacilityDashboardReducer) => healthFacilityDashboardReducer);
export const siteLoadingSelector = createSelector(getLoading, (loading) => loading);
export const siteListTotalSelector = createSelector(getTotal, (total) => total);
export const siteListSelector = createSelector(getSiteListDetails, (siteList) => siteList);
export const siteUserListSelector = createSelector(getSiteUserList, (siteUserList) => siteUserList);
export const siteCountyDropdownSelector = createSelector(getSiteCountyDropdown, (countyList) => countyList);
export const subCountyDropdownSelector = createSelector(getSubCountyDropdown, (subCountyList) => subCountyList);
export const cultureDropdownSelector = createSelector(getCultureDropdown, (cultureList) => cultureList);
export const siteCountyDropdownLoadingSelector = createSelector(getSiteCountyDropdownLoading, (loading) => loading);
export const subCountyDropdownLoadingSelector = createSelector(getSubCountyDropdownLoading, (loading) => loading);
export const cultureDropdownLoadingSelector = createSelector(getCultureDropdownLoading, (loading) => loading);
export const siteDashboardListSelector = createSelector(getSiteDashboardList, (siteDashboardList) => siteDashboardList);
export const siteLoadingMoreSelector = createSelector(getLoadingMore, (loadingMore) => loadingMore);
export const siteListDropdownSelector = createSelector(getSiteListDropdown, (siteListDropdown) => siteListDropdown);
export const siteListDropdownLoadingSelector = createSelector(
  getSiteListDropdownLoading,
  (siteListDropdownLoading) => siteListDropdownLoading
);
