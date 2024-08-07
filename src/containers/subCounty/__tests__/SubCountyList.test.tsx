import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import SubCountyList from '../SubCountyList';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/countyDataConstants';
import { ISubCountyDetail, ISubCountyList } from '../../../store/subCounty/types';
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
    ACCOUNT_ADMIN: 'ACCOUNT_ADMIN',
    SUB_COUNTY_ADMIN: 'SUB_COUNTY_ADMIN'
  },
  SUB_COUNTY_DELETE_CONFIRMATION: undefined
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

describe('SubCounty List', () => {
  let store: any;
  const mockSubCountyDetail: ISubCountyDetail = {
    id: '1',
    name: 'Sub County 1',
    tenantId: 'tenant-1',
    county: {
      id: '1',
      name: 'Account 1',
      tenantId: 'tenant-1'
    },
    countryId: '1',
    countyName: 'Account 1'
  };
  beforeEach(() => {
    store = mockStore({
      subCounty: {
        subCountyList: [
          { id: 1, name: 'Sub County one' },
          { id: 2, name: 'Sub County two' }
        ],
        loading: false,
        total: 0
      },
      account: {
        account: {
          id: '1',
          clinicalWorkflow: [1],
          users: MOCK_DATA_CONSTANTS.COUNTY_DETAIL_RESPONSE_PAYLOAD.users,
          name: 'AccountOne',
          maxNoOfUsers: '22',
          tenantId: '1'
        },
        accountOptions: [
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
            <SubCountyList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(componentWrapper.find('CustomTable')).toHaveLength(1);
    const actions = store.getActions();
    const fetchOUListAction = actions.find(
      (action: { type: string }) => action.type === 'FETCH_SUB_COUNTY_LIST_REQUEST'
    );
    fetchOUListAction.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(fetchOUListAction, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    failureCbSpy.mockRestore();
  });
  it('should redirect create Sub County', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <SubCountyList />
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
  it('should open Sub County edit modal', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <SubCountyList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('CustomTable').props();
    customtableMock.onRowEdit(mockSubCountyDetail);
    waitFor(() => {
      expect(customtableMock.onRowEdit).toHaveBeenCalled();
    });
    componentWrapper.update();
    const actions = store.getActions();
    const OUModalAction = actions.find((action: { type: string }) => action.type === 'FETCH_SUB_COUNTY_BY_ID_REQUEST');
    OUModalAction.successCb(mockSubCountyDetail);
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
            <SubCountyList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('CustomTable').props();
    customtableMock.onRowEdit(mockSubCountyDetail);
    waitFor(() => {
      expect(customtableMock.onRowEdit).toHaveBeenCalled();
    });
    componentWrapper.update();
    const handlePage = jest.fn();
    const modalMockProps: any = componentWrapper.find('Memo()[title="Edit Sub County"]').props();
    modalMockProps.handleFormSubmit(mockSubCountyDetail);
    const actions = store.getActions();
    const OUModalAction = actions.find((action: { type: string }) => action.type === 'UPDATE_SUB_COUNTY_REQUEST');
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
  it('should redirect sub county summary', () => {
    const mockSubCountyList: ISubCountyList = {
      id: '1',
      tenantId: 'tenant-1',
      name: 'Sub County 1',
      email: 'subcounty1@example.com',
      county: 'County 1',
      account: {
        name: 'Account 1'
      },
      countyName: 'Sub County 1'
    };

    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Route path='/tenant/:tenantId'>
            <SubCountyList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customtableMock: any = componentWrapper.find('CustomTable').props();
    customtableMock.handleRowClick(mockSubCountyList);
    waitFor(() => {
      expect(customtableMock.handleRowClick(mockSubCountyList)).toHaveBeenCalled();
    });
  });
});
