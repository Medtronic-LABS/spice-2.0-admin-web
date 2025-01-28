import { IRegionDetailList } from '../../store/region/types';

const MOCK_ENTITY_LIST = {
  countryid: 2,
  countrytenantid: 2,
  countryname: 'Kenya',
  countrycode: '2',
  districtid: 1,
  districttenantid: 3,
  districtname: 'Nyanza',
  districtcode: null,
  chiefdomid: 1,
  chiefdomtenantid: 4,
  chiefdomname: 'Oyugis',
  chiefdomcode: '1',
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
  appTypes: [],
  totalCount: 2
};

export const mockRegionDetailList: IRegionDetailList[] = [
  {
    countrycode: '001',
    countryname: 'Sample Country A',
    countryid: 1,
    countrytenantid: 1001,
    districtcode: 'D001',
    districtname: 'Sample District A1',
    districtid: 101,
    districttenantid: 2001,
    chiefdomcode: 'C001',
    chiefdomname: 'Sample Chiefdom A1',
    chiefdomid: 201,
    chiefdomtenantid: 3001,
    villagecode: 'V001',
    villagename: 'Sample Village A1',
    villageid: 301,
    villagetype: 'Urban'
  },
  {
    countrycode: '002',
    countryname: 'Sample Country B',
    countryid: 2,
    countrytenantid: 1002,
    districtcode: 'D002',
    districtname: 'Sample District B1',
    districtid: 102,
    districttenantid: 2002,
    chiefdomcode: 'C002',
    chiefdomname: 'Sample Chiefdom B1',
    chiefdomid: 202,
    chiefdomtenantid: 3002,
    villagecode: 'V002',
    villagename: 'Sample Village B1',
    villageid: 302,
    villagetype: 'Rural'
  },
  {
    countrycode: null,
    countryname: 'Sample Country C',
    countryid: 3,
    countrytenantid: 1003,
    districtcode: 'D003',
    districtname: 'Sample District C1',
    districtid: 103,
    districttenantid: 2003,
    chiefdomcode: null,
    chiefdomname: 'Sample Chiefdom C1',
    chiefdomid: 203,
    chiefdomtenantid: 3003,
    villagecode: 'V003',
    villagename: 'Sample Village C1',
    villageid: 303,
    villagetype: null
  }
];

const MOCK_DATA_CONSTANTS = {
  FETCH_REGION_LIST_REPONSE: {
    isLoadMore: false,
    regions: [
      {
        id: 1,
        tenantId: 1,
        name: 'Kenya',
        districtCount: 2,
        chiefdomCount: 2,
        healthFacilityCount: 2,
        appTypes: ['COMMUNITY', 'NON_COMMUNITY']
      },
      {
        id: 2,
        tenantId: 2,
        name: 'Tanzania',
        districtCount: 2,
        chiefdomCount: 2,
        healthFacilityCount: 2,
        appTypes: ['COMMUNITY']
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
  },
  ID_AND_TENANT_ID_REQUEST_PAYLOAD: {
    id: '1',
    tenantId: '4'
  },
  COUNTRY_DETAILS_RESPONSE: {
    id: '1',
    tenantId: '2',
    name: 'Kenya',
    list: [],
    total: 2,
    appTypes: ['COMMUNITY']
  }
};

export default MOCK_DATA_CONSTANTS;
