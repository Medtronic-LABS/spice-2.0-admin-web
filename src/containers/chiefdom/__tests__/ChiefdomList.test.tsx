import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import ChiefdomList from '../ChiefdomList';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/districtDataConstants';
import { IChiefdomDetail, IChiefdomList } from '../../../store/chiefdom/types';
import { waitFor } from '@testing-library/react';

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
      }
    });
  });

  it('should component render', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(componentWrapper.find('CustomTable')).toHaveLength(1);
    const actions = store.getActions();
    const fetchOUListAction = actions.find((action: { type: string }) => action.type === 'FETCH_CHIEFDOM_LIST_REQUEST');
    fetchOUListAction.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(fetchOUListAction, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    failureCbSpy.mockRestore();
  });
  it('should redirect create Chiefdom', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('DetailCard').props();
    customtableMock.onButtonClick();
    waitFor(() => {
      expect(customtableMock.onButtonClick()).toHaveBeenCalled();
    });
  });
  it('should open Chiefdom edit modal', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('CustomTable').props();
    customtableMock.onRowEdit(mockChiefdomDetail);
    waitFor(() => {
      expect(customtableMock.onRowEdit).toHaveBeenCalled();
    });
    componentWrapper.update();
    const actions = store.getActions();
    const OUModalAction = actions.find((action: { type: string }) => action.type === 'FETCH_CHIEFDOM_BY_ID_REQUEST');
    OUModalAction.successCb(mockChiefdomDetail);
    OUModalAction.failureCb({ message: 'error' });
    expect(OUModalAction).toBeDefined();
    const successCbSpy = jest.spyOn(OUModalAction, 'successCb');
    const failureCbSpy = jest.spyOn(OUModalAction, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
    successCbSpy.mockRestore();
    failureCbSpy.mockRestore();
  });
  it('should submit form data', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('CustomTable').props();
    customtableMock.onRowEdit(mockChiefdomDetail);
    waitFor(() => {
      expect(customtableMock.onRowEdit).toHaveBeenCalled();
    });
    componentWrapper.update();
    const handlePage = jest.fn();
    const modalMockProps: any = componentWrapper.find('Memo()[title="Edit Chiefdom"]').props();
    modalMockProps.handleFormSubmit(mockChiefdomDetail);
    const actions = store.getActions();
    const OUModalAction = actions.find((action: { type: string }) => action.type === 'UPDATE_CHIEFDOM_REQUEST');
    OUModalAction.failureCb({ message: 'error' });
    expect(OUModalAction).toBeDefined();
    waitFor(() => {
      expect(handlePage).toHaveBeenCalled();
    });
    const failureCbSpy = jest.spyOn(OUModalAction, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
      failureCbSpy.mockRestore();
    });
  });
  it('should redirect chiefdom summary', () => {
    const mockChiefdomList: IChiefdomList = {
      id: '1',
      tenantId: 'tenant-1',
      name: 'Chiefdom 1',
      email: 'chiefdom1@example.com',
      district: 'District 1',
      account: {
        name: 'district 1'
      },
      districtName: 'Chiefdom 1'
    };

    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <ChiefdomList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('CustomTable').props();
    customtableMock.handleRowClick(mockChiefdomList);
    waitFor(() => {
      expect(customtableMock.handleRowClick(mockChiefdomList)).toHaveBeenCalled();
    });
  });
});
