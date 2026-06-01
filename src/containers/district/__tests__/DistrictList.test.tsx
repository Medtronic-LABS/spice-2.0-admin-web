import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import DistrictList from '../DistrictList';

const mockHandleSearch = jest.fn();
const mockHandlePage = jest.fn();

jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: {
      page: 1,
      rowsPerPage: 10,
      searchTerm: ''
    },
    handleSearch: mockHandleSearch,
    handlePage: mockHandlePage
  })
}));

jest.mock('../../../components/detailCard/DetailCard', () => ({
  __esModule: true,
  default: ({ header, onSearch, children }: any) =>
    require('react').createElement(
      'div',
      { 'data-testid': 'detail-card' },
      require('react').createElement('div', null, header),
      require('react').createElement('input', {
        'data-testid': 'district-search',
        onChange: (event: any) => onSearch?.(event.target.value)
      }),
      children
    )
}));

jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'custom-table' }, 'Custom table')
}));

jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: () => null
}));

jest.mock('../DistrictConsentForm', () => ({
  __esModule: true,
  default: () => null
}));

const mockStore = configureMockStore([]);
const store = mockStore({
  district: {
    loading: false,
    districtList: [],
    total: 0,
    clinicalWorkflows: []
  },
  workflow: {
    loading: false
  },
  user: {
    user: {
      appTypes: [],
      country: { id: 1, appTypes: [] }
    }
  },
  common: {
    labelName: null
  }
});

const matchProps = {
  params: {
    regionId: '1',
    tenantId: '12345'
  },
  history: {
    push: jest.fn()
  },
  location: {},
  match: {
    isExact: false,
    path: '',
    url: '',
    params: {
      regionId: '1',
      tenantId: '12345'
    }
  }
};

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      regionId: '1',
      tenantId: '12345'
    })
  };
});

// Mock SVG imports
jest.mock('../../../assets/images/plus.svg', () => ({
  ReactComponent: () => <svg data-testid='plus-icon'>Plus Icon</svg>
}));

jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: () => <svg data-testid='edit-icon'>Edit Icon</svg>
}));

jest.mock('../../../components/modal/ModalForm', () => () => null);

jest.mock('../DistrictConsentForm', () => () => null);

describe('DistrictList', () => {
  beforeEach(() => {
    store.clearActions();
    mockHandleSearch.mockClear();
    mockHandlePage.mockClear();
  });

  it('should render without errors', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DistrictList decactivateDistrictReq={() => undefined} {...matchProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('detail-card')).toBeInTheDocument();
    expect(screen.getByTestId('custom-table')).toBeInTheDocument();
  });

  it('should dispatch fetchDistrictRequest action on mount', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DistrictList decactivateDistrictReq={() => undefined} {...matchProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toContainEqual(expect.objectContaining({ type: 'FETCH_DISTRICT_LIST_REQUEST' }));
  });

  it('should handle search and call handleSearch', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DistrictList decactivateDistrictReq={() => undefined} {...matchProps} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByTestId('district-search'), { target: { value: 'searchTerm' } });

    expect(mockHandleSearch).toHaveBeenCalledWith('searchTerm');
  });
});
