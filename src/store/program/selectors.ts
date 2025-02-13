import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.program.loading;
const getTotal = (state: AppState) => state.program.total;
const getProgramListDetails = (state: AppState) => state.program.programList;
const getSiteListDropdown = (state: AppState) => state.program.hfDropdownOptions;

export const siteListDropdownSelector = createSelector(getSiteListDropdown, (hfDropdownOptions) => hfDropdownOptions);

export const programLoadingSelector = createSelector(getLoading, (loading) => loading);
export const programListTotalSelector = createSelector(getTotal, (total) => total);
export const programListSelector = createSelector(getProgramListDetails, (programList) => programList);
