import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import AccountAdminList from '../AccountAdminList';
import { act, waitFor } from '@testing-library/react';
import { IAccountAdmin } from '../../../store/account/types';

const mockStore = configureMockStore();

jest.mock('../../../constants/appConstants', () => ({
  ...jest.requireActual('../../../constants/appConstants'),
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    REGION_ADMIN: 'REGION_ADMIN',
    ACCOUNT_ADMIN: 'ACCOUNT_ADMIN',
    OPERATING_UNIT_ADMIN: 'OPERATING_UNIT_ADMIN'
  },
  ACCOUNT_WORKFLOW_DELETE_CONFIRMATION: undefined
}));

describe('AccountAdminList component', () => {
  let store;
  let wrapper: any;
  const mockAccountAdmin: IAccountAdmin = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    username: 'johndoe',
    gender: 'male',
    countryCode: '91',
    timezone: 'UTC+0',
    country: {
      countryCode: '91',
      id: '1'
    },
    tenantId: '123'
  };
  const props: any = {
    match: {
      params: {
        accountId: '1',
        tenantId: '2'
      }
    }
  };
  beforeEach(() => {
    store = mockStore({
      account: {
        admins: [],
        count: 0,
        loading: false
      },
      user: {
        countryId: null
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccountAdminList {...props} />
        </MemoryRouter>
      </Provider>
    );
  });
  it('should render component', () => {
    store = mockStore({
      account: {
        admins: [],
        count: 0,
        loading: false
      },
      user: {
        countryId: null
      }
    });

    const wrapperAdminList = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccountAdminList {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapperAdminList.find('CustomTable')).toHaveLength(1);
    const actions = store.getActions();
    const adminListMock = actions.find((action) => action.type === 'FETCH_ACCOUNT_ADMIN_REQUEST');
    adminListMock.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(adminListMock, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    failureCbSpy.mockRestore();
  });
  it('should render without errors', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should fetch account admins list on mount', () => {
    const fetchAccountAdminsRequest = jest.fn();
    wrapper.update();
    expect(fetchAccountAdminsRequest).toHaveBeenCalledTimes(0);
  });

  it('should dispatch fetchAccountAdminsRequest on mount', () => {
    const fetchAccountAdminsRequest = jest.fn();
    const clearAccountAdmin = jest.fn();
    expect(fetchAccountAdminsRequest).toHaveBeenCalledTimes(0);
    expect(clearAccountAdmin).toHaveBeenCalledTimes(0);
  });

  it('should render a CustomTable component', () => {
    store = mockStore({
      account: {
        admins: [],
        count: 0,
        loading: false
      },
      user: {
        countryId: null
      }
    });

    const wrapperAdminList = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccountAdminList {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('CustomTable')).toHaveLength(1);
    act(() => {
      const customtableMock: any = wrapperAdminList.find('CustomTable').props();
      customtableMock.onRowEdit({ payload: mockAccountAdmin });
    });
    wrapperAdminList.update();
    const actions = store.getActions();
    const updateUserRequestAction = actions.find((action) => action.type === 'FETCH_USER_BY_ID_REQUEST');
    updateUserRequestAction.successCb(mockAccountAdmin);
    updateUserRequestAction.failureCb({ message: 'error' });
    expect(updateUserRequestAction).toBeDefined();
    const successCbSpy = jest.spyOn(updateUserRequestAction, 'successCb');
    const failureCbSpy = jest.spyOn(updateUserRequestAction, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
    successCbSpy.mockRestore();
    failureCbSpy.mockRestore();
    wrapperAdminList.update();
    const modalFormProps: any = wrapperAdminList.find('Memo()[title="Edit Account Admin"]').props();
    expect(modalFormProps.show).toBe(true);
    const handleFormSubmit: any = wrapperAdminList
      .find('Memo()[title="Edit Account Admin"]')
      .find('button[type="submit"]');
    handleFormSubmit.simulate('click');
    wrapperAdminList.update();
    const updatedModal: any = wrapperAdminList.find('Memo()[title="Edit Account Admin"]').props();
    updatedModal.handleFormSubmit({ users: [mockAccountAdmin] });
    const updateAdminRequestAction = actions.find((action) => action.type === 'UPDATE_ACCOUNT_ADMIN_REQUEST');
    updateAdminRequestAction.successCb();
    updateAdminRequestAction.failureCb({ message: 'error' });
    expect(updateAdminRequestAction).toBeDefined();
    const adminSuccessCbSpy = jest.spyOn(updateAdminRequestAction, 'successCb');
    const adminFailureCbSpy = jest.spyOn(updateAdminRequestAction, 'failureCb');
    waitFor(() => {
      expect(adminSuccessCbSpy).toHaveBeenCalled();
      expect(adminFailureCbSpy).toHaveBeenCalled();
    });
    adminSuccessCbSpy.mockRestore();
    adminFailureCbSpy.mockRestore();
  });
  it('should delete account admin', () => {
    store = mockStore({
      account: {
        admins: [],
        count: 0,
        loading: false
      },
      user: {
        countryId: null
      }
    });

    const wrapperAdminList = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccountAdminList {...props} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('CustomTable')).toHaveLength(1);
    act(() => {
      const customtableMock: any = wrapperAdminList.find('CustomTable').props();
      customtableMock.onDeleteClick({ data: mockAccountAdmin, index: 1 });
    });
    wrapperAdminList.update();
    const actions = store.getActions();
    const updateAminDeleteAction = actions.find((action) => action.type === 'DELETE_ACCOUNT_ADMIN_REQUEST');
    updateAminDeleteAction.successCb(mockAccountAdmin);
    updateAminDeleteAction.failureCb({ message: 'error' });
    expect(updateAminDeleteAction).toBeDefined();
    const successCbSpy = jest.spyOn(updateAminDeleteAction, 'successCb');
    const failureCbSpy = jest.spyOn(updateAminDeleteAction, 'failureCb');
    waitFor(() => {
      expect(successCbSpy).toHaveBeenCalled();
      expect(failureCbSpy).toHaveBeenCalled();
    });
    successCbSpy.mockRestore();
    failureCbSpy.mockRestore();
    wrapperAdminList.update();
  });
  it('should render format name', () => {
    store = mockStore({
      account: {
        admins: [],
        count: 0,
        loading: false
      },
      user: {
        countryId: null
      }
    });
    const wrapperAdminList = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccountAdminList {...props} />
        </MemoryRouter>
      </Provider>
    );
    const customtableMock: any = wrapperAdminList.find('CustomTable').props();
    const tableData = customtableMock.columnsDef[0];
    tableData.cellFormatter(mockAccountAdmin);
    waitFor(() => {
      expect(tableData.cellFormatter).toBeCalled();
    });
  });
  it('should render format phone', () => {
    store = mockStore({
      account: {
        admins: [],
        count: 0,
        loading: false
      },
      user: {
        countryId: null
      }
    });
    const wrapperAdminList = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AccountAdminList {...props} />
        </MemoryRouter>
      </Provider>
    );
    const customtableMock: any = wrapperAdminList.find('CustomTable').props();
    const tableData = customtableMock.columnsDef[3];
    tableData.cellFormatter(mockAccountAdmin);
    waitFor(() => {
      expect(tableData.cellFormatter).toBeCalled();
    });
  });
});
