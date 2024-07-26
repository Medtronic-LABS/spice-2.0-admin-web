import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ACCOUNT_MOCK_DATA_CONSTANTS from '../../../tests/mockData/accountDataConstants';
import DeactivatedRecords from '../DeactivatedRecords';
import { BrowserRouter as Router } from 'react-router-dom';
import { IAccount, IAccountAdmin, IAdminEditFormValues } from '../../../store/account/types';
import { initialState } from '../../../store/account/reducer';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);
jest.mock('../../../constants/appConstants', () => ({
  ...jest.requireActual('../../../constants/appConstants'),
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    ACCOUNT_ADMIN: 'ACCOUNT_ADMIN',
    OPERATING_UNIT_ADMIN: 'OPERATING_UNIT_ADMIN'
  },
  ACTIVATE_ACCOUNT_CONFIRMATION: undefined
}));

const mockChildComponent = jest.fn();
jest.mock('../../../components/customTable/CustomTable', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

describe('DeactivatedRecords component', () => {
  const store = mockStore({
    account: {
      ...initialState,
      accounts: [ACCOUNT_MOCK_DATA_CONSTANTS.FETCH_ACCOUNTS_RESPONSE_PAYLOAD],
      total: 2
    },
    user: {
      user: {
        role: 'REGION_ADMIN',
        tenantId: 1
      }
    }
  });

  it('should render without errors', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router>
          <DeactivatedRecords />
        </Router>
      </Provider>
    );
    expect(getByText('Deactivated Account')).toBeInTheDocument();
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
    const mockFetchDetailsType = actions.find((action) => action.type === 'FETCH_ACCOUNTS_REQUEST');
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

    // Access the props passed to the mock component
    const mockDeactivateRecords: any = mockChildComponent.mock.calls[0][0];
    mockDeactivateRecords.onActivateClick();

    waitFor(() => {
      expect(mockDeactivateRecords.onActivateClick).toHaveBeenCalled();
    });

    const actions = store.getActions();
    const mockDeactivateRecordsType = actions.find((action) => action.type === 'ACTIVATE_ACCOUNT_REQUEST');
    mockDeactivateRecordsType.successCb('Success', 'Account activated successfully');
    mockDeactivateRecordsType.failureCb({ message: 'error' });

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
      tenantId: 'tenant123'
    };

    // Define the mock data for the account admin
    const mockAccountAdmin: IAccountAdmin = {
      ...mockAdminEditFormValues,
      timezone: 'UTC+0'
    };

    const mockAccount: IAccount = {
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
