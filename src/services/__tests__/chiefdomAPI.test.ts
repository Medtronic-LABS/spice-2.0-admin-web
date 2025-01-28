import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  createChiefdom,
  createChiefdomAdmin,
  deleteChiefdomAdmin,
  fetchChiefdomAdmins,
  fetchChiefdomById,
  fetchChiefdomDashboardList,
  fetchChiefdomForDropdown,
  fetchChiefdomList,
  getChiefdomDetails,
  updateChiefdom,
  updateChiefdomAdmin
} from '../chiefdomAPI';

describe('Chiefdom APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  const testLabel = 'fetchChiefdomDashboardList sends a POST request to /admin-service/chiefdom/list with correct data';
  it(testLabel, async () => {
    const tenantId = '1';
    const limit = 10;
    const skip = 0;
    const sort = 'name';
    const searchTerm = 'example';
    const appTypes = ['COMMUNITY'];

    mockAxios.onPost('/admin-service/chiefdom/list').reply(200, {});

    await fetchChiefdomDashboardList(tenantId, limit, skip, sort, appTypes, searchTerm);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      limit,
      skip,
      sort,
      tenantId,
      searchTerm,
      appTypes
    });
  });

  it('fetchChiefdomDashboardList sends a POST request to /admin-service/chiefdom/list with correct data without searchterm', async () => {
    const tenantId = '1';
    const limit = 10;
    const skip = 0;
    const sort = 'name';
    const searchTerm = '';
    const appTypes = ['COMMUNITY'];

    mockAxios.onPost('/admin-service/chiefdom/list').reply(200, {});

    await fetchChiefdomDashboardList(tenantId, limit, skip, sort, appTypes, searchTerm);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      limit,
      skip,
      sort,
      tenantId,
      searchTerm,
      appTypes
    });
  });

  const testLabel1 = 'getChiefdomDetails sends a POST request to /admin-service/chiefdom/details with correct data';
  it(testLabel1, async () => {
    const tenantId = '1';
    const id = '2';

    mockAxios.onPost('/admin-service/chiefdom/details').reply(200, {});

    await getChiefdomDetails({ tenantId, id });

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ tenantId, id });
  });

  it('fetchChiefdomList sends a POST request to /admin-service/chiefdom/all with correct data', async () => {
    const tenantId = '1';
    const limit = 10;
    const skip = 0;
    const searchName = 'example';

    mockAxios.onPost('/admin-service/chiefdom/all').reply(200, {});

    await fetchChiefdomList(tenantId, limit, skip, searchName);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/all');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantId,
      limit,
      skip,
      searchTerm: searchName
    });
  });

  it(`fetchChiefdomList sends a POST request
    to /admin-service/chiefdom/all with correct data without search term`, async () => {
    const tenantId = '1';
    const limit = 10;
    const skip = 0;
    const searchName = '';

    mockAxios.onPost('/admin-service/chiefdom/all').reply(200, {});

    await fetchChiefdomList(tenantId, limit, skip, searchName);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/all');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantId,
      limit,
      skip,
      searchTerm: searchName
    });
  });

  const testLabel2 =
    'createChiefdom sends a POST request to /user-service/organization/create-chiefdom with correct data';
  it(testLabel2, async () => {
    const data = {
      id: '1',
      name: 'OU 1',
      districtId: 1,
      countryId: 1,
      parentOrganizationId: 1,
      tenantId: '4',
      users: []
    };

    mockAxios.onPost('/user-service/organization/create-chiefdom').reply(200, {});

    await createChiefdom(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/organization/create-chiefdom');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('updateChiefdom sends a PUT request to /admin-service/chiefdom/update with correct data', async () => {
    const data = {
      id: '1',
      name: 'OU 1',
      districtId: 1,
      countryId: 1,
      parentOrganizationId: 1,
      tenantId: '4',
      users: []
    };

    mockAxios.onPut('/admin-service/chiefdom/update').reply(200, {});

    await updateChiefdom(data);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/chiefdom/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
      id: data.id,
      tenantId: data.tenantId,
      name: data.name
    });
  });

  const testLabel3 = 'createChiefdomAdmin sends a POST request to /admin-service/chiefdom/user-add with correct data';
  it(testLabel3, async () => {
    const data = {
      id: '1',
      email: 'email',
      username: 'email',
      firstName: 'firstName',
      lastName: 'lastName'
    } as any;

    mockAxios.onPost('/admin-service/chiefdom/user-add').reply(200, {});

    await createChiefdomAdmin(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/user-add');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  const testLabel4 = 'updateChiefdomAdmin sends a PUT request to /admin-service/chiefdom/user-update with correct data';
  it(testLabel4, async () => {
    const data = {
      id: '1',
      email: 'email',
      username: 'email',
      firstName: 'firstName',
      lastName: 'lastName'
    } as any;
    mockAxios.onPut('/admin-service/chiefdom/user-update').reply(200, {});

    await updateChiefdomAdmin(data);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/chiefdom/user-update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(data);
  });

  const testLabel5 =
    'deleteChiefdomAdmin sends a DELETE request to /admin-service/chiefdom/user-remove with correct data';
  it(testLabel5, async () => {
    const data = {
      id: '2',
      tenantId: '4'
    };

    mockAxios.onDelete('/admin-service/chiefdom/user-remove').reply(200, {});

    await deleteChiefdomAdmin(data);

    expect(mockAxios.history.delete.length).toBe(1);
    expect(mockAxios.history.delete[0].url).toBe('/admin-service/chiefdom/user-remove');
    expect(JSON.parse(mockAxios.history.delete[0].data)).toEqual(data);
  });

  const testLabel6 = 'fetchChiefdomById sends a POST request to /admin-service/chiefdom/details with correct data';
  it(testLabel6, async () => {
    const data = {
      id: '2',
      tenantId: '4'
    };

    mockAxios.onPost('/admin-service/chiefdom/details').reply(200, {});

    await fetchChiefdomById(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ ...data, is_user_not_required: true });
  });

  it('fetchChiefdomAdmins sends a POST request to /user-service/user/admin-users with correct data', async () => {
    const data = {
      id: '1',
      tenantId: '3',
      roleNames: ['SPICE'],
      searchTerm: ''
    };

    mockAxios.onPost('/user-service/user/admin-users').reply(200, {});

    await fetchChiefdomAdmins(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/admin-users');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  const testLabel7 = 'fetchChiefdomForDropdown sends a POST request to /admin-service/chiefdom/all with correct data';
  it(testLabel7, async () => {
    const params = {
      tenantId: '1'
    };

    mockAxios.onPost('/admin-service/chiefdom/all').reply(200, {});

    await fetchChiefdomForDropdown(params);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom/all');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantId: params.tenantId,
      isPaginated: false
    });
  });
});
