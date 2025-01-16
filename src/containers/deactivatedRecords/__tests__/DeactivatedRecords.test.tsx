import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ACCOUNT_MOCK_DATA_CONSTANTS from '../../../tests/mockData/districtDataConstants';
import DeactivatedRecords from '../DeactivatedRecords';
import { BrowserRouter as Router } from 'react-router-dom';
import { IDistrict, IDistrictAdmin, IAdminEditFormValues } from '../../../store/district/types';
import { initialState } from '../../../store/district/reducer';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import APPCONSTANTS from '../../../constants/appConstants';
import { formatUserToastMsg } from '../../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../../utils/toastCenter';
import { ACTIVATE_ACCOUNT_REQUEST, FETCH_DISTRICT_LIST_REQUEST } from '../../../store/district/actionTypes';

const mockStore = configureStore([]);
jest.mock('../../../constants/appConstants', () => ({
  ...jest.requireActual('../../../constants/appConstants'),
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    DISTRICT_ADMIN: 'DISTRICT_ADMIN',
    CHIEFDOM_ADMIN: 'CHIEFDOM_ADMIN'
  },
  ACTIVATE_ACCOUNT_CONFIRMATION: undefined
}));

jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  getErrorToastArgs: jest.fn(() => [])
}));

const mockChildComponent = jest.fn();
jest.mock('../../../components/customTable/CustomTable', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

const districtSName = 'District';
const districtPName = 'Districts';

describe('DeactivatedRecords component', () => {
  const store = mockStore({
    district: {
      ...initialState,
      districtList: [ACCOUNT_MOCK_DATA_CONSTANTS.FETCH_DISTRICT_LIST_RESPONSE_PAYLOAD],
      total: 2
    },
    user: {
      user: {
        role: 'REGION_ADMIN',
        tenantId: 1
      }
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render without errors', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );
    expect(getByText(`Deactivated ${districtPName}`)).toBeInTheDocument();
  });

  it('should render without errors for single district and super admin', () => {
    const localStore = mockStore({
      district: {
        ...initialState,
        districtList: [ACCOUNT_MOCK_DATA_CONSTANTS.FETCH_DISTRICT_LIST_RESPONSE_PAYLOAD],
        total: 1
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          tenantId: 1
        }
      }
    });

    const { getByText } = render(
      <Provider store={localStore}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );
    expect(getByText(`Deactivated ${districtSName}`)).toBeInTheDocument();
  });

  it('should call fetchDetails functions', async () => {
    render(
      <Provider store={store}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );

    const actions = store.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_DISTRICT_LIST_REQUEST);
    mockFetchDetailsType.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  it('should handle onActivateClick', () => {
    render(
      <Provider store={store}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );

    const fetchDetails = jest.fn();

    // Access the props passed to the mock component
    const mockDeactivateRecords: any = mockChildComponent.mock.calls[0][0];
    mockDeactivateRecords.onActivateClick();

    waitFor(() => {
      expect(mockDeactivateRecords.onActivateClick).toHaveBeenCalled();
    });

    const actions = store.getActions();
    const mockDeactivateRecordsType = actions.find((action) => action.type === ACTIVATE_ACCOUNT_REQUEST);

    mockDeactivateRecordsType.successCb(() => {
      expect(fetchDetails).toHaveBeenCalled();
      const act = store.getActions();
      const mockFetchDetailsType = act.find((action) => action.type === FETCH_DISTRICT_LIST_REQUEST);
      mockFetchDetailsType.failureCb({ message: 'error' });
      const failureCb = jest.spyOn(mockFetchDetailsType, 'failureCb');
      waitFor(() => {
        expect(failureCb).toHaveBeenCalled();
      });
      expect(toastCenter.success).toHaveBeenCalledWith(
        APPCONSTANTS.SUCCESS,
        formatUserToastMsg(APPCONSTANTS.ACTIVATE_COUNTY_SUCCESS, districtSName)
      );
    });

    mockDeactivateRecordsType.failureCb((error: Error) => {
      expect(toastCenter.error).toHaveBeenCalledWith(
        ...getErrorToastArgs(
          error,
          APPCONSTANTS.ERROR,
          formatUserToastMsg(APPCONSTANTS.ACTIVATE_COUNTY_FAIL, districtSName)
        )
      );
    });

    const successCbSpy = jest.spyOn(mockDeactivateRecordsType, 'successCb');
    const failureCbSpy = jest.spyOn(mockDeactivateRecordsType, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });

  it('should render cellFormatter', () => {
    render(
      <Provider store={store}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );

    const mockAdminEditFormValues: IAdminEditFormValues = {
      id: 'admin123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      username: 'johndoe',
      gender: 'male',
      countryCode: 'US',
      timezone: { id: 'test', description: 'test' },
      country: { countryCode: 'US' },
      tenantId: 'tenant123',
      roles: []
    };

    // Define the mock data for the account admin
    const mockAccountAdmin: IDistrictAdmin = {
      ...mockAdminEditFormValues,
      timezone: 'UTC+0'
    };

    const mockAccount: IDistrict = {
      id: 'account123',
      users: [mockAccountAdmin],
      name: 'Example Account',
      maxNoOfUsers: '10',
      tenantId: 'tenant123',
      updatedAt: '2024-04-23T08:00:00Z',
      clinicalWorkflow: [],
      customizedWorkflow: [],
      country: {
        countryCode: 'US'
      }
    };

    // Access the props passed to the mock component
    const mockDeactivateRecords: any = mockChildComponent.mock.calls[0][0];
    const tableUpdated = mockDeactivateRecords.columnsDef[1];
    tableUpdated.cellFormatter(mockAccount);
    tableUpdated.cellFormatter({ ...mockAccount, updatedAt: '' });
  });

  it('should unmount without errors', () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );

    unmount();
    expect(screen.queryByText(/deactivated dccount/i)).not.toBeInTheDocument();
  });
});
