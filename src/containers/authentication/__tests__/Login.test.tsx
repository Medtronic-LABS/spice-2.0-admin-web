import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import Login from '../Login';
import { loginRequest } from '../../../store/user/actions';
import toastCenter from '../../../utils/toastCenter';

const mockStore = configureMockStore([]);
jest.mock('../../../assets/images/app-logo.svg', () => ({
  ReactComponent: () => <img alt='Logo' />
}));
describe('Login', () => {
  const loginRequestSpy = jest.fn();
  let store: any;
  const props: any = {
    loggingIn: false,
    loginRequest
  };
  store = mockStore({
    user: { loggingIn: true }
  });

  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login {...props} loginRequest={loginRequestSpy} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should contain a logo', () => {
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('should contain two text input fields', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('should contain a checkbox input field', () => {
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should contain a submit button', () => {
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  // Update this test as well
  it('should contain a submit button', () => {
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should contain a form with email and password input fields', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('calls toastCenter.dismissAllToast() on unmount', async () => {
    const dismissAllToastMock = jest.spyOn(toastCenter, 'dismissAllToast');

    // Unmount the component
    cleanup();

    await waitFor(() => {
      expect(dismissAllToastMock).toHaveBeenCalled();
    });
  });
});
