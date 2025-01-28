import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getMedicationList,
  getMedicationClassifications,
  getMedicationDosageForm,
  getMedicationCategory,
  createMedication,
  updateMedication,
  validateMedication,
  deleteMedication
} from '../medicationAPI';

describe('Medication APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('getMedicationList sends a POST request to /admin-service/medication/list with correct data', async () => {
    const skip = 0;
    const limit = 10;
    const countryId = '1';
    const search = 'test';

    mockAxios.onPost('/admin-service/medication/list').reply(200, {});

    await getMedicationList(skip, limit, countryId, search);
    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/medication/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      skip,
      limit,
      countryId: Number(countryId),
      searchTerm: 'test'
    });
  });

  it('getMedicationList sends a POST request to /admin-service/medication/list without search', async () => {
    const skip = 0;
    const limit = 10;
    const countryId = '1';

    mockAxios.onPost('/admin-service/medication/list').reply(200, {});

    await getMedicationList(skip, limit, countryId);
    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/medication/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      skip,
      limit,
      countryId: Number(countryId)
    });
  });

  it('getMedicationClassifications sends a POST request to /admin-service/medication/classification-list with correct data', async () => {
    const countryId = 1;
    mockAxios.onPost('/admin-service/medication/classification-list').reply(200, {});
    await getMedicationClassifications(countryId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/medication/classification-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ countryId });
  });

  it(`getMedicationDosageForm sends a POST request
    to /admin-service/medication/dosageform-list with correct data`, async () => {
    mockAxios.onPost('/admin-service/medication/dosageform-list').reply(200, {});
    await getMedicationDosageForm();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/medication/dosageform-list');
  });

  it('createMedication sends a POST request to /admin-service/medication/create with correct data', async () => {
    const requestData = {
      name: 'test',
      countryId: 1,
      classificationId: '1',
      classificationName: 'ACE inhibitor',
      brandId: '2',
      brandName: 'Biomet',
      medicationName: 'Testt',
      dosageFormId: '1',
      dosageFormName: 'Tablet',
      tenantId: '1'
    };

    mockAxios.onPost('/admin-service/medication/create').reply(200, {});

    await createMedication(requestData);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/medication/create');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(requestData);
  });

  it('updateMedication should send a PUT request to /admin-service/medication/update with correct data', async () => {
    const data = {
      id: '123',
      name: 'test',
      countryId: 1,
      classificationId: '1',
      classificationName: 'ACE inhibitor',
      brandId: '2',
      brandName: 'Biomet',
      medicationName: 'Testt',
      dosageFormId: '1',
      dosageFormName: 'Tablet',
      tenantId: '1'
    };

    mockAxios.onPut('/admin-service/medication/update').reply(200, {});

    await updateMedication(data);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/medication/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(data);
  });

  it(`validateMedication should send a POST request
    to /admin-service/medication/validate with correct data`, async () => {
    const data = {
      name: 'test',
      countryId: 1,
      classificationId: '1',
      classificationName: 'ACE inhibitor',
      brandId: '2',
      brandName: 'Biomet',
      medicationName: 'Testt',
      dosageFormId: '1',
      dosageFormName: 'Tablet',
      tenantId: '1'
    };

    mockAxios.onPost('/admin-service/medication/validate').reply(200, {});

    await validateMedication(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/medication/validate');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('deleteMedication should send a POST request to /admin-service/medication/remove with correct data', async () => {
    const data = { id: '1', tenantId: '1' };

    mockAxios.onPost('admin-service/medication/remove').reply(200, {});

    await deleteMedication(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('admin-service/medication/remove');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });
});
