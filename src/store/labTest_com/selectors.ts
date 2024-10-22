import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.labtestCom.loading;
const getLabtests = (state: AppState) => state.labtestCom.labTests;

const getLabtestsCount = (state: AppState) => state.labtestCom.total;

const getUnits = (state: AppState) => state.labtestCom.units;

const getUnitsLoading = (state: AppState) => state.labtestCom.unitsLoading;
const getCustomizationLoading = (state: AppState) => state.labtestCom.customizationLoading;
const getCustomizationData = (state: AppState) => state.labtestCom.labTestCustomizationData;
const getCustomizationJsonData = (state: AppState) => state.labtestCom.labtestJson;

// const getLabResultUnits = (state: AppState) => state.labtest.labResultRanges;

export const labtestLoadingSelector = createSelector(getLoading, (loading) => loading);

export const labtestsSelector = createSelector(getLabtests, (labtests) => labtests);

export const labtestCountSelector = createSelector(getLabtestsCount, (labtestCount) => labtestCount);

export const unitsSelector = createSelector(getUnits, (units) => units);

export const unitsLoadingSelector = createSelector(getUnitsLoading, (unitsLoading) => unitsLoading);
export const labTestJSONLoadingSelector = createSelector(getCustomizationLoading, (loading) => loading);
export const labTestCustomDataSelector = createSelector(getCustomizationData, (data) => data);
export const labTestJSONSelector = createSelector(getCustomizationJsonData, (json) => json);

// export const labResultRangesSelector = createSelector(getLabResultUnits, (labResultRanges) => labResultRanges);
