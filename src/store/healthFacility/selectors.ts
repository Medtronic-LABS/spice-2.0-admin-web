import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getHealthFacility = (state: AppState) => state.healthFacility.healthFacility;
const getLoading = (state: AppState) => state.healthFacility.loading;
const getHFTypes = (state: AppState) => state.healthFacility.hfTypes;
const getHFTYpesLoading = (state: AppState) => state.healthFacility.hfTypesLoading;
const getHFTotal = (state: AppState) => state.healthFacility.hfTotal;
const getHFListDetails = (state: AppState) => state.healthFacility.healthFacilityList;
const getHFUserList = (state: AppState) => state.healthFacility.healthFacilityUserList;
const getHFUsersTotal = (state: AppState) => state.healthFacility.hfUsersTotal;
const getHFUserLoading = (state: AppState) => state.healthFacility.hfUsersLoading;
const getHFUserDetail = (state: AppState) => state.healthFacility.hfUser;
const getHFUserDetailLoading = (state: AppState) => state.healthFacility.hfUserDetailLoading;
const getDistrictList = (state: AppState) => state.healthFacility.districtList;
const getDistrictTotal = (state: AppState) => state.healthFacility.districtTotal;
const getDistrictLoading = (state: AppState) => state.healthFacility.districtLoading;
const getChiefdomList = (state: AppState) => state.healthFacility.chiefdomList;
const getChiefdomTotal = (state: AppState) => state.healthFacility.chiefdomTotal;
const getChiefdomLoading = (state: AppState) => state.healthFacility.chiefdomLoading;
const getVillagesList = (state: AppState) => state.healthFacility.villagesList;
const getVillagesLoading = (state: AppState) => state.healthFacility.villagesLoading;
const getVillagesFromHFList = (state: AppState) => state.healthFacility.villagesFromHFList;
const getVillagesFromHFLoading = (state: AppState) => state.healthFacility.villagesFromHFLoading;
const getVillagesTotal = (state: AppState) => state.healthFacility.villagesTotal;
const getPeerSupervisorList = (state: AppState) => state.healthFacility.peerSupervisorList;
const getPeerSupervisorTotal = (state: AppState) => state.healthFacility.peerSupervisorTotal;
const getPeerSupervisorLoading = (state: AppState) => state.healthFacility.peerSupervisorLoading;
const getWorkflowList = (state: AppState) => state.healthFacility.clinicalWorkflowList;
const getWorkflowLoading = (state: AppState) => state.healthFacility.clinicalWorkflowLoading;

export const healthFacilitySelector = createSelector(getHealthFacility, (site) => site);
export const healthFacilityLoadingSelector = createSelector(getLoading, (loading) => loading);
export const hfTypesSelector = createSelector(getHFTypes, (types) => types);
export const hfTypesLoadingSelector = createSelector(getHFTYpesLoading, (loading) => loading);
export const healthFacilityListTotalSelector = createSelector(getHFTotal, (total) => total);
export const healthFacilityListSelector = createSelector(getHFListDetails, (siteList) => siteList);
export const healthFacilityUserListSelector = createSelector(getHFUserList, (siteUserList) => siteUserList);
export const healthFacilityUsersLoadingSelector = createSelector(getHFUserLoading, (hfUsersLoading) => hfUsersLoading);
export const healthFacilityListUsersTotalSelector = createSelector(getHFUsersTotal, (total) => total);
export const userDetailSelector = createSelector(getHFUserDetail, (user) => user);
export const userDetailLoadingSelector = createSelector(getHFUserDetailLoading, (userLoading) => userLoading);

export const districtListSelector = createSelector(getDistrictList, (districtList) => districtList);
export const districtTotalSelector = createSelector(getDistrictTotal, (districtTotal) => districtTotal);
export const districtLoadingSelector = createSelector(getDistrictLoading, (districtLoading) => districtLoading);
export const chiefdomListSelector = createSelector(getChiefdomList, (chiefdomList) => chiefdomList);
export const chiefdomTotalSelector = createSelector(getChiefdomTotal, (chiefdomTotal) => chiefdomTotal);
export const chiefdomLoadingSelector = createSelector(getChiefdomLoading, (chiefdomLoading) => chiefdomLoading);
export const villagesListSelector = createSelector(getVillagesList, (villagesList) => villagesList);
export const villagesLoadingSelector = createSelector(getVillagesLoading, (villagesLoading) => villagesLoading);
export const villagesFromHFListSelector = createSelector(getVillagesFromHFList, (villagesList) => villagesList);
export const villagesFromHFLoadingSelector = createSelector(
  getVillagesFromHFLoading,
  (villagesLoading) => villagesLoading
);
export const villagesTotalSelector = createSelector(getVillagesTotal, (villagesTotal) => villagesTotal);
export const peerSupervisorListSelector = createSelector(
  getPeerSupervisorList,
  (peerSupervisorList) => peerSupervisorList
);
export const peerSupervisorTotalSelector = createSelector(
  getPeerSupervisorTotal,
  (peerSupervisorTotal) => peerSupervisorTotal
);
export const peerSupervisorLoadingSelector = createSelector(
  getPeerSupervisorLoading,
  (peerSupervisorLoading) => peerSupervisorLoading
);
export const workflowListSelector = createSelector(getWorkflowList, (workflowList) => workflowList);
export const workflowLoadingSelector = createSelector(getWorkflowLoading, (workflowLoading) => workflowLoading);
