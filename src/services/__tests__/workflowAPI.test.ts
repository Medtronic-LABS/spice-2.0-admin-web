import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchCustomizationForm,
  fetchFormMeta,
  updateCustomizationForm,
  deactivateConsentForm,
  fetchClinicalWorkflows,
  createWorkflowModule,
  updateWorkflowModule,
  deleteWorkflowModule
} from '../workflowAPI';

describe('Workflow APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it(`fetchCustomizationForm sends a POST request
    to /admin-service/country-customization/details with correct data`, async () => {
    const request: any = {
      tenantId: '1',
      formType: 'formType',
      category: 'category',
      cultureId: 'cultureId',
      countryId: 'countryId',
      districtId: undefined,
      clinicalWorkflowId: undefined
    };

    mockAxios.onPost('/admin-service/country-customization/details').reply(200, {});

    await fetchCustomizationForm(request);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/country-customization/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantId: '1',
      type: 'formType',
      category: 'category',
      cultureId: 'cultureId',
      countryId: 'countryId',
      districtId: undefined,
      clinicalWorkflowId: undefined
    });
  });

  it(`fetchCustomizationForm sends a POST request
    to /admin-service/workflow-customization/details with district Id`, async () => {
    const request = {
      tenantId: '1',
      formType: 'formType',
      category: 'category',
      cultureId: 'cultureId',
      countryId: 'countryId',
      districtId: '1',
      clinicalWorkflowId: undefined
    } as any;

    mockAxios.onPost('/admin-service/workflow-customization/details').reply(200, {});

    await fetchCustomizationForm(request);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/workflow-customization/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantId: '1',
      type: 'formType',
      category: 'category',
      cultureId: 'cultureId',
      countryId: 'countryId',
      districtId: '1',
      clinicalWorkflowId: undefined
    });
  });

  it(`fetchCustomizationForm sends a POST request
    to /admin-service/workflow-customization/details with clinicalWorkflowId Id`, async () => {
    const request = {
      tenantId: '1',
      formType: 'formType',
      category: 'category',
      cultureId: 'cultureId',
      countryId: 'countryId',
      districtId: undefined,
      clinicalWorkflowId: '1'
    } as any;

    mockAxios.onPost('/admin-service/workflow-customization/details').reply(200, {});

    await fetchCustomizationForm(request);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/workflow-customization/details');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      tenantId: '1',
      type: 'formType',
      category: 'category',
      cultureId: 'cultureId',
      countryId: 'countryId',
      districtId: undefined,
      clinicalWorkflowId: '1'
    });
  });

  it(`fetchFormMeta sends a GET request
    to /spice-service/static-data/get-meta-form with correct formType`, async () => {
    const formType = 'screeninglog';

    mockAxios.onGet(`spice-service/static-data/get-meta-form?form=${formType}`).reply(200, {});

    await fetchFormMeta(formType);

    expect(mockAxios.history.get.length).toBe(1);
    expect(mockAxios.history.get[0].url).toBe(`spice-service/static-data/get-meta-form?form=${formType}`);
  });

  it('updateCustomizationForm sends a PUT request to /admin-service/workflow-customization/update if formId and districtId are present', async () => {
    const formType = 'consent';
    const formId = '1';
    const category = 'category';
    const tenantId = '2';
    const payload = { field: 'value' };
    const countryId = '3';
    const districtId = '4';
    const workflowId = '5';
    const clinicalWorkflowId = undefined;
    const cultureId = 7;

    mockAxios.onPut('/admin-service/workflow-customization/update').reply(200, {});

    await updateCustomizationForm({
      formType,
      formId,
      category,
      tenantId,
      payload,
      countryId,
      districtId,
      workflowId,
      clinicalWorkflowId,
      cultureId
    } as any);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/workflow-customization/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    });
  });

  it('updateCustomizationForm sends a PUT request to /admin-service/workflow-customization/update if formId and clinicalWorkflowId are present', async () => {
    const formType = 'consent';
    const formId = '1';
    const category = 'category';
    const tenantId = '2';
    const payload = { field: 'value' };
    const countryId = '3';
    const districtId = undefined;
    const workflowId = '5';
    const clinicalWorkflowId = '6';
    const cultureId = 7;

    mockAxios.onPut('/admin-service/workflow-customization/update').reply(200, {});

    await updateCustomizationForm({
      formType,
      formId,
      category,
      tenantId,
      payload,
      countryId,
      districtId,
      workflowId,
      clinicalWorkflowId,
      cultureId
    } as any);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/workflow-customization/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    });
  });

  it('updateCustomizationForm sends a POST request to /admin-service/workflow-customization/create if formId and districtId are present', async () => {
    const formType = 'consent';
    const formId = undefined;
    const category = 'category';
    const tenantId = '2';
    const payload = { field: 'value' };
    const countryId = '3';
    const districtId = '4';
    const workflowId = '5';
    const clinicalWorkflowId = undefined;
    const cultureId = 7;

    mockAxios.onPost('/admin-service/workflow-customization/create').reply(200, {});

    await updateCustomizationForm({
      formType,
      formId,
      category,
      tenantId,
      payload,
      countryId,
      districtId,
      workflowId,
      clinicalWorkflowId,
      cultureId
    } as any);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/workflow-customization/create');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    });
  });

  it('updateCustomizationForm sends a POST request to /admin-service/workflow-customization/create if formId and clinicalWorkflowId are present', async () => {
    const formType = 'consent';
    const formId = undefined;
    const category = 'category';
    const tenantId = '2';
    const payload = { field: 'value' };
    const countryId = '3';
    const districtId = undefined;
    const workflowId = '5';
    const clinicalWorkflowId = '4';
    const cultureId = 7;

    mockAxios.onPost('/admin-service/workflow-customization/create').reply(200, {});

    await updateCustomizationForm({
      formType,
      formId,
      category,
      tenantId,
      payload,
      countryId,
      districtId,
      workflowId,
      clinicalWorkflowId,
      cultureId
    } as any);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/workflow-customization/create');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    });
  });

  it(`updateCustomizationForm sends a PUT request
    to /admin-service/country-customization/update if formId is present`, async () => {
    const formType = 'consent';
    const formId = '1';
    const category = 'category';
    const tenantId = '2';
    const payload = { field: 'value' };
    const countryId = '3';
    const districtId = undefined;
    const workflowId = '5';
    const clinicalWorkflowId = undefined;
    const cultureId = 7;

    mockAxios.onPut('/admin-service/country-customization/update').reply(200, {});

    await updateCustomizationForm({
      formType,
      formId,
      category,
      tenantId,
      payload,
      countryId,
      districtId,
      workflowId,
      clinicalWorkflowId,
      cultureId
    } as any);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/country-customization/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    });
  });

  it('updateCustomizationForm sends a POST request to /admin-service/country-customization/create if formId is not present', async () => {
    const formType = 'consent';
    const formId = undefined;
    const category = 'category';
    const tenantId = '2';
    const payload = { field: 'value' };
    const countryId = '3';
    const districtId = undefined;
    const workflowId = '5';
    const clinicalWorkflowId = undefined;
    const cultureId = 7;

    mockAxios.onPost('/admin-service/country-customization/create').reply(200, {});

    await updateCustomizationForm({
      formType,
      formId,
      category,
      tenantId,
      payload,
      countryId,
      districtId,
      workflowId,
      clinicalWorkflowId,
      cultureId
    } as any);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/country-customization/create');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      type: formType,
      countryId,
      tenantId,
      districtId,
      category,
      formInput: payload,
      id: formId,
      workflow: workflowId,
      clinicalWorkflowId,
      cultureId
    });
  });

  it(`deactivateConsentForm sends a PUT request
    to /admin-service/workflow-customization/remove with correct data`, async () => {
    const formType = 'Screening';
    const formId = 'someFormId';
    const category = 'someCategory';
    const tenantId = '1';

    mockAxios.onPut('/admin-service/workflow-customization/remove').reply(200, {});

    await deactivateConsentForm({ formType, formId, category, tenantId } as any);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/workflow-customization/remove');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
      type: formType,
      tenantId,
      category,
      id: formId
    });
  });

  it(`fetchClinicalWorkflows sends a POST request
    to /admin-service/clinical-workflow/list with correct data`, async () => {
    const request = {
      countryId: '1',
      tenantId: '1',
      limit: 10,
      skip: 0,
      searchTerm: 'example'
    };

    mockAxios.onPost('/admin-service/clinical-workflow/list').reply(200, {});

    await fetchClinicalWorkflows(request);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/clinical-workflow/list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(request);
  });

  it(`createWorkflowModule sends a POST request
    to /admin-service/clinical-workflow/create with correct data`, async () => {
    const request = {
      name: 'Test',
      viewScreens: ['Screening', 'Assessment'],
      countryId: '1',
      tenantId: '1',
      id: '1'
    };

    mockAxios.onPost('/admin-service/clinical-workflow/create').reply(200, {});

    await createWorkflowModule(request);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/clinical-workflow/create');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(request);
  });

  it(`updateWorkflowModule sends a PUT request
    to /admin-service/clinical-workflow/update with correct data`, async () => {
    const request = {
      name: 'Test',
      viewScreens: ['Screening', 'Assessment'],
      countryId: '1',
      tenantId: '1',
      id: '1'
    };

    mockAxios.onPut('/admin-service/clinical-workflow/update').reply(200, {});

    await updateWorkflowModule(request);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/clinical-workflow/update');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(request);
  });

  it(`deleteWorkflowModule sends a PUT request
    to /admin-service/clinical-workflow/remove with correct data`, async () => {
    const request = {
      id: '1',
      tenantId: '1'
    };

    mockAxios.onPut('/admin-service/clinical-workflow/remove').reply(200, {});

    await deleteWorkflowModule(request);

    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe('/admin-service/clinical-workflow/remove');
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(request);
  });
});
