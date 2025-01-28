import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchProgramList,
  saveProgram,
  fetchProgramDetails,
  updateProgramDetails,
  deleteProgram,
  getHFForDropdown
} from '../programAPI';

// Utility function for common API test handling
const testApiCall = async (
  method: 'post' | 'patch' | 'delete',
  url: string,
  data: any,
  mockAxios: any,
  apiFunction: any,
  expectedData: any = data
) => {
  mockAxios[`on${method.charAt(0).toUpperCase() + method.slice(1)}`](url).reply(200, {});

  await apiFunction(data);

  expect(mockAxios.history[method].length).toBe(1);
  expect(mockAxios.history[method][0].url).toBe(url);
  if (data) {
    expect(JSON.parse(mockAxios.history[method][0].data)).toEqual(expectedData);
  }
};

describe('Program APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('fetchProgramList sends a POST request to /admin-service/program/list with correct data', async () => {
    const params = {
      limit: 10,
      skip: 0,
      search: 'search'
    };
    const expectedData = {
      limit: params.limit,
      skip: params.skip,
      searchTerm: params.search
    };

    await testApiCall('post', '/admin-service/program/list', params, mockAxios, fetchProgramList, expectedData);
  });

  it('saveProgram sends a POST request to /admin-service/program/create with correct data', async () => {
    const data = {
      name: 'name',
      country: { id: '2' },
      healthFacility: [],
      tenantId: '3'
    };

    await testApiCall('post', '/admin-service/program/create', data, mockAxios, saveProgram);
  });

  it('fetchProgramDetails sends a POST request to /admin-service/program/details with correct data', async () => {
    const data = {
      tenantId: '1',
      id: '2'
    };

    await testApiCall('post', '/admin-service/program/details', data, mockAxios, fetchProgramDetails);
  });

  it('updateProgramDetails sends a PATCH request to /admin-service/program/update with correct data', async () => {
    const data = {
      name: 'name',
      country: '2',
      sites: [],
      tenantId: '3'
    };

    await testApiCall('patch', '/admin-service/program/update', data, mockAxios, updateProgramDetails);
  });

  it('deleteProgram sends a DELETE request to /admin-service/program/remove with correct data', async () => {
    const id = '1';
    const tenantId = '2';
    const regionTenantId = '3';
    const expectedData = { id, tenantId };

    mockAxios.onDelete('/admin-service/program/remove').reply(200, {});

    await deleteProgram(id, tenantId, regionTenantId);

    expect(mockAxios.history.delete.length).toBe(1);
    expect(mockAxios.history.delete[0].url).toBe('/admin-service/program/remove');
    expect(JSON.parse(mockAxios.history.delete[0].data)).toEqual(expectedData);
  });

  it('getHFForDropdown sends a POST request to /admin-service/healthfacility/list with correct data', async () => {
    const tenantId = '2';
    const expectedData = { countryId: tenantId, isPaginated: false };

    await testApiCall(
      'post',
      'admin-service/healthfacility/list',
      { tenantId },
      mockAxios,
      getHFForDropdown,
      expectedData
    );
  });
});
