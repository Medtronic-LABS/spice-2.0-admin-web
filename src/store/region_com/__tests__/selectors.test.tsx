import USER_MOCK_DATA from '../../../tests/mockData/regionDataConstants';
import {
  getFileSelector,
  getIsDownloadingSelector,
  getIsUploadingSelector,
  getLoadingSelector,
  getRegionDetailsSelector
} from '../selectors';

const initialState: any = {
  region: USER_MOCK_DATA.INITIAL_STATE
};

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
  expect(getRegionDetailsSelector(initialState)).toEqual(initialState.region.regionDetails);
});
