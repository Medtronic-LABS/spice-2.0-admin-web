import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getOperatingUnitDashboardList = (state: AppState) => state.subCounty.operatingUnitDashboardList;
const getOperatingUnitList = (state: AppState) => state.subCounty.operatingUnitList;
const getOperatingUnitCount = (state: AppState) => state.subCounty.total;
const getOperatingUnitListCount = (state: AppState) => state.subCounty.listTotal;
const getOperatingUnitLoading = (state: AppState) => state.subCounty.loading;
const getOperatingUnitLoadingMore = (state: AppState) => state.subCounty.loadingMore;
const getOperatingUnitDetail = (state: AppState) => state.subCounty.operatingUnitDetail;
const getOuAdmins = (state: AppState) => state.subCounty.admins;
const getOperatingUnitAdminList = (state: AppState) => state.subCounty.operatingUnitAdmins;
const getOperatingUnitForDropdown = (state: AppState) => state.subCounty.dropdownOUList;
const getOperatingUnitDropdownLoading = (state: AppState) => state.subCounty.dropdownOUListLoading;

export const operatingUnitDashboardListSelector = createSelector(
  getOperatingUnitDashboardList,
  (operatingUnitDashboardList) => operatingUnitDashboardList
);

export const operatingUnitListSelector = createSelector(getOperatingUnitList, (operatingUnitList) => operatingUnitList);

export const operatingUnitCountSelector = createSelector(
  getOperatingUnitCount,
  (operatingUnitCount) => operatingUnitCount
);
export const operatingUnitListCountSelector = createSelector(
  getOperatingUnitListCount,
  (operatingUnitListCount) => operatingUnitListCount
);

export const operatingUnitLoadingSelector = createSelector(
  getOperatingUnitLoading,
  (operatingUnitLoading) => operatingUnitLoading
);

export const operatingUnitLoadingMoreSelector = createSelector(
  getOperatingUnitLoadingMore,
  (operatingUnitLoadingMore) => operatingUnitLoadingMore
);

export const getOperatingUnitDetailSelector = createSelector(getOperatingUnitDetail, (detail) => detail);

export const getOuAdminsSelector = createSelector(getOuAdmins, (ouAdmins) => ouAdmins);
export const operatingUnitAdminListSelector = createSelector(
  getOperatingUnitAdminList,
  (operatingUnitAdminList) => operatingUnitAdminList
);
export const operatingUnitDropdownSelector = createSelector(
  getOperatingUnitForDropdown,
  (operatingUnitDropdown) => operatingUnitDropdown
);
export const operatingUnitDropdownLoadingSelector = createSelector(
  getOperatingUnitDropdownLoading,
  (operatingUnitDropdownLoading) => operatingUnitDropdownLoading
);
