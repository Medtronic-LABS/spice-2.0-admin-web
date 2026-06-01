import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import CreateDistrict from './CreateDistrict';

jest.mock('./DistrictForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'district-form' }, 'District form')
}));

jest.mock('../../components/userForm/UserForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'user-form' }, 'User form')
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ tenantId: '3', regionId: '2' })
  };
});

jest.mock('../../utils/routerCompat', () => ({
  ...jest.requireActual('../../utils/routerCompat'),
  useHistoryCompat: () => ({
    location: { pathname: '/', search: '', hash: '', state: null, key: 'create-district' },
    push: mockPush,
    replace: jest.fn(),
    goBack: jest.fn()
  })
}));

const mockStore = configureMockStore();

describe('CreateDistrict', () => {
  const store = mockStore({
    district: {
      loading: true,
      district: {
        id: '1',
        clinicalWorkflow: [1],
        users: [
          {
            id: '1',
            firstName: 'acc',
            lastName: 'admin',
            email: 'accadmin@spice.mdt',
            phoneNumber: '1234567890',
            username: 'accadmin@spice.mdt',
            gender: 'Male',
            countryCode: '233',
            timezone: '1',
            country: { countryCode: '232', id: '1' }
          }
        ],
        name: 'DistrictOne',
        maxNoOfUsers: '22',
        tenantId: '1'
      },
      clinicalWorkflows: [
        {
          id: '1',
          name: 'workflow One',
          moduleType: 'clinical'
        },
        {
          id: '2',
          name: 'workflow Two',
          moduleType: 'clinical'
        }
      ],
      districtList: [],
      districtOptions: {}
    },
    user: {
      user: {
        countryId: '1',
        country: { id: 1, appTypes: [] },
        appTypes: []
      },
      timezoneList: [{ id: 1 }, { id: 2 }],
      countryList: [
        { id: 1, countryCode: '91' },
        { id: 2, countryCode: '232' }
      ],
      cultureList: [],
      designationList: [],
      communityList: [],
      userRoles: {}
    },
    healthFacility: {
      healthFacilityList: [],
      loading: false,
      assignedHFListForHFAdmin: [],
      peerSupervisorList: { list: [] },
      villagesFromHFList: { list: [] },
      villagesList: { list: [] },
      countryList: [],
      cultureList: [],
      chiefdomList: []
    },
    chiefdom: {
      chiefdomList: [],
      listTotal: 0,
      loading: false
    },
    region: {
      regions: [],
      total: 0,
      loading: false,
      loadingMore: false,
      error: null,
      detail: {
        id: '',
        tenantId: '',
        name: '',
        list: [],
        appTypes: [],
        total: 0
      },
      isClientRegistryEnabled: undefined,
      file: {},
      uploading: false,
      downloading: false,
      subVillages: [],
      subVillagesLoading: false
    },
    common: {
      labelName: null
    }
  });

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders DistrictForm and UserForm inside FormContainer components', () => {
    const { container } = render(
      <Provider store={store}>
        <CreateDistrict />
      </Provider>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(screen.getByTestId('district-form')).toBeInTheDocument();
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    expect(screen.getByText('District Details')).toBeInTheDocument();
    expect(screen.getByText('District Admin')).toBeInTheDocument();
  });

  it('calls handleNavigation function when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <CreateDistrict />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockPush).toHaveBeenCalled();
  });
});
