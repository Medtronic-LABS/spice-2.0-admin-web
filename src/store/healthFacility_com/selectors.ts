import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getHealthFacility = (state: AppState) => state.healthFacilityCom.healthFacility;
const getLoading = (state: AppState) => state.healthFacilityCom.loading;
const getInsightHealthFacility = (state: AppState) => state.healthFacilityCom.insightHealthFacilityList;
const getInsightHFLoading = (state: AppState) => state.healthFacilityCom.insightHFLoading;
const getHFTypes = (state: AppState) => state.healthFacilityCom.hfTypes;
const getHFTYpesLoading = (state: AppState) => state.healthFacilityCom.hfTypesLoading;
const getHFTotal = (state: AppState) => state.healthFacilityCom.hfTotal;
const getHFListDetails = (state: AppState) => state.healthFacilityCom.healthFacilityList;
const getHFUserList = (state: AppState) => state.healthFacilityCom.healthFacilityUserList;
const getHFUsersTotal = (state: AppState) => state.healthFacilityCom.hfUsersTotal;
const getHFUserLoading = (state: AppState) => state.healthFacilityCom.hfUsersLoading;
const getHFUserDetail = (state: AppState) => state.healthFacilityCom.hfUser;
const getHFUserDetailLoading = (state: AppState) => state.healthFacilityCom.hfUserDetailLoading;
const getDistrictList = (state: AppState) => state.healthFacilityCom.districtList;
const getDistrictTotal = (state: AppState) => state.healthFacilityCom.districtTotal;
const getDistrictLoading = (state: AppState) => state.healthFacilityCom.districtLoading;
const getChiefdomList = (state: AppState) => state.healthFacilityCom.chiefdomList;
const getChiefdomTotal = (state: AppState) => state.healthFacilityCom.chiefdomTotal;
const getChiefdomLoading = (state: AppState) => state.healthFacilityCom.chiefdomLoading;
const getVillagesList = (state: AppState) => state.healthFacilityCom.villagesList;
const getVillagesLoading = (state: AppState) => state.healthFacilityCom.villagesLoading;
const getVillagesTotal = (state: AppState) => state.healthFacilityCom.villagesTotal;
const getUnlinkedVillagesList = (state: AppState) => state.healthFacilityCom.unlinkedVillagesList;
const getUnlinkedVillagesLoading = (state: AppState) => state.healthFacilityCom.unlinkedVillagesLoading;
const getUnlinkedVillagesTotal = (state: AppState) => state.healthFacilityCom.unlinkedVillagesTotal;
const getVillagesFromHFList = (state: AppState) => state.healthFacilityCom.villagesFromHFList;
const getVillagesFromHFLoading = (state: AppState) => state.healthFacilityCom.villagesFromHFLoading;
const getPeerSupervisorList = (state: AppState) => state.healthFacilityCom.peerSupervisorList;
const getPeerSupervisorTotal = (state: AppState) => state.healthFacilityCom.peerSupervisorTotal;
const getPeerSupervisorLoading = (state: AppState) => state.healthFacilityCom.peerSupervisorLoading;
const getWorkflowList = (state: AppState) => state.healthFacilityCom.clinicalWorkflowList;
const getWorkflowLoading = (state: AppState) => state.healthFacilityCom.clinicalWorkflowLoading;
const getCultureLoading = (state: AppState) => state.healthFacilityCom.cultureListLoading;
const getCultureList = (state: AppState) => state.healthFacilityCom.cultureList;
const getCountryList = (state: AppState) => state.healthFacilityCom.countryList;
const getCountryListLoading = (state: AppState) => state.healthFacilityCom.countryListLoading;

export const healthFacilitySelector = createSelector(getHealthFacility, (site) => site);
export const insightHFSelector = createSelector(getInsightHealthFacility, (site) => site);
export const insightHFLoadingSelector = createSelector(getInsightHFLoading, (loading) => loading);
export const healthFacilityLoadingSelector = createSelector(getLoading, (loading) => loading);
export const hfTypesSelector = createSelector(getHFTypes, (types) => types);
export const hfTypesLoadingSelector = createSelector(getHFTYpesLoading, (loading) => loading);
export const healthFacilityListTotalSelector = createSelector(getHFTotal, (total) => total);
export const healthFacilityListSelector = createSelector(getHFListDetails, (hfList) => hfList);
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
export const villagesTotalSelector = createSelector(getVillagesTotal, (villagesTotal) => villagesTotal);
export const unlinkedVillagesListSelector = createSelector(getUnlinkedVillagesList, (villagesList) => villagesList);
export const unlinkedVillagesLoadingSelector = createSelector(
  getUnlinkedVillagesLoading,
  (villagesLoading) => villagesLoading
);
export const unlinkedVillagesTotalSelector = createSelector(getUnlinkedVillagesTotal, (villagesTotal) => villagesTotal);
export const villagesFromHFListSelector = createSelector(getVillagesFromHFList, (villagesList) => villagesList);
export const villagesFromHFLoadingSelector = createSelector(
  getVillagesFromHFLoading,
  (villagesLoading) => villagesLoading
);
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
export const cultureLoadingSelector = createSelector(getCultureLoading, (loading) => loading);
export const cultureListSelector = createSelector(getCultureList, (list) => list);
export const countryListSelector = createSelector(getCountryList, (list) => list);
export const countryLoadingSelector = createSelector(getCountryListLoading, (loading) => loading);
