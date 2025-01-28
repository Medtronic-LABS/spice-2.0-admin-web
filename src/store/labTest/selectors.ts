import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.labtest.loading;
const getLabtests = (state: AppState) => state.labtest.labTests;

const getLabtestsCount = (state: AppState) => state.labtest.total;

const getUnits = (state: AppState) => state.labtest.units;

const getUnitsLoading = (state: AppState) => state.labtest.unitsLoading;
const getCustomizationLoading = (state: AppState) => state.labtest.customizationLoading;
const getCustomizationData = (state: AppState) => state.labtest.labTestCustomizationData;
const getCustomizationJsonData = (state: AppState) => state.labtest.labtestJson;

export const labtestLoadingSelector = createSelector(getLoading, (loading) => loading);

export const labtestsSelector = createSelector(getLabtests, (labtests) => labtests);

export const labtestCountSelector = createSelector(getLabtestsCount, (labtestCount) => labtestCount);

export const unitsSelector = createSelector(getUnits, (units) => units);

export const unitsLoadingSelector = createSelector(getUnitsLoading, (unitsLoading) => unitsLoading);
export const labTestJSONLoadingSelector = createSelector(getCustomizationLoading, (loading) => loading);
export const labTestCustomDataSelector = createSelector(getCustomizationData, (data) => data);
export const labTestJSONSelector = createSelector(getCustomizationJsonData, (json) => json);
