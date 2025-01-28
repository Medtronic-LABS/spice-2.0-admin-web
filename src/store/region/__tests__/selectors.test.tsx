import {
  getFileSelector,
  getIsDownloadingSelector,
  getIsUploadingSelector,
  getLoadingSelector,
  getRegionDetailsSelector,
  getRegionsSelector,
  getRegionsCountSelector,
  getRegionsLoadingMoreSelector,
  getClientRegistryStatusSelector,
  getRegionIdSelector
} from '../selectors';
import { initialState as mainInitialState } from '../reducer';

const initialState: any = {
  region: mainInitialState // to mock it's region obj from redux
};

// Test getRegionsSelector
test('getRegionsSelector should return regions from state', () => {
  return expect(getRegionsSelector(initialState)).toEqual(initialState.region.regions);
});

// Test getRegionsCountSelector
test('getRegionsCountSelector should return region count from state', () => {
  return expect(getRegionsCountSelector(initialState)).toEqual(initialState.region.total);
});

// Test getRegionsLoadingMoreSelector
test('getRegionsLoadingMoreSelector should return region loading more from state', () => {
  return expect(getRegionsLoadingMoreSelector(initialState)).toEqual(initialState.region.loadingMore);
});

// Test getClientRegistryStatusSelector
test('getClientRegistryStatusSelector should return client registry from state', () => {
  return expect(getClientRegistryStatusSelector(initialState)).toEqual(initialState.region.isClientRegistryEnabled);
});

// Test getFileSelector
test('getFileSelector should return file from state', () => {
  return expect(getFileSelector(initialState)).toEqual(initialState.region.file);
});

// Test getIsUploadingSelector
test('getIsUploadingSelector should return uploading from state', () => {
  expect(getIsUploadingSelector(initialState)).toEqual(initialState.region.uploading);
});
// Test getIsDownloadingSelector
test('getIsDownloadingSelector should return downloading from state', () => {
  expect(getIsDownloadingSelector(initialState)).toEqual(initialState.region.downloading);
});
// Test getLoadingSelector
test('getLoadingSelector should return loading from state', () => {
  expect(getLoadingSelector(initialState)).toEqual(initialState.region.loading);
});
// Test getRegionDetailsSelector
test('getRegionDetailsSelector should return regionDetails from state', () => {
  expect(getRegionDetailsSelector(initialState)).toEqual(initialState.region.detail);
});
// Test getRegionIdSelector
test('getRegionIdSelector should return region id from state', () => {
  expect(getRegionIdSelector(initialState)).toEqual(initialState.region.detail.id);
});
