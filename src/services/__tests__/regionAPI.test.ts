import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  uploadFile,
  downloadFile,
  regionDetails,
  fetchRegions,
  createRegion,
  getCountryDetail,
  getRegionDetailById
} from '../regionAPI';

describe('Region APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it(`uploadFile sends a POST request
    to /admin-service/region-details/upload-file with correct file data`, async () => {
    const file = {} as any;
    const formData = new FormData();
    formData.append('file', file);
    const appTypes = 'NON_COMMUNITY';
    mockAxios.onPost('/admin-service/region-details/upload-file').reply(200, {});

    await uploadFile(file, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/region-details/upload-file');
    expect(mockAxios.history.post[0].headers['Content-Type']).toBe('multipart/form-data');
    // expect(mockAxios.history.post[0].data).toEqual(formData);
  });

  it('downloadFile sends a POST request to /admin-service/region-details/download-file with correct data', async () => {
    const appTypes = ['NON_COMMUNITY'];
    mockAxios.onPost('/admin-service/region-details/download-file').reply(200, {});

    await downloadFile(1, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].responseType).toBe('blob');
    expect(mockAxios.history.post[0].url).toBe('/admin-service/region-details/download-file');
  });

  it('regionDetails sends a POST request to /admin-service/region-details', async () => {
    mockAxios.onPost('/admin-service/region-details').reply(200, {});

    await regionDetails(1, 0, 0, '');

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/region-details');
  });

  it('fetchRegions sends a POST request to /admin-service/country/list', async () => {
    mockAxios.onPost('/admin-service/country/list').reply(200, {});

    await fetchRegions(0, 0, '', '');

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/country/list');
  });

  it('createRegion sends a POST request to /user-service/organization/create-country with correct data', async () => {
    const data = {
      name: 'Test Region',
      countryCode: '23',
      users: [
        {
          firstName: 'John',
          lastName: 'Abraham',
          username: 'johnabraham@gmail.com',
          email: 'johnabraham@gmail.com',
          phoneNumber: '2345678901',
          gender: 'Male',
          timezone: {
            id: 1
          }
        }
      ]
    } as any;

    mockAxios.onPost('/user-service/organization/create-country').reply(200, {});

    await createRegion(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/organization/create-country');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('getCountryDetail sends a POST request to /admin-service/country/details with correct data', async () => {
    const data = {
      tenantId: '1',
      id: '1'
    } as any;

    mockAxios.onPost('/admin-service/country/details').reply(200, {});

    await getCountryDetail(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/country/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it(`getRegionDetailById sends a POST request
    to /admin-service/data/get-country/countryId with correct data`, async () => {
    const countryId = '2';

    mockAxios.onGet(`/admin-service/data/get-country/${countryId}`).reply(200, {});

    await getRegionDetailById(countryId);

    expect(mockAxios.history.get.length).toBe(1);
    expect(mockAxios.history.get[0].url).toBe(`/admin-service/data/get-country/${countryId}`);
  });
});
