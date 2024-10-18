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

export const LABTEST_CUSTOMIZATION_RESPONSE = {
  id: 1,
  uniqueName: 'bloodTest1725880882391',
  testName: 'Blood test',
  formInput:
    '{"time":1725881172525,"formLayout":[{"id":"bloodTest1725880882485","viewType":"CardView","title":"Blood test","familyOrder":0},{"id":"TestedOn","viewType":"DatePicker","title":"Tested On","fieldName":"TestedOn","family":"bloodTest1725880882485","isMandatory":true,"isEnabled":true,"visibility":"visible","isDefault":false,"disableFutureDate":true,"minDays":"2","maxDays":null,"isDeletable":false,"orderId":1},{"id":"TestOne","viewType":"DatePicker","title":"TestOne","fieldName":"TestOne","family":"bloodTest1725880882485","isMandatory":true,"isEnabled":true,"visibility":"visible","isDefault":false,"disableFutureDate":false,"minDays":"2","maxDays":"5","orderId":2},{"id":"TestTwo","viewType":"DatePicker","title":"TestTwo","fieldName":"TestTwo","family":"bloodTest1725880882485","isMandatory":true,"isEnabled":true,"visibility":"visible","isDefault":false,"disableFutureDate":false,"minDays":"2","maxDays":"5","orderId":3}]}',
  countryId: 2,
  tenantId: null,
  codeDetails: {
    code: '556',
    url: 'URL'
  }
};

export const LABTEST_CUSTOMIZATION_PAYLOAD = {
  name: 'Blood test',
  countryId: '1'
};

export const UNIT_LIST_RESPONSE = {
  id: '1',
  unit: '1'
};
