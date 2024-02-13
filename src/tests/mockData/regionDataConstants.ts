const MOCK_REGION_DETAIL = {
  DETAIL: {
    id: 1,
    name: '',
    type: '',
    countryid: 1,
    countryname: '',
    districtid: 1,
    districtname: '',
    chiefdomname: '',
    chiefdomid: 1
  }
};

const MOCK_DATA_CONSTANTS = {
  REGION_DETAILS_RESPONSE_PAYLOAD: {
    list: [MOCK_REGION_DETAIL.DETAIL],
    total: 10
  },
  REGION_DETAILS_REQUEST_PAYLOAD: { countryId: 1, limit: 10, skip: 0, search: '' }
};

export default MOCK_DATA_CONSTANTS;
