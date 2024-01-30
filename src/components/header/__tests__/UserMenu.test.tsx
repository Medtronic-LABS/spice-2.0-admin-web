import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import UserMenu from '../UserMenu';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

const mockStore = configureMockStore();

describe('UserMenu', () => {
  beforeEach(() => {
    const store = mockStore({
      user: {
        role: 'SUPER_ADMIN',
        formDataId: '12345',
        tenantId: '1'
      }
    });
    shallow(
      <Provider store={store}>
        <MemoryRouter>
          <UserMenu role='SUPER_ADMIN' />
        </MemoryRouter>
      </Provider>
    );
  });
  it('should render only the permitted menus for a super admin', () => {
    const store = mockStore({
      user: {
        role: 'SUPER_ADMIN',
        formDataId: '12345',
        tenantId: '1'
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserMenu role='SUPER_ADMIN' />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('should render only the permitted menus for a admin', () => {
    const store = mockStore({
      user: {
        role: 'ADMIN',
        formDataId: '123',
        tenantId: 'tenant123'
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserMenu role='ADMIN' />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });
});
