import { createSelector } from 'reselect';

import { AppState } from '../rootReducer';

const getFileData = (state: AppState) => state.region.file;
const getIsUploading = (state: AppState) => state.region.uploading;
const getIsDownloading = (state: AppState) => state.region.downloading;
const getLoading = (state: AppState) => state.region.loading;
const getRegionDetails = (state: AppState) => state.region.regionDetails;

export const getFileSelector = createSelector(getFileData, (file) => file);
export const getIsUploadingSelector = createSelector(getIsUploading, (uploading) => uploading);
export const getIsDownloadingSelector = createSelector(getIsDownloading, (downloading) => downloading);
export const getLoadingSelector = createSelector(getLoading, (loading) => loading);
export const getRegionDetailsSelector = createSelector(getRegionDetails, (regionDetails) => regionDetails);
