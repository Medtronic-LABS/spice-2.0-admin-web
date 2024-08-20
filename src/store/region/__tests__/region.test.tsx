import { runSaga } from 'redux-saga';
import { AxiosResponse } from 'axios';
import * as regionService from '../../../services/regionAPI';
import {
  createRegion,
  regionDetailsSaga,
  fetchRegionsSaga,
  fetchClientRegistryStatus,
  uploadFileSaga,
  downloadFileSaga,
  fetchCountryDetail
} from '../sagas';
import * as ACTION_TYPES from '../actionTypes';
import * as regionActions from '../actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/regionDataConstants';

const createRegionRequestMockData = MOCK_DATA_CONSTANTS.CREATE_REGION_REQUEST_PAYLOAD;
const fetchRegionListData = MOCK_DATA_CONSTANTS.FETCH_REGION_LIST_REPONSE;
const fetchRegionListRequest = MOCK_DATA_CONSTANTS.FETCH_REGION_LIST_REQUEST_PAYLOAD;
const fetchRegionDetailPayload = MOCK_DATA_CONSTANTS.REGION_DETAILS_REQUEST_PAYLOAD;
const fetchRegionDetailResponsePayload = MOCK_DATA_CONSTANTS.FETCH_REGION_DETAIL_RESPONSE_PAYLOAD;
const fetchCountryDetailsResponsePayload = MOCK_DATA_CONSTANTS.COUNTRY_DETAILS_RESPONSE;
const fetchCountryDetailRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;

describe('Fetch Region', () => {
  it('Fetch list of Regions and dispatches success', async () => {
    const fetchRegionDetailSpy = jest.spyOn(regionService, 'fetchRegions').mockImplementation(() =>
      Promise.resolve({
        data: {
          entityList: fetchRegionListData.regions,
          totalCount: fetchRegionListData.total,
          isLoadMore: fetchRegionListData.isLoadMore
        }
      } as AxiosResponse)
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchRegionsSaga,
      {
        ...fetchRegionListRequest,
        type: ACTION_TYPES.FETCH_REGIONS_REQUEST
      }
    ).toPromise();
    expect(fetchRegionDetailSpy).toHaveBeenCalledWith(
      fetchRegionListRequest.limit,
      fetchRegionListRequest.skip,
      undefined,
      fetchRegionListRequest.search
    );
    expect(dispatched).toEqual([
      regionActions.fetchRegionsSuccess({
        regions: fetchRegionListData.regions || [],
        total: fetchRegionListData.total,
        isLoadMore: fetchRegionListData.isLoadMore
      })
    ]);
  });

  it('Fetch list of Regions and dispatches failure', async () => {
    const error = new Error('Failed to fetch region list');
    const fetchRegionListSpy = jest
      .spyOn(regionService, 'fetchRegions')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchRegionsSaga,
      {
        ...fetchRegionListRequest,
        type: ACTION_TYPES.FETCH_REGIONS_REQUEST
      }
    ).toPromise();
    expect(fetchRegionListSpy).toHaveBeenCalledWith(
      fetchRegionListRequest.limit,
      fetchRegionListRequest.skip,
      undefined,
      fetchRegionListRequest.search
    );
    expect(dispatched).toEqual([regionActions.fetchRegionsFailure(error)]);
  });
});

describe('Region detail', () => {
  it('Fetch region detail and dispatches success', async () => {
    const fetchRegionDetailSpy = jest.spyOn(regionService, 'regionDetails').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entityList: fetchRegionDetailResponsePayload.entityList,
          totalCount: fetchRegionDetailResponsePayload.totalCount
        }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      regionDetailsSaga,
      {
        ...fetchRegionDetailPayload,
        type: ACTION_TYPES.FETCH_REGION_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchRegionDetailSpy).toHaveBeenCalledWith(
      fetchRegionDetailPayload.countryId,
      fetchRegionDetailPayload.limit,
      fetchRegionDetailPayload.skip,
      fetchRegionDetailPayload.search
    );
    expect(dispatched).toEqual([
      regionActions.regionDetailsSuccess({
        list: fetchRegionDetailResponsePayload.entityList,
        total: fetchRegionDetailResponsePayload.totalCount
      })
    ]);
  });

  it('Fetch region detail and dispatches failure', async () => {
    const error = new Error('Failed to fetch region detail');
    const fetchRegionDetailSpy = jest.spyOn(regionService, 'regionDetails').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      regionDetailsSaga,
      {
        ...fetchRegionDetailPayload,
        type: ACTION_TYPES.FETCH_REGION_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchRegionDetailSpy).toHaveBeenCalledWith(
      fetchRegionDetailPayload.countryId,
      fetchRegionDetailPayload.limit,
      fetchRegionDetailPayload.skip,
      fetchRegionDetailPayload.search
    );
    expect(dispatched).toEqual([regionActions.regionDetailsFailure(error)]);
  });
});

describe('Create a Region', () => {
  it('Creates a Region and dispatches success', async () => {
    const createRegionSpy = jest
      .spyOn(regionService, 'createRegion')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createRegion,
      {
        data: createRegionRequestMockData,
        type: ACTION_TYPES.CREATE_REGION_REQUEST
      }
    ).toPromise();
    expect(createRegionSpy).toHaveBeenCalledWith(createRegionRequestMockData);
    expect(dispatched).toEqual([regionActions.createRegionSuccess()]);
  });

  it('Fails to create a Region and dispatches failure', async () => {
    const error = new Error('Failed to create Region');
    const createRegionSpy = jest.spyOn(regionService, 'createRegion').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createRegion,
      {
        data: createRegionRequestMockData,
        type: ACTION_TYPES.CREATE_REGION_REQUEST
      }
    ).toPromise();
    expect(createRegionSpy).toHaveBeenCalledWith(createRegionRequestMockData);
    expect(dispatched).toEqual([regionActions.createRegionFailure(error)]);
  });
});

describe('Fetch Client Registry', () => {
  it('Fetch client registry and dispatches success', async () => {
    const clientRegistrySpy = jest
      .spyOn(regionService, 'getRegionDetailById')
      .mockImplementation(() => Promise.resolve({ data: { isClientRegistryEnabled: true } } as AxiosResponse));
    const dispatched: any = [];
    const payload = { countryId: '1' };
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchClientRegistryStatus,
      {
        payload,
        type: ACTION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST
      }
    ).toPromise();
    expect(clientRegistrySpy).toHaveBeenCalledWith(payload.countryId);
    expect(dispatched).toEqual([regionActions.fetchClientRegistryStatusSuccess(true)]);
  });
  it('Fetch client registry and dispatches failure', async () => {
    const error = new Error('Failed to fetch client registry');
    const clientRegistrySpy = jest
      .spyOn(regionService, 'getRegionDetailById')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    const payload = { countryId: '1' };
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchClientRegistryStatus,
      {
        payload,
        type: ACTION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST
      }
    ).toPromise();
    expect(clientRegistrySpy).toHaveBeenCalledWith(payload.countryId);
    expect(dispatched).toEqual([
      regionActions.fetchClientRegistryStatusSuccess(false),
      regionActions.fetchClientRegistryStatusFail(error)
    ]);
  });
});

describe('Upload File', () => {
  it('Upload file and dispatches success', async () => {
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

  it('Upload file and dispatches failure', async () => {
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

describe('Download File', () => {
  it('Download file and dispatches success', async () => {
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

  it('Download file and dispatches failure', async () => {
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

describe('Fetch country details', () => {
  it('Fetches region details and dispatches success', async () => {
    const fetchRegionDetailSpy = jest.spyOn(regionService, 'getCountryDetail').mockImplementation(() => {
      return Promise.resolve({ data: { entity: fetchCountryDetailsResponsePayload } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountryDetail,
      {
        payload: fetchCountryDetailRequestMockData,
        type: ACTION_TYPES.FETCH_COUNTRY_DETAILS_REQUEST
      }
    ).toPromise();
    expect(fetchRegionDetailSpy).toHaveBeenCalledWith(fetchCountryDetailRequestMockData);
    expect(dispatched).toEqual([regionActions.fetchCountryDetailSuccess(fetchCountryDetailsResponsePayload)]);
  });
  it('Fetches region details and dispatches failure', async () => {
    const error = new Error('Error in fetching country');
    const fetchRegionDetailSpy = jest.spyOn(regionService, 'getCountryDetail').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountryDetail,
      {
        payload: fetchCountryDetailRequestMockData,
        type: ACTION_TYPES.FETCH_COUNTRY_DETAILS_REQUEST
      }
    ).toPromise();
    expect(fetchRegionDetailSpy).toHaveBeenCalledWith(fetchCountryDetailRequestMockData);
    expect(dispatched).toEqual([regionActions.fetchCountryDetailFail(error)]);
  });
});
