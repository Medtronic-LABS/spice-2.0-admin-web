import { createSelector } from 'reselect';

import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.regionDashboardReducer.loading;
const getLoadingMore = (state: AppState) => state.regionDashboardReducer.loadingMore;
const getRegions = (state: AppState) => state.regionDashboardReducer.regions;
const getRegionsCount = (state: AppState) => state.regionDashboardReducer.total;
const getRegionDetail = (state: AppState) => state.regionDashboardReducer.detail;
const getClientRegistryStatus = (state: AppState) => state.regionDashboardReducer?.isClientRegistryEnabled;

export const getRegionsLoadingSelector = createSelector(
  getLoading,
  (loading) => loading
);

export const getRegionsSelector = createSelector(
  getRegions,
  (regions) => regions
);

export const getRegionsCountSelector = createSelector(
  getRegionsCount,
  (regiosCount) => regiosCount
);

export const getRegionsLoadingMoreSelector = createSelector(
  getLoadingMore,
  (loadingMore) => loadingMore
);

export const getRegionDetailSelector = createSelector(
  getRegionDetail,
  (detail) => detail
);

export const getClientRegistryStatusSelector = createSelector(
  getClientRegistryStatus,
  (isClientRegistryEnabled) => isClientRegistryEnabled
);

