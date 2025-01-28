import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from '../Header';
import '@testing-library/jest-dom/extend-expect';
import APPCONSTANTS, { ROLE_LABELS } from '../../../constants/appConstants';
import { LOGOUT_REQUEST } from '../../../store/user/actionTypes';

jest.mock('../../../assets/images/nav-bar-logo.svg', () => ({
  ReactComponent: 'NavBarLogo'
}));

const mockStore = configureStore();
const { ROLES, SUITE_ACCESS } = APPCONSTANTS;

const mockChildComponent = jest.fn();
jest.mock('../UserMenu', () => (props: any) => {
  mockChildComponent(props);
  return <div data-testid='usemenu'>Mock UserMenu</div>;
});

describe('Header component', () => {
  let store = mockStore({
    user: {
      user: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'test@example.com',
        userId: '123',
        role: ROLES.SUPER_ADMIN,
        suiteAccess: [SUITE_ACCESS.ADMIN],
        roleDetail: {
          id: 9,
          name: ROLES.SUPER_ADMIN,
          displayName: 'Super Admin',
          suiteAccessName: 'web'
        },
        formDataId: '456',
        tenantId: '789'
      }
    }
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('render header without error', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(getByRole('navigation')).toBeInTheDocument();
    expect(getByRole('link')).toBeInTheDocument();
  });

  test('render usermenu without error', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(getByTestId('usemenu')).toBeInTheDocument();
  });

  test('check header name of the loggedin user', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Super Admin', { selector: '.text-capitalize' })).toBeInTheDocument();
  });

  test('check header name of the loggedin user if firstname and lastname is not present', () => {
    const localStore = mockStore({
      user: {
        user: {
          ...(store.getState() as any).user.user,
          firstName: '',
          lastName: ''
        }
      }
    });
    const { getByText } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Settings', { selector: '.text-capitalize' })).toBeInTheDocument();
  });

  test('check role name of the loggedin user', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('Super Admin', { selector: '.subtle-small-text' })).toBeInTheDocument();
  });

  test('check role name of the loggedin user if displayName is not present', () => {
    store = mockStore({
      user: {
        user: {
          ...(store.getState() as any).user.user,
          roleDetail: { ...(store.getState() as any).user.user.roleDetail, displayName: '' }
        }
      }
    });
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
    const roleName = ROLE_LABELS[ROLES.SUPER_ADMIN];
    expect(getByText(roleName, { selector: '.subtle-small-text' })).toBeInTheDocument();
  });

  test('check logout is present', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('Logout')).toBeInTheDocument();
  });

  test('check dispatch logout event on logout click', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(getByText('Logout'));
    const actions = store.getActions();
    const logoutRequestType = actions.find((action) => action.type === LOGOUT_REQUEST);
    expect(logoutRequestType).toBeDefined();
  });
});
