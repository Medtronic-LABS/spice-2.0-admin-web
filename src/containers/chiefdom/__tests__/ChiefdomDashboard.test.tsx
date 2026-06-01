import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';

import ChiefdomDashboard from '../ChiefdomDashboard';

jest.mock('../../../components/summaryCard/SummaryCard', () => ({
  __esModule: true,
  default: ({ title }: any) => require('react').createElement('div', { 'data-testid': 'summary-card' }, title)
}));

jest.mock('../../../components/searchbar/Searchbar', () => ({
  __esModule: true,
  default: () => require('react').createElement('input', { 'data-testid': 'searchbar' })
}));

jest.mock('../../../hooks/pagination', () => ({
  useLoadMorePagination: () => ({
    isLastPage: true,
    loadMore: jest.fn(),
    resetPage: jest.fn()
  })
}));

const mockStore = configureMockStore();

describe('ChiefdomDashboard', () => {
  const initialState = {
    chiefdom: {
      chiefdomDashboardList: [
        { name: 'OU1', id: '1', tenantId: '1', healthFacilityCount: 5 },
        { name: 'OU2', id: '2', tenantId: '2', healthFacilityCount: 10 }
      ],
      total: 2,
      loading: false,
      loadingMore: false,
      chiefdomDetail: {}
    },
    user: {
      user: {
        country: { id: 1, tenantId: 3, appTypes: [] },
        appTypes: [],
        formDataId: 2,
        tenantId: 3
      }
    },
    common: {
      labelName: null
    }
  };

  it('should render chiefdom cards and controls', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChiefdomDashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId('summary-card')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: /Sub Counties|Chiefdoms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create (Sub County|Chiefdom)/i })).toBeInTheDocument();
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
  });

  it('renders the no data message when there are no chiefdom available', () => {
    const store = mockStore({
      ...initialState,
      chiefdom: {
        ...initialState.chiefdom,
        chiefdomDashboardList: []
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChiefdomDashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Let's Get Started!")).toBeInTheDocument();
    expect(screen.getByText(/Create an (sub county|chiefdom)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create (Sub County|Chiefdom)/i })).toBeInTheDocument();
  });
});
