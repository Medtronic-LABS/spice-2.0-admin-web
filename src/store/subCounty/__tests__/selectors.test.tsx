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

test('subCountyDashboardListSelector should return sub county dashboard list from state', () => {
  return expect(subCountyDashboardListSelector(initialState)).toEqual(initialState.subCounty.subCountyDashboardList);
});

test('subCountyListSelector should return sub county from state', () => {
  return expect(subCountyListSelector(initialState)).toEqual(initialState.subCounty.subCountyList);
});

test('subCountyCountSelector should return sub county count from state', () => {
  return expect(subCountyCountSelector(initialState)).toEqual(initialState.subCounty.total);
});

test('subCountyListCountSelector should return sub county list count from state', () => {
  return expect(subCountyListCountSelector(initialState)).toEqual(initialState.subCounty.listTotal);
});

test('subCountyLoadingSelector should return sub county loading from state', () => {
  return expect(subCountyLoadingSelector(initialState)).toEqual(initialState.subCounty.loading);
});

test('subCountyLoadingMoreSelector should return sub county loading more from state', () => {
  return expect(subCountyLoadingMoreSelector(initialState)).toEqual(initialState.subCounty.loadingMore);
});

test('getSubCountyDetailSelector should return sub county details from state', () => {
  return expect(getSubCountyDetailSelector(initialState)).toEqual(initialState.subCounty.subCountyDetail);
});

test('getOuAdminsSelector should return Sub County admins from state', () => {
  return expect(getOuAdminsSelector(initialState)).toEqual(initialState.subCounty.admins);
});

test('subCountyAdminListSelector should return Sub County admin list from state', () => {
  return expect(subCountyAdminListSelector(initialState)).toEqual(initialState.subCounty.subCountyAdmins);
});

test('subCountyDropdownSelector should return Sub County dropdown from state', () => {
  return expect(subCountyDropdownSelector(initialState)).toEqual(initialState.subCounty.dropdownSubCountyList);
});

test('subCountyDropdownLoadingSelector should return Sub County dropdown loading from state', () => {
  return expect(subCountyDropdownLoadingSelector(initialState)).toEqual(
    initialState.subCounty.dropdownSubCountyListLoading
  );
});
