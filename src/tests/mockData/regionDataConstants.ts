const MOCK_ENTITY_LIST = {
  countryid: 2,
  countrytenantid: 2,
  countryname: 'Kenya',
  countrycode: '2',
  countyid: 1,
  countytenantid: 3,
  countyname: 'Nyanza',
  countycode: null,
  subcountyid: 1,
  subcountytenantid: 4,
  subcountyname: 'Oyugis',
  subcountycode: '1',
  villageid: 1,
  villagename: 'Ogembo',
  villagetype: null,
  villagecode: null
};

export const MOCK_REGION_DETAIL = {
  id: '1',
  tenantId: '1',
  name: 'Kenya',
  entityList: [MOCK_ENTITY_LIST],
  totalCount: 2
};

const MOCK_DATA_CONSTANTS = {
  FETCH_REGION_LIST_REPONSE: {
    isLoadMore: false,
    regions: [
      {
        id: 1,
        tenantId: 1,
        name: 'Kenya',
        countyCount: 2,
        subCountyCount: 2,
        healthFacilityCount: 2
      },
      {
        id: 2,
        tenantId: 2,
        name: 'Tanzania',
        countyCount: 2,
        subCountyCount: 2,
        healthFacilityCount: 2
      }
    ],
    total: 2
  },
  REGION_DETAILS_REQUEST_PAYLOAD: { countryId: 1, limit: 10, skip: 0, search: '' },

  FETCH_REGION_DETAIL_RESPONSE_PAYLOAD: {
    entityList: [MOCK_ENTITY_LIST],
    totalCount: 1
  },

  FETCH_REGION_LIST_REQUEST_PAYLOAD: {
    skip: 0,
    limit: null,
    search: '',
    isLoadMore: false
  },

  CREATE_REGION_REQUEST_PAYLOAD: {
    name: 'Kenya',
    countryCode: '880',
    users: [
      {
        email: 'admin@kenya.mdt',
        firstName: 'Kenya',
        lastName: 'Admin',
        phoneNumber: '1234567890',
        gender: 'Male',
        username: 'admin@kenya.mdt',
        countryCode: '880',
        timezone: {
          id: 34
        }
      }
    ]
  }
};

export default MOCK_DATA_CONSTANTS;
