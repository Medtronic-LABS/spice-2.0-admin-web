import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getHealthFacility = (state: AppState) => (state.healthFacility as any).healthFacility;
const getLoading = (state: AppState) => (state.healthFacility as any).loading;
const getHFTypes = (state: AppState) => (state.healthFacility as any).hfTypes;
const getHFTYpesLoading = (state: AppState) => (state.healthFacility as any).hfTypesLoading;
const getHFTotal = (state: AppState) => (state.healthFacility as any).hfTotal;
const getHFListDetails = (state: AppState) => (state.healthFacility as any).healthFacilityList;
const getHFUserList = (state: AppState) => (state.healthFacility as any).healthFacilityUserList;
const getHFUsersTotal = (state: AppState) => (state.healthFacility as any).hfUsersTotal;
const getHFUserLoading = (state: AppState) => (state.healthFacility as any).hfUsersLoading;
const getDistrictList = (state: AppState) => (state.healthFacility as any).districtList;
const getDistrictTotal = (state: AppState) => (state.healthFacility as any).districtTotal;
const getDistrictLoading = (state: AppState) => (state.healthFacility as any).districtLoading;
const getChiefdomList = (state: AppState) => (state.healthFacility as any).chiefdomList;
const getChiefdomTotal = (state: AppState) => (state.healthFacility as any).chiefdomTotal;
const getChiefdomLoading = (state: AppState) => (state.healthFacility as any).chiefdomLoading;
const getVillagesList = (state: AppState) => (state.healthFacility as any).villagesList;
const getVillagesTotal = (state: AppState) => (state.healthFacility as any).villagesTotal;
const getVillagesLoading = (state: AppState) => (state.healthFacility as any).villagesLoading;
const getPeerSupervisorList = (state: AppState) => (state.healthFacility as any).peerSupervisorList;
const getPeerSupervisorTotal = (state: AppState) => (state.healthFacility as any).peerSupervisorTotal;
const getPeerSupervisorLoading = (state: AppState) => (state.healthFacility as any).peerSupervisorLoading;
const getWorkflowList = (state: AppState) => (state.healthFacility as any).clinicalWorkflowList;
const getWorkflowLoading = (state: AppState) => (state.healthFacility as any).clinicalWorkflowLoading;

export const healthFacilitySelector = createSelector(getHealthFacility, (site) => site);
export const healthFacilityLoadingSelector = createSelector(getLoading, (loading) => loading);
export const hfTypesSelector = createSelector(getHFTypes, (types) => types);
export const hfTypesLoadingSelector = createSelector(getHFTYpesLoading, (loading) => loading);
export const healthFacilityListTotalSelector = createSelector(getHFTotal, (total) => total);
export const healthFacilityListSelector = createSelector(getHFListDetails, (siteList) => siteList);
export const healthFacilityUserListSelector = createSelector(getHFUserList, (siteUserList) => siteUserList);
export const healthFacilityListUsersTotalSelector = createSelector(getHFUsersTotal, (total) => total);
export const healthFacilityUsersLoadingSelector = createSelector(getHFUserLoading, (hfUsersLoading) => hfUsersLoading);

export const districtListSelector = createSelector(getDistrictList, (districtList) => districtList);
export const districtTotalSelector = createSelector(getDistrictTotal, (districtTotal) => districtTotal);
export const districtLoadingSelector = createSelector(getDistrictLoading, (districtLoading) => districtLoading);
export const chiefdomListSelector = createSelector(getChiefdomList, (chiefdomList) => chiefdomList);
export const chiefdomTotalSelector = createSelector(getChiefdomTotal, (chiefdomTotal) => chiefdomTotal);
export const chiefdomLoadingSelector = createSelector(getChiefdomLoading, (chiefdomLoading) => chiefdomLoading);
export const villagesListSelector = createSelector(getVillagesList, (villagesList) => villagesList);
export const villagesTotalSelector = createSelector(getVillagesTotal, (villagesTotal) => villagesTotal);
export const villagesLoadingSelector = createSelector(getVillagesLoading, (villagesLoading) => villagesLoading);
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
