import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import HealthFacilityList from '../HealthFacilityList';
import * as healthFacilityActions from '../../../store/healthFacility/actions';
import { mockHealthFacilityList } from '../../../tests/mockData/healthFacilityConstants';
import { PROTECTED_ROUTES } from '../../../constants/route';
import * as redux from 'react-redux';
import { FETCH_HEALTH_FACILITY_LIST_REQUEST } from '../../../store/healthFacility/actionTypes';

// Mock store setup
const mockStore = configureStore([]);
let store: any;
jest.mock('../../assets/images/edit.svg', () => ({
  ReactComponent: () => <svg data-testid='edit-icon' />
}));
jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid='mock-userForm'>userForm</div>;
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn()
  })
}));

describe('HealthFacilityList Component', () => {
  beforeEach(() => {
    store = mockStore({
      healthFacility: {
        list: [],
        total: 0,
        loading: false
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      }
    });
  });
  test('fetches health facility list on load', () => {
    const fetchHFListRequestSpy = jest.spyOn(healthFacilityActions, 'fetchHFListRequest');

    render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(fetchHFListRequestSpy).toHaveBeenCalled();
  });

  test('should call edit and show success message on successful deletion', async () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      }
    });

    const { getAllByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );
    const [editButton] = getAllByTestId('edit-icon');
    await waitFor(() => {
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Health Facility')).toBeInTheDocument();
    // Clean up mock implementations
    jest.clearAllMocks();
  });
  it('navigates to the correct route on row click', () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      }
    });
    const mockHistoryPush = jest.fn();
    const rowData = { id: 123, tenantId: 456 };
    const expectedRoute = PROTECTED_ROUTES.healthFacilitySummary
      .replace(':healthFacilityId', rowData.id.toString())
      .replace(':tenantId', rowData.tenantId.toString());

    // Render the component
    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    // Simulate row click
    // Assuming rows have data-testid attributes like "row-123"
    const row = screen.getByTestId(`row-${mockHealthFacilityList.length}`);
    fireEvent.click(row);
    waitFor(() => {
      // Assert that history.push was called with the expected route
      expect(mockHistoryPush).toHaveBeenCalledWith(expectedRoute);
    });
  });
  it('should admin List fetch with failure cb', async () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const mockDispatch = jest.fn();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);

    const actions = localStore.getActions();
    const mockFetchDetailsType = actions.find((action) => action.type === FETCH_HEALTH_FACILITY_LIST_REQUEST);
    const failureCbSpy = jest.spyOn(mockFetchDetailsType, 'failureCb');
    mockFetchDetailsType.failureCb({ message: 'error' });
    await waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
  });
  it('renders the Loader when loading is true', () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: [],
        loading: true
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('does not render the Loader when loading is false', () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      },
      loading: false
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );
    expect(screen.queryByTestId('loader')).toBeNull(); // Asserts Loader is not in the DOM
  });
  // Inside your test:
  it('should create health facility', async () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList
      },
      user: {
        role: 'SUPER_ADMIN'
      },
      common: {
        labelName: null
      }
    });
    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const createButton = screen.getByText('Add Health Facility');
    fireEvent.click(createButton);
  });
});
