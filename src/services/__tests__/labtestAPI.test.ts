import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  addLabTestCustomization,
  deleteLabtest,
  fetchLabTest,
  fetchLabtestCustomization,
  fetchUnitList,
  updateLabTestCustomization,
  validateLabtest
} from '../labtestAPI';

describe('Lab Test APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('fetchLabTest sends a POST request to /admin-service/lab-test-customization/list with correct data', async () => {
    const requestData = { countryId: '1', skip: 0, limit: 10, searchTerm: '' };

    mockAxios.onPost('/admin-service/lab-test-customization/list').reply(200, {});

    await fetchLabTest(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/lab-test-customization/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('fetchLabtestCustomization sends a POST request to /admin-service/lab-test-customization/get-by-unique-name with correct data', async () => {
    const requestData = { name: 'Test', countryId: 1 };

    mockAxios.onPost('/admin-service/lab-test-customization/get-by-unique-name').reply(200, {});

    await fetchLabtestCustomization(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/lab-test-customization/get-by-unique-name');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it(`addLabTestCustomization sends a POST request
    to /admin-service/lab-test-customization/create with correct data`, async () => {
    const requestData: any = { name: 'Test', code: '123' };

    mockAxios.onPost('/admin-service/lab-test-customization/create').reply(200, {});

    await addLabTestCustomization(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/lab-test-customization/create');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it(`updateLabTestCustomization sends a POST request
    to /admin-service/lab-test-customization/update with correct data`, async () => {
    const requestData: any = { id: '123', name: 'Updated Test' };

    mockAxios.onPost('/admin-service/lab-test-customization/update').reply(200, {});

    await updateLabTestCustomization(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/lab-test-customization/update');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it(`deleteLabtest sends a POST request
    to /admin-service/lab-test-customization/delete with correct data`, async () => {
    const requestData = { id: 123, tenantId: 1 };

    mockAxios.onPost('/admin-service/lab-test-customization/delete').reply(200, {});

    await deleteLabtest(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/lab-test-customization/delete');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('fetchUnitList sends a GET request to /admin-service/unit/list/LABTEST with correct data', async () => {
    mockAxios.onGet('/admin-service/unit/list/LABTEST').reply(200, {});

    await fetchUnitList();

    expect(mockAxios.history.get.length).toBe(1);
    expect(mockAxios.history.get[0].url).toBe('/admin-service/unit/list/LABTEST');
  });

  it(`validateLabtest sends a POST request
    to admin-service/lab-test-customization/validate with correct data`, async () => {
    const requestData = { name: 'Test', countryId: '1' };

    mockAxios.onPost('admin-service/lab-test-customization/validate').reply(200, {});

    await validateLabtest(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('admin-service/lab-test-customization/validate');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });
});
