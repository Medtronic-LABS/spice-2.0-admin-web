import {
  subCountyDashboardListSelector,
  subCountyListSelector,
  subCountyCountSelector,
  subCountyListCountSelector,
  subCountyLoadingSelector,
  subCountyLoadingMoreSelector,
  getSubCountyDetailSelector,
  getOuAdminsSelector,
  subCountyAdminListSelector,
  subCountyDropdownSelector,
  subCountyDropdownLoadingSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  subCounty: mainInitialState
};

test('subCountyDashboardListSelector should return operating unit dashboard list from state', () => {
  return expect(subCountyDashboardListSelector(initialState)).toEqual(initialState.subCounty.subCountyDashboardList);
});

test('subCountyListSelector should return operating unit from state', () => {
  return expect(subCountyListSelector(initialState)).toEqual(initialState.subCounty.subCountyList);
});

test('subCountyCountSelector should return operating unit count from state', () => {
  return expect(subCountyCountSelector(initialState)).toEqual(initialState.subCounty.total);
});

test('subCountyListCountSelector should return operating unit list count from state', () => {
  return expect(subCountyListCountSelector(initialState)).toEqual(initialState.subCounty.listTotal);
});

test('subCountyLoadingSelector should return operating unit loading from state', () => {
  return expect(subCountyLoadingSelector(initialState)).toEqual(initialState.subCounty.loading);
});

test('subCountyLoadingMoreSelector should return operating unit loading more from state', () => {
  return expect(subCountyLoadingMoreSelector(initialState)).toEqual(initialState.subCounty.loadingMore);
});

test('getSubCountyDetailSelector should return operating unit details from state', () => {
  return expect(getSubCountyDetailSelector(initialState)).toEqual(initialState.subCounty.subCountyDetail);
});

test('getOuAdminsSelector should return OU admins from state', () => {
  return expect(getOuAdminsSelector(initialState)).toEqual(initialState.subCounty.admins);
});

test('subCountyAdminListSelector should return OU admin list from state', () => {
  return expect(subCountyAdminListSelector(initialState)).toEqual(initialState.subCounty.subCountyAdmins);
});

test('subCountyDropdownSelector should return OU dropdown from state', () => {
  return expect(subCountyDropdownSelector(initialState)).toEqual(initialState.subCounty.dropdownOUList);
});

test('subCountyDropdownLoadingSelector should return OU dropdown loading from state', () => {
  return expect(subCountyDropdownLoadingSelector(initialState)).toEqual(initialState.subCounty.dropdownOUListLoading);
});
