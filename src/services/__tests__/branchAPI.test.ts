import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchBranchList, createBranch, updateBranch, fetchBranchById, fetchBranchesByUnions } from '../branchAPI';

describe('Branch API', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('fetchBranchList sends a POST request to /admin-service/branch/list with correct data', async () => {
    const requestData = {
      countryId: 1,
      limit: 10,
      skip: 0,
      searchTerm: '',
      districtIds: [],
      chiefdomIds: []
    };

    mockAxios.onPost('/admin-service/branch/list').reply(200, {});

    await fetchBranchList(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/branch/list');
    expect(mockAxios.history.post[0].method).toBe('post');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('createBranch sends a POST request to /admin-service/branch/create with correct data', async () => {
    const requestData = {
      name: 'Branch A',
      code: 'BR001',
      currentAccountCode: 'ACC001',
      districtId: 1,
      chiefdomId: 1,
      skPositionCount: 0,
      ssPositionCount: 0,
      poPositionCount: 0,
      foPositionCount: 0
    };

    mockAxios.onPost('/admin-service/branch/create').reply(200, {});

    await createBranch(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/branch/create');
    expect(mockAxios.history.post[0].method).toBe('post');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('updateBranch sends a PUT request to /admin-service/branch/update with correct data', async () => {
    const requestData = {
      id: 1,
      name: 'Branch A Updated',
      code: 'BR001',
      currentAccountCode: 'ACC001',
      districtId: 1,
      chiefdomId: 1,
      skPositionCount: 1,
      ssPositionCount: 2,
      poPositionCount: 0,
      foPositionCount: 0
    };

    mockAxios.onPut('/admin-service/branch/update').reply(200, {});

    await updateBranch(requestData);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/branch/update');
    expect(mockAxios.history.put[0].method).toBe('put');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(requestData);
  });

  it('fetchBranchById sends a GET request to /admin-service/branch/:branchId', async () => {
    const branchId = 1;
    mockAxios.onGet(`/admin-service/branch/${branchId}`).reply(200, { entity: {} });

    await fetchBranchById(branchId);

    expect(mockAxios.history.get.length).toBe(1);
    expect(mockAxios.history.get[0].url).toBe(`/admin-service/branch/${branchId}`);
    expect(mockAxios.history.get[0].method).toBe('get');
  });

  it('fetchBranchesByUnions sends unionIds to region filters endpoint', async () => {
    const unionIds = [1, 2, 3];
    mockAxios.onPost('/admin-service/branch/list-by-region-filters').reply(200, {});

    await fetchBranchesByUnions({ unionIds });

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/branch/list-by-region-filters');
    expect(mockAxios.history.post[0].method).toBe('post');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ unionIds });
  });

  it('fetchBranchesByUnions sends optional districtIds and chiefdomIds', async () => {
    const payload = { districtIds: [10, 20], chiefdomIds: [100], unionIds: [1] };
    mockAxios.onPost('/admin-service/branch/list-by-region-filters').reply(200, {});

    await fetchBranchesByUnions(payload);

    expect(mockAxios.history.post.length).toBe(1);
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(payload);
  });
});
