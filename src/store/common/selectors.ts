import { createSelector } from 'reselect';

import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.common.loading;
const getSideMenu = (state: AppState) => state.common.sideMenu;
const getLabelName = (state: AppState) => state.common.labelName;

export const getLoadingSelector = createSelector(getLoading, (loading) => loading);
export const getSideMenuSelector = createSelector(getSideMenu, (sideMenu) => sideMenu);
export const labelNameSelector = createSelector(getLabelName, (labelName) => labelName);
