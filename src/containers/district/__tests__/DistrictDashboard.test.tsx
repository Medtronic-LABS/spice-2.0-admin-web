import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

import DistrictDashboard from '../DistrictDashboard';

jest.mock('../../../components/summaryCard/SummaryCard', () => ({
  __esModule: true,
  default: ({ title }: any) => require('react').createElement('div', { 'data-testid': 'summary-card' }, title)
}));

jest.mock('../../../components/searchbar/Searchbar', () => ({
  __esModule: true,
  default: () => require('react').createElement('input', { 'data-testid': 'searchbar' })
}));

jest.mock('../../../components/loader/Loader', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'loader' }, 'Loading')
}));

jest.mock('../../../hooks/pagination', () => ({
  useLoadMorePagination: () => ({
    isLastPage: true,
    loadMore: jest.fn(),
    resetPage: jest.fn()
  })
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual
  };
});

jest.mock('../../../utils/routerCompat', () => ({
  ...jest.requireActual('../../../utils/routerCompat'),
  useHistoryCompat: () => ({
    location: { pathname: '/', search: '', hash: '', state: null, key: 'district-dashboard' },
    push: mockPush,
    replace: jest.fn(),
    goBack: jest.fn()
  })
}));

const mockStore = configureStore([]);

describe('DistrictDashboard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render dashboard cards and controls', () => {
    const store = mockStore({
      district: {
        dashboardList: [
          { id: '1', tenantId: '1', name: 'District 1', chiefdomCount: 2, healthFacilityCount: 3 },
          { id: '2', tenantId: '2', name: 'District 2', chiefdomCount: 1, healthFacilityCount: 4 }
        ],
        total: 2,
        loading: false,
        loadingMore: false
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1',
          country: { id: 1, tenantId: 1, appTypes: [] },
          appTypes: []
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    render(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );

    expect(screen.getAllByTestId('summary-card')).toHaveLength(2);
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create District/i })).toBeInTheDocument();
  });

  it('should display loader when loading is true', () => {
    const store = mockStore({
      district: {
        dashboardList: [],
        total: 0,
        loading: true,
        loadingMore: true
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1',
          country: { id: 1, tenantId: 1, appTypes: [] },
          appTypes: []
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    render(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should display no data message when district list is empty', () => {
    const store = mockStore({
      district: {
        dashboardList: [],
        total: 0,
        loading: false,
        loadingMore: false,
        error: null
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1',
          country: { id: 1, tenantId: 1, appTypes: [] },
          appTypes: []
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    render(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );

    expect(screen.getByText('Let’s Get Started!')).toBeInTheDocument();
  });

  it('should navigate when create district is clicked', async () => {
    const user = userEvent.setup();
    const store = mockStore({
      district: {
        dashboardList: [],
        total: 0,
        loading: false,
        loadingMore: false
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1',
          country: { id: 1, tenantId: 1, appTypes: [] },
          appTypes: []
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    render(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /Create District/i }));

    expect(mockPush).toHaveBeenCalled();
  });
});
