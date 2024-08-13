import {
  chiefdomDashboardListSelector,
  chiefdomListSelector,
  chiefdomCountSelector,
  chiefdomListCountSelector,
  chiefdomLoadingSelector,
  chiefdomLoadingMoreSelector,
  getChiefdomDetailSelector,
  getOuAdminsSelector,
  chiefdomAdminListSelector,
  chiefdomDropdownSelector,
  chiefdomDropdownLoadingSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  chiefdom: mainInitialState
};

test('chiefdomDashboardListSelector should return chiefdom dashboard list from state', () => {
  return expect(chiefdomDashboardListSelector(initialState)).toEqual(initialState.chiefdom.chiefdomDashboardList);
});

test('chiefdomListSelector should return chiefdom from state', () => {
  return expect(chiefdomListSelector(initialState)).toEqual(initialState.chiefdom.chiefdomList);
});

test('chiefdomCountSelector should return chiefdom count from state', () => {
  return expect(chiefdomCountSelector(initialState)).toEqual(initialState.chiefdom.total);
});

test('chiefdomListCountSelector should return chiefdom list count from state', () => {
  return expect(chiefdomListCountSelector(initialState)).toEqual(initialState.chiefdom.listTotal);
});

test('chiefdomLoadingSelector should return chiefdom loading from state', () => {
  return expect(chiefdomLoadingSelector(initialState)).toEqual(initialState.chiefdom.loading);
});

test('chiefdomLoadingMoreSelector should return chiefdom loading more from state', () => {
  return expect(chiefdomLoadingMoreSelector(initialState)).toEqual(initialState.chiefdom.loadingMore);
});

test('getChiefdomDetailSelector should return chiefdom details from state', () => {
  return expect(getChiefdomDetailSelector(initialState)).toEqual(initialState.chiefdom.chiefdomDetail);
});

test('getOuAdminsSelector should return Chiefdom admins from state', () => {
  return expect(getOuAdminsSelector(initialState)).toEqual(initialState.chiefdom.admins);
});

test('chiefdomAdminListSelector should return Chiefdom admin list from state', () => {
  return expect(chiefdomAdminListSelector(initialState)).toEqual(initialState.chiefdom.chiefdomAdmins);
});

test('chiefdomDropdownSelector should return Chiefdom dropdown from state', () => {
  return expect(chiefdomDropdownSelector(initialState)).toEqual(initialState.chiefdom.dropdownChiefdomList);
});

test('chiefdomDropdownLoadingSelector should return Chiefdom dropdown loading from state', () => {
  return expect(chiefdomDropdownLoadingSelector(initialState)).toEqual(
    initialState.chiefdom.dropdownChiefdomListLoading
  );
});
