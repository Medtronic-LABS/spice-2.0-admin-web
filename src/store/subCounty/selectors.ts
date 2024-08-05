import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getSubCountyDashboardList = (state: AppState) => state.subCounty.subCountyDashboardList;
const getSubCountyList = (state: AppState) => state.subCounty.subCountyList;
const getSubCountyCount = (state: AppState) => state.subCounty.total;
const getSubCountyListCount = (state: AppState) => state.subCounty.listTotal;
const getSubCountyLoading = (state: AppState) => state.subCounty.loading;
const getSubCountyLoadingMore = (state: AppState) => state.subCounty.loadingMore;
const getSubCountyDetail = (state: AppState) => state.subCounty.subCountyDetail;
const getOuAdmins = (state: AppState) => state.subCounty.admins;
const getSubCountyAdminList = (state: AppState) => state.subCounty.subCountyAdmins;
const getSubCountyForDropdown = (state: AppState) => state.subCounty.dropdownSubCountyList;
const getSubCountyDropdownLoading = (state: AppState) => state.subCounty.dropdownSubCountyListLoading;

export const subCountyDashboardListSelector = createSelector(
  getSubCountyDashboardList,
  (subCountyDashboardList) => subCountyDashboardList
);

export const subCountyListSelector = createSelector(getSubCountyList, (subCountyList) => subCountyList);

export const subCountyCountSelector = createSelector(
  getSubCountyCount,
  (subCountyCount) => subCountyCount
);
export const subCountyListCountSelector = createSelector(
  getSubCountyListCount,
  (subCountyListCount) => subCountyListCount
);

export const subCountyLoadingSelector = createSelector(
  getSubCountyLoading,
  (subCountyLoading) => subCountyLoading
);

export const subCountyLoadingMoreSelector = createSelector(
  getSubCountyLoadingMore,
  (subCountyLoadingMore) => subCountyLoadingMore
);

export const getSubCountyDetailSelector = createSelector(getSubCountyDetail, (detail) => detail);

export const getOuAdminsSelector = createSelector(getOuAdmins, (ouAdmins) => ouAdmins);
export const subCountyAdminListSelector = createSelector(
  getSubCountyAdminList,
  (subCountyAdminList) => subCountyAdminList
);
export const subCountyDropdownSelector = createSelector(
  getSubCountyForDropdown,
  (subCountyDropdown) => subCountyDropdown
);
export const subCountyDropdownLoadingSelector = createSelector(
  getSubCountyDropdownLoading,
  (subCountyDropdownLoading) => subCountyDropdownLoading
);
