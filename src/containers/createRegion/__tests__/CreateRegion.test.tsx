import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import CreateRegion from '../CreateRegion';

jest.mock('../RegionForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'region-form' }, 'Region form')
}));

jest.mock('../../../components/userForm/UserForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'user-form' }, 'User form')
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
    location: { pathname: '/', search: '', hash: '', state: null, key: 'create-region' },
    push: mockPush,
    replace: jest.fn(),
    goBack: jest.fn()
  })
}));

jest.mock('../../../services/regionAPI');

const mockStore = configureStore([]);

describe('CreateRegion', () => {
  const store = mockStore({
    healthFacility: {
      healthFacilityList: [],
      loading: false,
      assignedHFListForHFAdmin: [],
      peerSupervisorList: { list: [] },
      villagesList: { list: [] },
      villagesFromHFList: { list: [], hfTenantIds: null },
      countryList: [],
      cultureList: [],
      chiefdomList: []
    },
    chiefdom: {
      chiefdomList: [],
      listTotal: 0,
      loading: false
    },
    district: {
      loading: false,
      districtList: [],
      districtOptions: {}
    },
    user: {
      user: {
        country: { id: 1, appTypes: [] },
        appTypes: []
      },
      timezoneList: [{ id: '1' }, { id: '2' }],
      countryList: [],
      cultureList: [],
      designationList: [],
      communityList: [],
      userRoles: {}
    },
    region: {
      loading: false
    },
    common: {
      labelName: null
    }
  });

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders RegionForm and UserForm components', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateRegion />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(screen.getByTestId('region-form')).toBeInTheDocument();
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    expect(screen.getByText('Region Details')).toBeInTheDocument();
    expect(screen.getByText('Region Admin')).toBeInTheDocument();
  });

  it('should render the Submit and Cancel buttons', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateRegion />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('navigates to region dashboard on form cancel', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateRegion />
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockPush).toHaveBeenCalled();
  });
});
