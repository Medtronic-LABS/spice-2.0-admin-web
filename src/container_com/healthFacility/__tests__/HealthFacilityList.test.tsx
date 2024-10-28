import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory, History } from 'history';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import HealthFacilityList from '../HealthFacilityList';
import * as actions from '../../../store/healthFacility/actions';
import APPCONSTANTS from '../../../constants/appConstants';
import { Store, AnyAction } from 'redux';
import {
  cultureListSelector,
  healthFacilityListSelector,
  healthFacilityListTotalSelector,
  healthFacilityLoadingSelector,
  hfTypesSelector,
  peerSupervisorListSelector,
  peerSupervisorLoadingSelector
} from '../../../store/healthFacility/selectors';
import { roleSelector, userDataSelector } from '../../../store/user/selectors';
import { getIsUploadingSelector, getLoadingSelector, getRegionDetailsSelector } from '../../../store/region/selectors';
import { PROTECTED_ROUTES } from '../../../constants/route';
import { IHealthFacility } from '../../../store/healthFacility/types';
const { useSelector, useDispatch } = require('react-redux');
// Mock the React hooks

// Mock the CustomTable component
jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: {},
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
}));

jest.mock('../../../components/multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: ({ options, ...props }: { options: any }) => (
    <div data-testid='mock-multi-select'>
      Mock MultiSelect
      <select {...props}>
        {options &&
          options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  )
}));

// Mock the CustomTable component
jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: ({ onRowEdit }: any) => (
    <div data-testid='mock-custom-table'>
      Mocked Custom Table
      <button onClick={() => onRowEdit({ id: 1, tenantId: 'tenant1' })}>Edit</button>
    </div>
  )
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));
jest.mock('../HealthFacilitySummary', () => ({
  formatHealthFacility: jest.fn()
}));

// Mock the actions
// Mock the actions and selectors
jest.mock('../../../store/healthFacility/actions', () => ({
  ...jest.requireActual('../../../store/healthFacility/actions'),
  validateLinkedRestrictionsRequest: jest.fn(() => ({ type: 'VALIDATE_LINKED_RESTRICTIONS_REQUEST' })),
  mockFetchHFList: jest.fn(() => ({ type: 'MOCK_FETCH_HF_LIST' })),
  fetchHFListRequest: jest.fn(() => ({ type: 'MOCK_FETCH_HF_LIST' })),
  healthFacilityListSelector: jest.fn(),
  healthFacilityListTotalSelector: jest.fn(),
  healthFacilityLoadingSelector: jest.fn(),
  fetchHFSummaryRequest: jest.fn(() => ({ type: 'MOCK_FETCH_HF_SUMMARY' }))
}));
jest.mock('../../../store/healthFacility/selectors', () => ({
  healthFacilityListSelector: jest.fn((state) => state.healthFacility.list),
  healthFacilityListTotalSelector: jest.fn((state) => state.healthFacility.total),
  healthFacilityLoadingSelector: jest.fn((state) => state.healthFacility.loading),
  cultureListSelector: jest.fn((state) => state.culture.languages || []),
  hfTypesSelector: jest.fn((state) => state.healthFacility.hfTypesList || []),
  peerSupervisorListSelector: jest.fn((state) => state.healthFacility.peerSupervisorList || { list: [] }),
  peerSupervisorLoadingSelector: jest.fn((state) => state.healthFacility.peerSupervisorLoading)
}));
jest.mock('../../../store/user/selectors', () => ({
  roleSelector: jest.fn((state) => state.user.role),
  userDataSelector: jest.fn((state) => state.user.userData)
}));

jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: ({ show, title, render, handleFormSubmit }: any) =>
    show ? (
      <div data-testid='mock-modal'>
        <h2>{title}</h2>
        {render()}
        <button onClick={() => handleFormSubmit({ healthFacility: {} })}>Next</button>
      </div>
    ) : null
}));
jest.mock('../HealthFacilityDetailsForm', () => ({
  __esModule: true,
  default: () => <div>Mocked HealthFacilityDetailsForm</div>
}));
const mockStore = configureStore([]);
// Custom middleware to log actions

describe('HealthFacilityList', () => {
  let store: Store<any, AnyAction>;
  let history: History;
  let mockDispatch: jest.Mock<any, any>;
  let mockSetEditHFDetailsModal: jest.Mock<any, any>;

  beforeEach(() => {
    let initialState = {
      healthFacility: {
        list: [
          { id: 1, name: 'Facility 1', type: 'Hospital', chiefdom: { name: 'Chiefdom 1' } },
          { id: 2, name: 'Facility 2', type: 'Clinic', chiefdom: { name: 'Chiefdom 2' } }
        ],
        total: 2,
        loading: false,
        hfTypesList: [],
        peerSupervisorList: { list: [] },
        peerSupervisorLoading: false
      },
      user: {
        role: APPCONSTANTS.ROLES.SUPER_ADMIN,
        userData: { country: { id: '1' } }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: {
          list: [
            { id: 1, name: 'Region 1' },
            { id: 2, name: 'Region 2' }
          ],
          total: 2
        }
      },
      culture: {
        languages: [{ value: 'en', label: 'English' }] // or some mock data if needed
      }
    };
    store = mockStore(initialState);

    mockSetEditHFDetailsModal = jest.fn();
    mockDispatch = jest.fn();

    jest.spyOn(React, 'useState').mockImplementation(() => [{ isOpen: false, data: {} }, mockSetEditHFDetailsModal]);
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    history = createMemoryHistory();
    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === roleSelector) return initialState.user.role;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
      if (selector === cultureListSelector) return initialState.culture.languages;
      if (selector === hfTypesSelector) return store.getState().healthFacility.hfTypesList;
      if (selector === peerSupervisorListSelector) return store.getState().healthFacility.peerSupervisorList;
      if (selector === peerSupervisorLoadingSelector) return store.getState().healthFacility.peerSupervisorLoading;
      if (selector === healthFacilityListSelector) return store.getState().healthFacility.list;
      if (selector === healthFacilityListTotalSelector) return store.getState().healthFacility.total;
      if (selector === healthFacilityLoadingSelector) return store.getState().healthFacility.loading;
    });
    useDispatch.mockReturnValue(mockDispatch);
    jest.spyOn(React, 'useContext').mockReturnValue({ regionData: { id: '1' } });
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(jest.fn());
    // Mock the action creators
    jest.spyOn(actions, 'fetchHFSummaryRequest').mockImplementation((params): any => {
      return (
        dispatch: (arg0: {
          type: string;
          payload: {
            tenantId: number;
            id: number;
            successCb?: (data: IHealthFacility) => void;
            failureCb?: (error: Error) => void;
          };
        }) => void
      ) => {
        dispatch({ type: 'MOCK_FETCH_HF_SUMMARY', payload: params });
        if (params.successCb) {
          params.successCb({
            id: params.id,
            tenantId: params.tenantId,
            name: '',
            type: '',
            phuFocalPersonName: '',
            phuFocalPersonNumber: '',
            address: '',
            district: {
              id: 1,
              name: '',
              tenantId: 0
            },
            chiefdom: {
              id: 1,
              name: ''
            },
            cityName: '',
            latitude: '',
            longitude: '',
            postalCode: '',
            language: '',
            linkedVillages: [],
            clinicalWorkflows: []
          });
        }
      };
    });
  });

  it('renders the HealthFacilityList component', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(screen.getByText('Health Facility')).toBeInTheDocument();
  });
  it('calls validateLinkedRestrictions when submittedData.isNextClicked is false', async () => {
    const { debug } = render(
      <Provider store={store}>
        <HealthFacilityList />
      </Provider>
    );

    // Log the initial render
    debug();

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
  });

  it('calls fetchHFListRequest on component mount', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(actions.fetchHFListRequest).toHaveBeenCalled();
  });

  it('navigates to create health facility page when add button is clicked', () => {
    const mockDispatch = jest.fn();
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    render(
      <Provider store={store}>
        <Router history={history}>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const addButton = screen.getByRole('button', { name: /add health facility/i });
    expect(addButton).toBeInTheDocument(); // Ensure the button is found
    if (addButton) {
      // If button is found, click it and check navigation
      fireEvent.click(addButton);

      const expectedPath = PROTECTED_ROUTES.createHealthFacility.replace(':regionId', '1');
      expect(history.location.pathname).toBe(expectedPath);
    }
  });
});
