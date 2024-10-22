import { createSelector } from 'reselect';

import { AppState } from '../rootReducer';

const getFileData = (state: AppState) => state.regionCom.file;
const getIsUploading = (state: AppState) => state.regionCom.uploading;
const getIsDownloading = (state: AppState) => state.regionCom.downloading;
const getLoading = (state: AppState) => state.regionCom.loading;
const getRegionDetails = (state: AppState) => state.regionCom.regionDetails;
const getRegionDetail = (state: AppState) => state.regionCom.detail;

export const getFileSelector = createSelector(getFileData, (file) => file);
export const getIsUploadingSelector = createSelector(getIsUploading, (uploading) => uploading);
export const getIsDownloadingSelector = createSelector(getIsDownloading, (downloading) => downloading);
export const getLoadingSelector = createSelector(getLoading, (loading) => loading);
export const getRegionDetailsSelector = createSelector(getRegionDetails, (regionDetails) => regionDetails);
export const getRegionDetailSelector = createSelector(getRegionDetail, (detail) => detail);
