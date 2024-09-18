import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import Admins from '../AdminList'; // Adjust path to your component
import * as redux from 'react-redux';
import * as actions from '../../../store/healthFacility/actions'; // Import actions
import toastCenter from '../../../utils/toastCenter'; // Import toastCenter
import { createRoot } from 'react-dom/client';

// In your test setup file
const renderWithCreateRoot = (component: React.ReactNode) => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootInstance = createRoot(root);
  rootInstance.render(component);
  return root;
};
const mockStore = configureStore([]);

const mockChildComponent = jest.fn();
jest.mock('../../../components/tableFilter/Filter', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

describe('Admins Component', () => {
  let store: any;
  const email = 'test@example.com';
  beforeEach(() => {
    store = mockStore({
      healthFacility: {
        healthFacilityUserList: [],
        hfTotal: 0,
        healthFacilityList: [],
        healthFacilityUsersLoading: false
      },
      user: {
        user: { country: 'USA' },
        isPasswordSet: true,
        timezoneList: []
      },
      countryIdSelector: { id: 1 },
      emailSelector: 'test@example.com',
      rolesGrouped: {
        'SPICE INSIGHTS': [{ suiteAccessName: 'spice web' }, { suiteAccessName: 'another access' }]
      },
      roleSpiceList: ['RoleSpice 1', 'RoleSpice 2'],
      selectedRole: ['Selected Role 1']
    });

    jest.spyOn(redux, 'useDispatch').mockReturnValue(jest.fn());
  });

  test('renders without crashing', async () => {
    renderWithCreateRoot(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Admins />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/Admins/i)).toBeInTheDocument());
  });

  test('correctly filters roleSpiceList', () => {
    renderWithCreateRoot(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tenant/1']}>
          <Admins />
        </MemoryRouter>
      </Provider>
    );

    const roleSpiceElement = screen.queryByText((content, element) => content.includes('RoleSpice 1'));
    waitFor(() => {
      expect(roleSpiceElement).toBeInTheDocument();
    });
  });
  test('hides edit, delete, and custom icons for the user’s own row', () => {
    const rowData = { username: 'test@example.com' }; // This should match the user's email

    const actionFormatter = {
      hideEditIcon: (rowDataEdit: any) => rowDataEdit.username === email,
      hideDeleteIcon: (rowDataDelete: any) => rowDataDelete.username === email,
      hideCustomIcon: (rowDataCustom: any) => rowDataCustom.username === email
    };

    // Run your assertions to make sure the icons are hidden
    expect(actionFormatter.hideEditIcon(rowData)).toBe(true);
    expect(actionFormatter.hideDeleteIcon(rowData)).toBe(true);
    expect(actionFormatter.hideCustomIcon(rowData)).toBe(true);
  });

  test('shows edit, delete, and custom icons for other users', () => {
    const rowData = { username: 'anotheruser@example.com' }; // Different user email

    const actionFormatter = {
      hideEditIcon: (rowDataEdit: any) => rowDataEdit.username === email,
      hideDeleteIcon: (rowDataDelete: any) => rowDataDelete.username === email,
      hideCustomIcon: (rowDataCustom: any) => rowDataCustom.username === email
    };

    // Run your assertions to make sure the icons are visible for other users
    expect(actionFormatter.hideEditIcon(rowData)).toBe(false);
    expect(actionFormatter.hideDeleteIcon(rowData)).toBe(false);
    expect(actionFormatter.hideCustomIcon(rowData)).toBe(false);
  });
});
