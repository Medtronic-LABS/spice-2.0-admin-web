import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getChiefdomDashboardList = (state: AppState) => state.chiefdom.chiefdomDashboardList;
const getChiefdomList = (state: AppState) => state.chiefdom.chiefdomList;
const getTaggedChiefdomList = (state: AppState) => state.chiefdom?.taggedChiefdomList ?? [];
const getTaggedChiefdomTotal = (state: AppState) => state.chiefdom?.taggedChiefdomTotal ?? 0;
const getLoadingTaggedChiefdoms = (state: AppState) => state.chiefdom?.loadingTaggedChiefdoms ?? false;
const getAllChiefdoms = (state: AppState) => state.chiefdom.allChiefdoms;
const getChiefdomCount = (state: AppState) => state.chiefdom.total;
const getChiefdomListCount = (state: AppState) => state.chiefdom.listTotal;
const getChiefdomLoading = (state: AppState) => state.chiefdom.loading;
const getChiefdomLoadingMore = (state: AppState) => state.chiefdom.loadingMore;
const getChiefdomDetail = (state: AppState) => state.chiefdom.chiefdomDetail;
const getOuAdmins = (state: AppState) => state.chiefdom.admins;
const getChiefdomAdminList = (state: AppState) => state.chiefdom.chiefdomAdmins;
const getChiefdomForDropdown = (state: AppState) => state.chiefdom.dropdownChiefdomList;
const getChiefdomDropdownLoading = (state: AppState) => state.chiefdom.dropdownChiefdomListLoading;

export const chiefdomDashboardListSelector = createSelector(
  getChiefdomDashboardList,
  (chiefdomDashboardList) => chiefdomDashboardList
);

export const chiefdomListSelector = createSelector(getChiefdomList, (chiefdomList) => chiefdomList);

export const getTaggedChiefdomListSelector = createSelector(
  getTaggedChiefdomList,
  (taggedChiefdomList) => taggedChiefdomList
);

export const taggedChiefdomCountSelector = createSelector(
  getTaggedChiefdomTotal,
  (taggedChiefdomTotal) => taggedChiefdomTotal
);

export const taggedChiefdomLoadingSelector = createSelector(
  getLoadingTaggedChiefdoms,
  (loadingTaggedChiefdoms) => loadingTaggedChiefdoms
);

export const getAllChiefdomsSelector = createSelector(getAllChiefdoms, (chiefdomList) => chiefdomList);

export const chiefdomCountSelector = createSelector(getChiefdomCount, (chiefdomCount) => chiefdomCount);
export const chiefdomListCountSelector = createSelector(getChiefdomListCount, (chiefdomListCount) => chiefdomListCount);

export const chiefdomLoadingSelector = createSelector(getChiefdomLoading, (chiefdomLoading) => chiefdomLoading);

export const chiefdomLoadingMoreSelector = createSelector(
  getChiefdomLoadingMore,
  (chiefdomLoadingMore) => chiefdomLoadingMore
);

export const getChiefdomDetailSelector = createSelector(getChiefdomDetail, (detail) => detail);

export const getOuAdminsSelector = createSelector(getOuAdmins, (ouAdmins) => ouAdmins);
export const chiefdomAdminListSelector = createSelector(getChiefdomAdminList, (chiefdomAdminList) => chiefdomAdminList);
export const chiefdomDropdownSelector = createSelector(getChiefdomForDropdown, (chiefdomDropdown) => chiefdomDropdown);
export const chiefdomDropdownLoadingSelector = createSelector(
  getChiefdomDropdownLoading,
  (chiefdomDropdownLoading) => chiefdomDropdownLoading
);
