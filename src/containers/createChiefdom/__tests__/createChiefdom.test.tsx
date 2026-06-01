import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import CreateChiefdom from '../CreateChiefdom';

jest.mock('../../../components/chiefdomForm/ChiefdomForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'chiefdom-form' }, 'Chiefdom form')
}));

jest.mock('../../../components/userForm/UserForm', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', { 'data-testid': 'user-form' }, 'User form')
}));

jest.mock('../../../hooks/useCountryId', () => ({
  __esModule: true,
  default: () => 1
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      regionId: '1',
      tenantId: '1',
      districtId: '1'
    })
  };
});

jest.mock('../../../utils/routerCompat', () => ({
  ...jest.requireActual('../../../utils/routerCompat'),
  useHistoryCompat: () => ({
    location: { pathname: '/', search: '', hash: '', state: null, key: 'create-chiefdom' },
    push: mockPush,
    replace: jest.fn(),
    goBack: jest.fn()
  })
}));

const mockStore = configureMockStore();

describe('CreateChiefdom', () => {
  let store: any;

  beforeEach(() => {
    mockPush.mockClear();
    store = mockStore({
      chiefdom: {
        loading: false
      },
      user: {
        user: {
          role: 'super_admin',
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
      district: {
        districtOptions: {},
        districtList: [],
        loading: false
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
  });

  it('should render the form with chiefdom and user sections', () => {
    const { container } = render(
      <Provider store={store}>
        <CreateChiefdom />
      </Provider>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(screen.getByTestId('chiefdom-form')).toBeInTheDocument();
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    expect(screen.getByText('Chiefdom Details')).toBeInTheDocument();
    expect(screen.getByText('Chiefdom Admin')).toBeInTheDocument();
  });

  it('should render Submit and Cancel buttons', () => {
    render(
      <Provider store={store}>
        <CreateChiefdom />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should navigate back when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <CreateChiefdom />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockPush).toHaveBeenCalled();
  });
});
