import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchHealthFacilityList,
  fetchDistrictList,
  fetchChiefdomList,
  fetchCultureList,
  createHealthFacility,
  fetchHFSummary,
  fetchHFUserList,
  updateHFDetails,
  addHFUser,
  updateHFUser,
  deleteHFUser,
  deleteHealtFacility,
  fetchHealthFacilityTypes,
  fetchHFUserDetail,
  fetchVillagesList,
  fetchUnlinkedVillagesAPI,
  fetchVillagesListfromHF,
  fetchPeerSupervisorList,
  fetchWorkflowList,
  peerSupervisorValidation,
  validateLinkedRestrictionsAPI,
  fetchCountryCodeList
} from '../healthFacilityAPI';
import { HF_SUMMARY, HF_USER } from '../../tests/mockData/healthFacilityConstants';

describe('Health Facility APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it(`fetchHealthFacilityList sends a POST request to
    admin-service/healthfacility/list with correct data`, async () => {
    const params: any = {
      countryId: 1,
      limit: 10,
      skip: 10,
      userBased: false,
      tenantBased: false,
      searchTerm: 'example',
      tenantIds: ['1']
    };

    mockAxios.onPost('admin-service/healthfacility/list').reply(200, {});

    await fetchHealthFacilityList(params);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('admin-service/healthfacility/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(params);
  });

  it('fetchHealthFacilityList sends a POST request to admin-service/healthfacility/list with correct data without search and skip', async () => {
    const params: any = {
      countryId: 1,
      limit: 0,
      skip: 0,
      userBased: false,
      tenantBased: false,
      searchTerm: ''
    };

    mockAxios.onPost('admin-service/healthfacility/list').reply(200, {});

    await fetchHealthFacilityList(params);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('admin-service/healthfacility/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      ...params,
      skip: null,
      limit: null,
      tenantIds: []
    });
  });

  it('fetchDistrictList sends a GET request to /admin-service/district-list with correct data', async () => {
    const countryId = 1;
    const appTypes = ['NON_COMMUNITY'];

    mockAxios.onPost('/admin-service/district-list').reply(200, {});

    await fetchDistrictList(countryId, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/district-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      countryId,
      appTypes
    });
  });

  it(`fetchChiefdomList sends a POST request to
    /admin-service/chiefdom-list with correct data`, async () => {
    const countryId = 1;
    const districtId = 1;
    const appTypes = ['COMMUNITY'];

    mockAxios.onPost('/admin-service/chiefdom-list').reply(200, {});

    await fetchChiefdomList(countryId, districtId, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/chiefdom-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      countryId,
      districtId,
      appTypes
    });
  });

  it('fetchCultureList sends a POST request to /admin-service/cultures', async () => {
    mockAxios.onPost('/admin-service/cultures').reply(200, {});

    await fetchCultureList();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/cultures');
  });

  it(`createHealthFacility sends a POST request to
    /user-service/organization/create-healthfacility with correct data`, async () => {
    const data: any = {
      ...HF_SUMMARY,
      users: [HF_USER]
    };

    mockAxios.onPost('/user-service/organization/create-healthfacility').reply(200, {});

    await createHealthFacility(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/organization/create-healthfacility');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('fetchHFSummary sends a POST request to /admin-service/healthfacility/details with correct data', async () => {
    const tenantId = '1';
    const id = 2;
    const appTypes = ['COMMUNITY'];

    mockAxios.onPost('/admin-service/healthfacility/details').reply(200, {});

    await fetchHFSummary(tenantId, id, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/healthfacility/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ tenantId, id, appTypes });
  });

  it('fetchHFUserList sends a POST request to /user-service/user/admin-users with correct data', async () => {
    const params: any = {
      searchTerm: 'example',
      countryId: '1',
      tenantId: '1',
      limit: 5,
      skip: 10
    };

    mockAxios.onPost('/user-service/user/admin-users').reply(200, {});

    await fetchHFUserList(params);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/admin-users');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(params);
  });

  it('updateHFDetails sends a PUT request to /admin-service/healthfacility/update with correct data', async () => {
    const data = {
      ...HF_SUMMARY
    } as any;

    mockAxios.onPut('/admin-service/healthfacility/update').reply(200, {});

    await updateHFDetails(data);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/healthfacility/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(data);
  });

  it('addHFUser sends a POST request to /admin-service/healthfacility/user-add with correct data', async () => {
    const data = {
      user: {
        ...HF_USER
      },
      id: '1',
      tenantId: '2'
    } as any;

    mockAxios.onPost('/admin-service/healthfacility/user-add').reply(200, {});

    await addHFUser(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/healthfacility/user-add');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('updateHFUser sends a PUT request to /admin-service/healthfacility/user-update with correct data', async () => {
    const data = {
      ...HF_USER,
      id: 1
    } as any;

    mockAxios.onPut('/admin-service/healthfacility/user-update').reply(200, {});

    await updateHFUser(data);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/healthfacility/user-update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(data);
  });

  it('deleteHFUser sends a POST request to /admin-service/healthfacility/user-remove with correct data', async () => {
    const data = {
      id: 1,
      countryId: 1,
      tenantIds: [4],
      appTypes: ['COMMUNITY']
    };

    mockAxios.onPost('/admin-service/healthfacility/user-remove').reply(200, {});

    await deleteHFUser(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/healthfacility/user-remove');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it(`deleteHealtFacility sends a POST request to
    /user-service/organization/delete-healthfacility with correct data`, async () => {
    const data = {
      id: 1,
      tenantId: 2
    };

    mockAxios.onPost('/user-service/organization/delete-healthfacility').reply(200, {});

    await deleteHealtFacility(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/organization/delete-healthfacility');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it(`fetchHealthFacilityTypes sends a POST request
    to /admin-service/healthfacility-types with correct data`, async () => {
    mockAxios.onPost('/admin-service/healthfacility-types').reply(200, {});

    await fetchHealthFacilityTypes();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/healthfacility-types');
  });

  it('fetchHFUserDetail sends a POST request to /user-service/user/details with correct data', async () => {
    const id = 1;

    mockAxios.onPost(`/user-service/user/details/${id}`).reply(200, {});

    await fetchHFUserDetail(id);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe(`/user-service/user/details/${id}`);
  });

  it('fetchVillagesList sends a POST request to /admin-service/villages-list with correct data', async () => {
    const countryId = 1;
    const districtId = 1;
    const chiefdomId = 1;
    const appTypes = ['NON_COMMUNITY'];

    mockAxios.onPost('/admin-service/villages-list').reply(200, {});

    await fetchVillagesList(countryId, districtId, chiefdomId, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/villages-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ countryId, districtId, chiefdomId, appTypes });
  });

  it(`fetchUnlinkedVillagesAPI sends a POST request to
    admin-service/unlinked-villages-list with correct data`, async () => {
    const countryId = 1;
    const districtId = 1;
    const chiefdomId = 1;
    const healthFacilityId = 1;
    const appTypes = ['NON_COMMUNITY'];

    mockAxios.onPost('admin-service/unlinked-villages-list').reply(200, {});

    await fetchUnlinkedVillagesAPI(countryId, districtId, chiefdomId, appTypes, healthFacilityId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('admin-service/unlinked-villages-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      countryId,
      districtId,
      chiefdomId,
      healthFacilityId,
      appTypes
    });
  });

  it('fetchVillagesListfromHF sends a POST request to /admin-service/healthfacility/unlinked-villages-list with correct data', async () => {
    const userId = 1;
    const tenantIds = [1];
    const appTypes = ['NON_COMMUNITY'];

    mockAxios.onPost('/admin-service/healthfacility/unlinked-villages-list').reply(200, {});

    await fetchVillagesListfromHF(tenantIds, userId, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/healthfacility/unlinked-villages-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantIds,
      userId,
      appTypes
    });
  });

  it(`fetchPeerSupervisorList sends a POST request to
    /user-service/user/peer-supervisors with correct data`, async () => {
    const tenantIds = [1];
    const appTypes = ['NON_COMMUNITY'];

    mockAxios.onPost('/user-service/user/peer-supervisors').reply(200, {});

    await fetchPeerSupervisorList(tenantIds, appTypes);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/peer-supervisors');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantIds,
      appTypes
    });
  });

  it('fetchWorkflowList sends a POST request to /admin-service/clinical-workflow/list with correct data', async () => {
    const tenantId = 1;

    mockAxios.onPost('/admin-service/clinical-workflow/list').reply(200, {});

    await fetchWorkflowList(tenantId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/clinical-workflow/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(tenantId);
  });

  it(`peerSupervisorValidation sends a POST request
    to /user-service/user/validate-peer-supervisors with correct data`, async () => {
    const tenantId = 1;

    mockAxios.onPost('/user-service/user/validate-peer-supervisors').reply(200, {});

    await peerSupervisorValidation(tenantId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/validate-peer-supervisors');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(tenantId);
  });

  it(`validateLinkedRestrictionsAPI sends a POST request
    to /admin-service/healthfacility/validate with correct data`, async () => {
    const tenantId = 1;

    mockAxios.onPost('/admin-service/healthfacility/validate').reply(200, {});

    await validateLinkedRestrictionsAPI(tenantId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/healthfacility/validate');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(tenantId);
  });

  it('fetchCountryCodeList sends a POST request to /admin-service/country-codes with correct data', async () => {
    mockAxios.onPost('/admin-service/country-codes').reply(200, {});

    await fetchCountryCodeList();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/country-codes');
  });
});
