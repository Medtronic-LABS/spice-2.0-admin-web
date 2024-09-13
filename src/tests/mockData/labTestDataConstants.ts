export const LABTEST_FETCH_PAYLOAD = {
  skip: 0,
  limit: 10,
  searchTerm: '',
  countryId: '1'
};

export const LABTEST_FETCH_RESPONSE = {
  labtests: [
    {
      id: 1,
      testName: 'Lab Test 1',
      uniqueName: 'Lab Test 1',
      tenantId: 1,
      countryId: 1,
      formInput: 'Test'
    }
  ],
  total: 1
};
