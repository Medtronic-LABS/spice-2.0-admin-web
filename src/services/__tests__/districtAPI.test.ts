import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchDeactivatedAccounts,
  activateAccount,
  fetchDistrictList,
  createDistrict,
  fetchDistrictDetails,
  fetchDashboardDistrict,
  updateDistrict,
  createDistrictAdmin,
  updateDistrictAdmin,
  deleteDistrictAdmin,
  deactivateDistrict,
  fetchDistrictOptions,
  fetchDistrictAdmins
} from '../districtAPI';

describe('District APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('fetchDistrictList sends a POST request to /admin-service/district/district-list with correct data', async () => {
    const tenantId = 1;
    const isActive = true;
    const skip = 0;
    const limit = 0;
    const search = 'example';
    const appTypes = ['COMMUNITY'];
    const expectedData = {
      tenantId: 1,
      countryId: 1,
      skip,
      limit,
      is_active: isActive,
      searchTerm: search,
      appTypes: ['COMMUNITY']
    };

    mockAxios.onPost('/admin-service/district/district-list').reply(200, {});

    await fetchDistrictList(1, tenantId, isActive, skip, limit, appTypes, search);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/district-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it('fetchDistrictList sends a POST request to /admin-service/district/district-list with correct data and no search term', async () => {
    const tenantId = 1;
    const isActive = true;
    const skip = 0;
    const limit = 10;
    const appTypes = ['COMMUNITY'];
    const expectedData = {
      tenantId: 1,
      countryId: 1,
      skip,
      limit,
      is_active: isActive,
      searchTerm: '',
      appTypes: ['COMMUNITY']
    };

    mockAxios.onPost('/admin-service/district/district-list').reply(200, {});

    await fetchDistrictList(1, tenantId, isActive, skip, limit, appTypes, '');

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/district-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it(`fetchDeactivatedAccounts sends a POST request to
    /admin-service/district/deactivate-list with correct data`, async () => {
    const skip = 0;
    const limit = 10;
    const sort = 'name';
    const search = 'example';
    const tenantId = '1';
    const expectedData = {
      skip,
      limit,
      sort,
      searchTerm: search,
      tenantId
    };

    mockAxios.onPost('/admin-service/district/deactivate-list').reply(200, {});

    await fetchDeactivatedAccounts(skip, limit, sort, search, tenantId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/deactivate-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it('fetchDeactivatedAccounts sends a POST request to /admin-service/district/deactivate-list without search term and tenant ID', async () => {
    const skip = 0;
    const limit = 10;
    const sort = 'name';
    const expectedData = {
      skip,
      limit,
      sort,
      searchTerm: ''
    };

    mockAxios.onPost('/admin-service/district/deactivate-list').reply(200, {});

    await fetchDeactivatedAccounts(skip, limit, sort);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/deactivate-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it(`createDistrict sends a POST request to
    /user-service/organization/create-district with correct data`, async () => {
    const data = {
      name: 'Test Region',
      tenantId: 3,
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
          },
          country: '1'
        }
      ]
    };

    mockAxios.onPost('/user-service/organization/create-district').reply(200, {});

    await createDistrict(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/organization/create-district');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('fetchDistrictDetails sends a POST request to /admin-service/district/details with correct data', async () => {
    const requestData = { tenantId: 1, id: 123 };

    mockAxios.onPost('/admin-service/district/details').reply(200, {});

    await fetchDistrictDetails(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('fetchDashboardDistrict sends a POST request to /admin-service/district/list with correct data', async () => {
    const requestData = { skip: 0, limit: 10, tenantId: '1', searchTerm: 'example' };

    mockAxios.onPost('/admin-service/district/list').reply(200, {});

    await fetchDashboardDistrict(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('updateDistrict sends a POST request to /admin-service/district/update with correct data', async () => {
    const data = { id: 123, name: 'John Doe', tenantId: '1' } as any;

    mockAxios.onPost('/admin-service/district/update').reply(200, {});

    await updateDistrict(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/update');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('createDistrictAdmin sends a POST request to /admin-service/district/user-add with correct data', async () => {
    const adminData: any = { id: 123, username: 'admin', email: 'admin@example.com' };

    mockAxios.onPost('/admin-service/district/user-add').reply(200, {});

    await createDistrictAdmin(adminData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/user-add');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(adminData);
  });

  it('updateDistrictAdmin sends a PUT request to /admin-service/district/user-update with correct data', async () => {
    const adminData = { id: 123, username: 'admin', email: 'admin@example.com' } as any;

    mockAxios.onPut('/admin-service/district/user-update').reply(200, {});

    await updateDistrictAdmin(adminData);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/district/user-update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(adminData);
  });

  it(`deleteDistrictAdmin sends a DELETE request to
    /admin-service/district/user-remove with correct data`, async () => {
    const data = { tenantId: '1', id: '123' };

    mockAxios.onDelete('/admin-service/district/user-remove').reply(200, {});

    await deleteDistrictAdmin(data);

    expect(mockAxios.history.delete.length).toBe(1);
    expect(mockAxios.history.delete[0].url).toBe('/admin-service/district/user-remove');
    expect(JSON.parse(mockAxios.history.delete[0].data)).toEqual(data);
  });

  it('activateAccount sends a PUT request to /admin-service/district/activate with correct data', async () => {
    const requestData = { tenantId: 1 } as any;

    mockAxios.onPut('/admin-service/district/activate').reply(200, {});

    await activateAccount(requestData);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/district/activate');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(requestData);
  });

  it('deactivateDistrict sends a POST request to /admin-service/district/deactivate with correct data', async () => {
    const requestData = { tenantId: 1, id: 123, status: 'in_active', reason: 'unable to pay' };

    mockAxios.onPost('/admin-service/district/deactivate').reply(200, {});

    await deactivateDistrict(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/deactivate');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it(`fetchDistrictOptions sends a POST request to
    /admin-service/district/district-list with correct data`, async () => {
    const requestData = { tenantId: 1, skip: 0, limit: 10, searchTerm: '' } as any;

    mockAxios.onPost('/admin-service/district/district-list').reply(200, {});

    await fetchDistrictOptions(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district/district-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('fetchDistrictAdmins sends a POST request to /user-service/user/admin-users with correct data', async () => {
    const requestData = { tenantId: '1', skip: 0, limit: 0, searchTerm: '', roleNames: ['SPICE'], countryId: 1 };

    mockAxios.onPost('/user-service/user/admin-users').reply(200, {});

    await fetchDistrictAdmins(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/admin-users');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });
});
