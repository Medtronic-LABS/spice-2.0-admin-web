import { getLoadingSelector, getSideMenuSelector } from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  common: mainInitialState
};

// Test getLoadingSelector
test('getLoadingSelector should return loading from state', () => {
  expect(getLoadingSelector(initialState)).toEqual(initialState.common.loading);
});
// Test getSideMenuSelector
test('getSideMenuSelector should return sidemenu from state', () => {
  expect(getSideMenuSelector(initialState)).toEqual(initialState.common.sideMenu);
});
