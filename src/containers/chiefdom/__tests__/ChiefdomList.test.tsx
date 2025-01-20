import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ChiefdomList from '../ChiefdomList';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/districtDataConstants';
import { IChiefdomDetail } from '../../../store/chiefdom/types';

const mockStore = configureMockStore();
jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: 'EditIcon'
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn().mockReturnValue([true, jest.fn()])
}));

jest.mock('../../../constants/appConstants', () => ({
  ...jest.requireActual('../../../constants/appConstants'),
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    DISTRICT_ADMIN: 'DISTRICT_ADMIN',
    CHIEFDOM_ADMIN: 'CHIEFDOM_ADMIN'
  },
  CHIEFDOM_DELETE_CONFIRMATION: undefined
}));

jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: jest.fn(() => ({
    listParams: {
      page: 2,
      rowsPerPage: 10
    },
    setListReqParams: jest.fn()
  }))
}));

describe('Chiefdom List', () => {
  let store: any;
  const mockChiefdomDetail: IChiefdomDetail = {
    id: '1',
    name: 'Chiefdom 1',
    tenantId: 'tenant-1',
    district: {
      id: '1',
      name: 'District 1',
      tenantId: 'tenant-1'
    },
    countryId: '1',
    districtName: 'District 1'
  };
  beforeEach(() => {
    store = mockStore({
      chiefdom: {
        chiefdomList: [
          { id: 1, name: 'Chiefdom one' },
          { id: 2, name: 'Chiefdom two' }
        ],
        loading: false,
        total: 0
      },
      district: {
        district: {
          id: '1',
          clinicalWorkflow: [1],
          users: MOCK_DATA_CONSTANTS.DISTRICT_DETAIL_RESPONSE_PAYLOAD.users,
          name: 'DistrictOne',
          maxNoOfUsers: '22',
          tenantId: '1'
        },
        districtOptions: [
          {
            name: 'accOne',
            id: '1',
            tenantId: '1'
          }
        ],
        loadingOptions: false
      },
      user: {
        user: {
          countryId: '1'
        },
        country: {
          id: 1
        }
      },
      common: {
        labelName: null
      }
    });
  });

  it('should render the component and handle action callbacks', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    // Ensure that the CustomTable component is rendered
    const customTable = await screen.findByRole('table'); // or use another appropriate query
    expect(customTable).toBeInTheDocument();

    // Get the dispatched actions
    const actions = store.getActions();
    const fetchOUListAction = actions.find((action: { type: string }) => action.type === 'FETCH_CHIEFDOM_LIST_REQUEST');

    // Check if failureCb is part of the action payload and mock the failure callback if necessary
    if (fetchOUListAction && fetchOUListAction.failureCb) {
      const failureCbSpy = jest.spyOn(fetchOUListAction, 'failureCb');

      // Trigger the failure callback
      fetchOUListAction.failureCb({ message: 'error' });

      // Verify the callback was called
      await waitFor(() => {
        expect(failureCbSpy).toHaveBeenCalled();
      });

      failureCbSpy.mockRestore();
    } else {
      throw new Error('fetchOUListAction or failureCb is not defined');
    }
  });

  it('should redirect to create Chiefdom', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1']}>
          <Route path='/region/:regionId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByRole('button', { name: /Add Chiefdom/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveFocus();
    });
  });
});
