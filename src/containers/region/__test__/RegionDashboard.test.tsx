import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import RegionDashboard from '../RegionDashboard';
import { fetchRegionsRequest } from '../../../store/region/actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/commonDataConstants';

// Mock constants and data
const mockRegions = [
  {
    id: '1',
    tenantId: '101',
    name: 'Region A',
    appTypes: ['type1'],
    districtCount: 5,
    chiefdomCount: 3,
    healthFacilityCount: 2,
    displayValues: MOCK_DATA_CONSTANTS.MOCK_LABELNAME
  },
  {
    id: '2',
    tenantId: '102',
    name: 'Region B',
    appTypes: ['type2'],
    districtCount: 10,
    chiefdomCount: 7,
    healthFacilityCount: 5,
    displayValues: MOCK_DATA_CONSTANTS.MOCK_LABELNAME
  }
];
const mockStore = configureStore();
const initialState = {
  region: {
    regions: mockRegions,
    total: mockRegions.length,
    loading: false,
    loadingMore: false,
    error: null,
    detail: {},
    isClientRegistryEnabled: false,
    file: null,
    uploading: false,
    downloading: false
  },
  user: {
    timezoneList: []
  },
  district: {
    clinicalWorkflows: []
  },
  common: {
    labelName: MOCK_DATA_CONSTANTS.MOCK_LABELNAME
  }
};

jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loader'>Loading...</div>);
jest.mock('../../../components/searchbar/Searchbar', () => ({ onSearch }: any) => (
  <input data-testid='searchbar' placeholder='Search' onChange={(e) => onSearch(e.target.value)} />
));
jest.mock('../../../components/summaryCard/SummaryCard', () => ({ title }: any) => (
  <div data-testid='summary-card'>{title}</div>
));

describe('Region Dashboard', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Router>
          <RegionDashboard />
        </Router>
      </Provider>
    );

  it('renders the Region component', () => {
    renderComponent();
    screen.debug(undefined, Infinity);
  });
});
