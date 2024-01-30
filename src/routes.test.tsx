import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Login from './containers/authentication/Login';

const mockStore = configureMockStore();

describe('<AppRoutes />', () => {
  it('renders AppRoutes component with protected routes when logged in', () => {
    const store = mockStore({
      user: {
        isLoggedIn: true,
        user: {
          role: 'SUPER_ADMIN',
          country: {
            id: 1,
            tenantId: 123
          }
        }
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    // Assert that the component renders protected routes when logged in
    expect(wrapper.find('Route')).toHaveLength(1);
  });

  it('renders AppRoutes component with public routes when not logged in', () => {
    const store = mockStore({
      user: {
        isLoggedIn: false,
        user: {
          role: null,
          country: {
            id: 1,
            tenantId: 123
          }
        }
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    // Assert that the component renders public routes when not logged in
    expect(wrapper.find('Route')).toHaveLength(4);
  });
});
