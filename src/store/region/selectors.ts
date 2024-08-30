import { createSelector } from 'reselect';

import { AppState } from '../rootReducer';

const getLoading = (state: AppState) => state.region.loading;
const getLoadingMore = (state: AppState) => state.region.loadingMore;
const getRegions = (state: AppState) => state.region.regions;
const getRegionsCount = (state: AppState) => state.region.total;
const getClientRegistryStatus = (state: AppState) => state.region?.isClientRegistryEnabled;
const getFileData = (state: AppState) => state.region.file;
const getIsUploading = (state: AppState) => state.region.uploading;
const getIsDownloading = (state: AppState) => state.region.downloading;
const getRegionDetails = (state: AppState) => state.region.detail;
const getRegionId = (state: AppState) => state.region.detail.id;

export const getRegionsSelector = createSelector(getRegions, (regions) => regions);
export const getRegionsCountSelector = createSelector(getRegionsCount, (regiosCount) => regiosCount);
export const getRegionsLoadingMoreSelector = createSelector(getLoadingMore, (loadingMore) => loadingMore);
export const getClientRegistryStatusSelector = createSelector(
  getClientRegistryStatus,
  (isClientRegistryEnabled) => isClientRegistryEnabled
);

export const getFileSelector = createSelector(getFileData, (file) => file);
export const getIsUploadingSelector = createSelector(getIsUploading, (uploading) => uploading);
export const getIsDownloadingSelector = createSelector(getIsDownloading, (downloading) => downloading);
export const getLoadingSelector = createSelector(getLoading, (loading) => loading);
export const getRegionDetailsSelector = createSelector(getRegionDetails, (regionDetails) => regionDetails);
export const getRegionIdSelector = createSelector(getRegionId, (regionId) => regionId);
