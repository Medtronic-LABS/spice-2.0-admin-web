import { initialState as mainInitialState } from '../reducer';
import {
  healthFacilitySelector,
  healthFacilityLoadingSelector,
  hfTypesSelector,
  hfTypesLoadingSelector,
  healthFacilityListTotalSelector,
  healthFacilityListSelector,
  healthFacilityUserListSelector,
  healthFacilityUsersLoadingSelector,
  healthFacilityListUsersTotalSelector,
  userDetailSelector,
  userDetailLoadingSelector,
  districtListSelector,
  districtTotalSelector,
  districtLoadingSelector,
  chiefdomListSelector,
  chiefdomTotalSelector,
  chiefdomLoadingSelector,
  villagesListSelector,
  villagesLoadingSelector,
  villagesTotalSelector,
  unlinkedVillagesListSelector,
  unlinkedVillagesLoadingSelector,
  unlinkedVillagesTotalSelector,
  villagesFromHFListSelector,
  villagesFromHFLoadingSelector,
  peerSupervisorListSelector,
  peerSupervisorTotalSelector,
  peerSupervisorLoadingSelector,
  workflowListSelector,
  workflowLoadingSelector,
  cultureLoadingSelector,
  cultureListSelector,
  countryListSelector,
  countryLoadingSelector,
  hfDashboardListSelector,
  hfLoadingMoreSelector
} from '../selectors';

const initialState: any = {
  healthFacility: mainInitialState
};
// Test healthFacilitySelector
test('healthFacilitySelector should return healthFacility from state', () => {
  expect(healthFacilitySelector(initialState)).toEqual(initialState.healthFacility.healthFacility);
});

// Test healthFacilityLoadingSelector
test('healthFacilityLoadingSelector should return loading from state', () => {
  expect(healthFacilityLoadingSelector(initialState)).toEqual(initialState.healthFacility.loading);
});

// Test hfTypesSelector
test('hfTypesSelector should return hfTypes from state', () => {
  expect(hfTypesSelector(initialState)).toEqual(initialState.healthFacility.hfTypes);
});

// Test hfTypesLoadingSelector
test('hfTypesLoadingSelector should return hfTypesLoading from state', () => {
  expect(hfTypesLoadingSelector(initialState)).toEqual(initialState.healthFacility.hfTypesLoading);
});

// Test healthFacilityListTotalSelector
test('healthFacilityListTotalSelector should return hfTotal from state', () => {
  expect(healthFacilityListTotalSelector(initialState)).toEqual(initialState.healthFacility.hfTotal);
});

// Test healthFacilityListSelector
test('healthFacilityListSelector should return healthFacilityList from state', () => {
  expect(healthFacilityListSelector(initialState)).toEqual(initialState.healthFacility.healthFacilityList);
});

// Test healthFacilityUserListSelector
test('healthFacilityUserListSelector should return healthFacilityUserList from state', () => {
  expect(healthFacilityUserListSelector(initialState)).toEqual(initialState.healthFacility.healthFacilityUserList);
});

// Test healthFacilityUsersLoadingSelector
test('healthFacilityUsersLoadingSelector should return hfUsersLoading from state', () => {
  expect(healthFacilityUsersLoadingSelector(initialState)).toEqual(initialState.healthFacility.hfUsersLoading);
});

// Test healthFacilityListUsersTotalSelector
test('healthFacilityListUsersTotalSelector should return hfUsersTotal from state', () => {
  expect(healthFacilityListUsersTotalSelector(initialState)).toEqual(initialState.healthFacility.hfUsersTotal);
});

// Test userDetailSelector
test('userDetailSelector should return hfUser from state', () => {
  expect(userDetailSelector(initialState)).toEqual(initialState.healthFacility.hfUser);
});

// Test userDetailLoadingSelector
test('userDetailLoadingSelector should return hfUserDetailLoading from state', () => {
  expect(userDetailLoadingSelector(initialState)).toEqual(initialState.healthFacility.hfUserDetailLoading);
});

// Test districtListSelector
test('districtListSelector should return districtList from state', () => {
  expect(districtListSelector(initialState)).toEqual(initialState.healthFacility.districtList);
});

// Test districtTotalSelector
test('districtTotalSelector should return districtTotal from state', () => {
  expect(districtTotalSelector(initialState)).toEqual(initialState.healthFacility.districtTotal);
});

// Test districtLoadingSelector
test('districtLoadingSelector should return districtLoading from state', () => {
  expect(districtLoadingSelector(initialState)).toEqual(initialState.healthFacility.districtLoading);
});

// Test chiefdomListSelector
test('chiefdomListSelector should return chiefdomList from state', () => {
  expect(chiefdomListSelector(initialState)).toEqual(initialState.healthFacility.chiefdomList);
});

// Test chiefdomTotalSelector
test('chiefdomTotalSelector should return chiefdomTotal from state', () => {
  expect(chiefdomTotalSelector(initialState)).toEqual(initialState.healthFacility.chiefdomTotal);
});

// Test chiefdomLoadingSelector
test('chiefdomLoadingSelector should return chiefdomLoading from state', () => {
  expect(chiefdomLoadingSelector(initialState)).toEqual(initialState.healthFacility.chiefdomLoading);
});

// Test villagesListSelector
test('villagesListSelector should return villagesList from state', () => {
  expect(villagesListSelector(initialState)).toEqual(initialState.healthFacility.villagesList);
});

// Test villagesLoadingSelector
test('villagesLoadingSelector should return villagesLoading from state', () => {
  expect(villagesLoadingSelector(initialState)).toEqual(initialState.healthFacility.villagesLoading);
});

// Test villagesTotalSelector
test('villagesTotalSelector should return villagesTotal from state', () => {
  expect(villagesTotalSelector(initialState)).toEqual(initialState.healthFacility.villagesTotal);
});

// Test unlinkedVillagesListSelector
test('unlinkedVillagesListSelector should return unlinkedVillagesList from state', () => {
  expect(unlinkedVillagesListSelector(initialState)).toEqual(initialState.healthFacility.unlinkedVillagesList);
});

// Test unlinkedVillagesLoadingSelector
test('unlinkedVillagesLoadingSelector should return unlinkedVillagesLoading from state', () => {
  expect(unlinkedVillagesLoadingSelector(initialState)).toEqual(initialState.healthFacility.unlinkedVillagesLoading);
});

// Test unlinkedVillagesTotalSelector
test('unlinkedVillagesTotalSelector should return unlinkedVillagesTotal from state', () => {
  expect(unlinkedVillagesTotalSelector(initialState)).toEqual(initialState.healthFacility.unlinkedVillagesTotal);
});

// Test villagesFromHFListSelector
test('villagesFromHFListSelector should return villagesFromHFList from state', () => {
  expect(villagesFromHFListSelector(initialState)).toEqual(initialState.healthFacility.villagesFromHFList);
});

// Test villagesFromHFLoadingSelector
test('villagesFromHFLoadingSelector should return villagesFromHFLoading from state', () => {
  expect(villagesFromHFLoadingSelector(initialState)).toEqual(initialState.healthFacility.villagesFromHFLoading);
});

// Test peerSupervisorListSelector
test('peerSupervisorListSelector should return peerSupervisorList from state', () => {
  expect(peerSupervisorListSelector(initialState)).toEqual(initialState.healthFacility.peerSupervisorList);
});

// Test peerSupervisorTotalSelector
test('peerSupervisorTotalSelector should return peerSupervisorTotal from state', () => {
  expect(peerSupervisorTotalSelector(initialState)).toEqual(initialState.healthFacility.peerSupervisorTotal);
});

// Test peerSupervisorLoadingSelector
test('peerSupervisorLoadingSelector should return peerSupervisorLoading from state', () => {
  expect(peerSupervisorLoadingSelector(initialState)).toEqual(initialState.healthFacility.peerSupervisorLoading);
});

// Test workflowListSelector
test('workflowListSelector should return workflowList from state', () => {
  expect(workflowListSelector(initialState)).toEqual(initialState.healthFacility.clinicalWorkflowList);
});

// Test workflowLoadingSelector
test('workflowLoadingSelector should return workflowLoading from state', () => {
  expect(workflowLoadingSelector(initialState)).toEqual(initialState.healthFacility.clinicalWorkflowLoading);
});

// Test cultureLoadingSelector
test('cultureLoadingSelector should return cultureListLoading from state', () => {
  expect(cultureLoadingSelector(initialState)).toEqual(initialState.healthFacility.cultureListLoading);
});

// Test cultureListSelector
test('cultureListSelector should return cultureList from state', () => {
  expect(cultureListSelector(initialState)).toEqual(initialState.healthFacility.cultureList);
});

// Test countryListSelector
test('countryListSelector should return countryList from state', () => {
  expect(countryListSelector(initialState)).toEqual(initialState.healthFacility.countryList);
});

// Test countryLoadingSelector
test('countryLoadingSelector should return countryListLoading from state', () => {
  expect(countryLoadingSelector(initialState)).toEqual(initialState.healthFacility.countryListLoading);
});

// Test hfDashboardListSelector
test('hfDashboardListSelector should return hfDashboardList from state', () => {
  expect(hfDashboardListSelector(initialState)).toEqual(initialState.healthFacility.hfDashboardList);
});

// Test hfLoadingMoreSelector
test('hfLoadingMoreSelector should return loadingMore from state', () => {
  expect(hfLoadingMoreSelector(initialState)).toEqual(initialState.healthFacility.loadingMore);
});
