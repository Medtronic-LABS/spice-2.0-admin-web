import { downloadFileSaga, regionDetailsSaga, uploadFileSaga } from '../sagas';
import { runSaga } from 'redux-saga';
import * as regionService from '../../../services/regionAPI';
import * as ACTION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/regionDataConstants';
import { AxiosResponse } from 'axios';
import * as regionActions from '../actions';

const regionDetailsMockData = MOCK_DATA_CONSTANTS.REGION_DETAILS_RESPONSE_PAYLOAD;
const regionDetailsRequestMockData = MOCK_DATA_CONSTANTS.REGION_DETAILS_REQUEST_PAYLOAD;

describe('Upload File for Region Data mapping', () => {
  it('should upload file successfully', async () => {
    const uploadFileSpy = jest.spyOn(regionService, 'uploadFile').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      uploadFileSaga,
      { file: {} as any, type: ACTION_TYPES.UPLOAD_FILE_REQUEST }
    ).toPromise();
    expect(uploadFileSpy).toHaveBeenCalledWith({});
    expect(dispatched).toEqual([regionActions.uploadFileSuccess({} as any)]);
  });

  it('should handle upload file failure', async () => {
    const error = 'Unable to upload file. Please try after sometime.';
    const uploadFileSpy = jest.spyOn(regionService, 'uploadFile').mockImplementation(() => {
      return Promise.reject({ error });
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      uploadFileSaga,
      { file: {} as any, type: ACTION_TYPES.UPLOAD_FILE_REQUEST }
    ).toPromise();
    expect(uploadFileSpy).toHaveBeenCalledWith({});
    expect(dispatched).toEqual([regionActions.uploadFileFailure({ error })]);
  });
});

describe('Region Data Download file', () => {
  it('should download file successfully', async () => {
    const downloadFileSpy = jest.spyOn(regionService, 'downloadFile').mockImplementation(() => {
      return Promise.resolve({ data: {} as any } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      downloadFileSaga,
      { countryId: 1, type: ACTION_TYPES.DOWNLOAD_FILE_REQUEST }
    ).toPromise();
    expect(downloadFileSpy).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([regionActions.downloadFileSuccess({} as any)]);
  });

  it('should handle download file failure', async () => {
    const error = 'Unable to download file. Please try after sometime.';
    const downloadFileSpy = jest.spyOn(regionService, 'downloadFile').mockImplementation(() => {
      return Promise.reject({ error });
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      downloadFileSaga,
      { countryId: 1, type: ACTION_TYPES.DOWNLOAD_FILE_REQUEST }
    ).toPromise();
    expect(downloadFileSpy).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([regionActions.downloadFileFailure({ error })]);
  });
});

describe('Fetch Region Details', () => {
  it('should fetch the region details successfully', async () => {
    const { list, total } = regionDetailsMockData;
    const regionDetailsSpy = jest.spyOn(regionService, 'regionDetails').mockImplementation(() => {
      return Promise.resolve({ data: { entityList: list, totalCount: total } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      regionDetailsSaga,
      { ...regionDetailsRequestMockData, type: ACTION_TYPES.REGION_DETAILS_REQUEST }
    ).toPromise();
    expect(regionDetailsSpy).toHaveBeenCalledWith(1, 10, 0, '');
    expect(dispatched).toEqual([regionActions.regionDetailsSuccess(regionDetailsMockData)]);
  });

  it('should handle the region details fetch failure', async () => {
    const error = 'Unable to fetch the region details. Please try after sometime.';
    const regionDetailsSpy = jest.spyOn(regionService, 'regionDetails').mockImplementation(() => {
      return Promise.reject({ error });
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      regionDetailsSaga,
      { ...regionDetailsRequestMockData, type: ACTION_TYPES.REGION_DETAILS_REQUEST }
    ).toPromise();
    expect(regionDetailsSpy).toHaveBeenCalledWith(1, 10, 0, '');
    expect(dispatched).toEqual([regionActions.regionDetailsFailure({ error })]);
  });
});
