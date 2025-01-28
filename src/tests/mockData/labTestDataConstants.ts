import { ILabTest } from '../../store/labTest/types';

const MOCK_LABTEST_DETAIL = {
  DETAIL: {
    id: '',
    testName: '',
    uniqueName: '',
    tenantId: null,
    countryId: '',
    formInput: '',
    updatedAt: '',
    displayOrder: 1,
    codeDetails: {
      code: 'code',
      url: 'https://cwl.com'
    }
  }
};

const MOCK_DATA_CONSTANTS = {
  INITIAL_STATE: {
    labTests: [
      {
        id: '',
        testName: '',
        uniqueName: '',
        tenantId: null,
        countryId: '',
        formInput: '',
        updatedAt: '',
        displayOrder: 1
      }
    ],
    total: 0,
    loading: false,
    error: null,
    units: [],
    unitsLoading: false,
    customizationLoading: false,
    labTestCustomizationData: {} as ILabTest,
    labtestJson: null
  },
  //   FETCH_LAB_TEST_REQUEST_PAYLOAD: {
  //     labtests: [MOCK_LABTEST_DETAIL.DETAIL],
  //     total: 10

  //   },
  FETCH_LAB_TEST_REQUEST_PAYLOAD: {
    countryId: 1,
    limit: 10,
    skip: 0,
    searchTerm: ''
  },
  FETCH_LAB_TEST_RESPONSE_PAYLOAD: {
    labtests: [MOCK_LABTEST_DETAIL.DETAIL],
    total: 10
  },
  FETCH_LAB_TEST_CUSTOMIZATION_REQUEST: {
    id: '',
    testName: '',
    codeDetails: {
      code: '',
      url: ''
    },
    uniqueName: '',
    tenantId: '',
    countryId: '',
    formInput: '{"key": "value"}',
    updatedAt: '',
    displayOrder: 1
  },
  FETCH_LAB_TEST_CUSTOMIZATION_UPDATE_REQUEST: {
    id: '1',
    testName: '',
    codeDetails: {
      code: '',
      url: ''
    },
    uniqueName: '',
    tenantId: '',
    countryId: '',
    formInput: '{"key": "value"}',
    updatedAt: '',
    displayOrder: 1
  },

  FETCH_LAB_TEST_CUSTOMIZATION_UPDATE_RESPONSE: {
    id: '1',
    testName: '',
    codeDetails: {
      code: '',
      url: ''
    },
    uniqueName: '',
    tenantId: '',
    countryId: '',
    formInput: { key: 'value' },
    updatedAt: '',
    displayOrder: 1
  },

  FETCH_LAB_TEST_CUSTOMIZATION_RESPONSE: {
    id: '',
    testName: '',
    codeDetails: {
      code: '',
      url: ''
    },
    uniqueName: '',
    tenantId: '',
    countryId: '',
    formInput: { key: 'value' },
    updatedAt: '',
    displayOrder: 1
  }
};

export default MOCK_DATA_CONSTANTS;
