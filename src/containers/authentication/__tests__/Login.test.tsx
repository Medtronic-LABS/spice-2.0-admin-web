import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import Login from '../Login';
import { loginRequest } from '../../../store/user/actions';
import toastCenter from '../../../utils/toastCenter';
import localStorageServices from '../../../global/localStorageServices';
import APPCONSTANTS from '../../../constants/appConstants';
import * as commonUtils from '../../../utils/commonUtils';

const mockStore = configureMockStore([]);

jest.mock('../../../assets/images/app-logo.svg', () => ({
  ReactComponent: () => <img alt='Logo' />
}));

jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    dismissAllToast: jest.fn()
  },
  getErrorToastArgs: jest.fn().mockReturnValue(['Error message', 'Error title'])
}));

jest.mock('../../../global/localStorageServices', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    deleteItem: jest.fn()
  }
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}));

describe('Login', () => {
  let store: any;
  const defaultProps: any = {
    loggingIn: false
  };

  beforeEach(() => {
    store = mockStore({
      user: { loggingIn: false }
    });
    jest.clearAllMocks();
    (localStorageServices.getItem as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  const renderLogin = (props = {}) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Login {...defaultProps} {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  describe('Component Rendering', () => {
    it('should render login page correctly', () => {
      renderLogin();
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Login to your account')).toBeInTheDocument();
    });

    it('should contain a logo', () => {
      renderLogin();
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    it('should contain email/username input field', () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      expect(emailInput).toBeInTheDocument();
    });

    it('should contain password input field', () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
    });

    it('should contain a remember me checkbox', () => {
      renderLogin();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Remember me')).toBeInTheDocument();
    });

    it('should contain a login button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should contain forgot password link', () => {
      renderLogin();
      const forgotPasswordLink = screen.getByText('Forgot password?');
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye icon is clicked', () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      const toggleButton = screen.getByAltText('Show password');

      expect(passwordInput.type).toBe('password');

      fireEvent.click(toggleButton);

      expect(passwordInput.type).toBe('text');
    });

    it('should show hide password icon when password is visible', () => {
      renderLogin();
      const toggleButton = screen.getByAltText('Show password');

      fireEvent.click(toggleButton);

      expect(screen.getByAltText('Hide password')).toBeInTheDocument();
    });

    it('should show password icon when password is hidden', () => {
      renderLogin();
      expect(screen.getByAltText('Show password')).toBeInTheDocument();
    });

    it('should have correct title attribute on toggle button', () => {
      renderLogin();
      const toggleButton = screen.getByAltText('Show password');

      expect(toggleButton).toHaveAttribute('title', 'Show password');

      fireEvent.click(toggleButton);

      expect(screen.getByAltText('Hide password')).toHaveAttribute('title', 'Hide password');
    });
  });

  describe('Form Validation', () => {
    it('should disable login button when form is invalid', () => {
      renderLogin();
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeDisabled();
    });

    it('should enable login button when form is valid', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });
    });

    it('should show error when email field is touched and empty', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);

      fireEvent.focus(emailInput);
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/Please enter/i)).toBeInTheDocument();
      });
    });

    it('should show error when password field is touched and empty', async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.focus(passwordInput);
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/Please enter/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).toBeDisabled();
      });
    });

    it('should accept valid email', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).not.toBeDisabled();
      });
    });

    it('should accept valid phone number', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: '+1234567890' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).not.toBeDisabled();
      });
    });

    it('should accept valid username', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'johndoe' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).not.toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should dispatch loginRequest on form submit', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const loginButton = screen.getByRole('button', { name: /login/i });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      }, { timeout: 3000 });

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            username: 'test@example.com',
            password: 'password123'
          })
        );
      });
    });

    it('should dispatch loginRequest with rememberMe checked', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const rememberMeCheckbox = screen.getByRole('checkbox');
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(rememberMeCheckbox);

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            username: 'test@example.com',
            password: 'password123',
            rememberMe: true
          })
        );
      });
    });

    it('should not submit when loggingIn prop is true', async () => {
      renderLogin({ loggingIn: true });
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });

    it('should include failureCb in loginRequest action', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            failureCb: expect.any(Function)
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on login failure', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        const dispatchCall = mockDispatch.mock.calls[0][0];
        const failureCb = dispatchCall.failureCb;
        expect(failureCb).toBeDefined();

        // Simulate failure callback
        const error = new Error('Invalid credentials');
        failureCb(error);

        expect(toastCenter.error).toHaveBeenCalled();
      });
    });

    it('should handle TypeError with custom login failed message', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        const dispatchCall = mockDispatch.mock.calls[0][0];
        const failureCb = dispatchCall.failureCb;

        const typeError = new TypeError('Network error');
        failureCb(typeError);

        expect(toastCenter.error).toHaveBeenCalled();
      });
    });

    it('should handle invalid credentials error', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        const dispatchCall = mockDispatch.mock.calls[0][0];
        const failureCb = dispatchCall.failureCb;

        const error = new Error(APPCONSTANTS.INVALID_CREDENTIALS);
        failureCb(error);

        expect(toastCenter.error).toHaveBeenCalled();
      });
    });
  });

  describe('Remember Me Functionality', () => {
    it('should load saved credentials from localStorage', () => {
      const mockUsername = 'saved@example.com';
      const mockPassword = 'encrypted-password';
      const mockDecryptedPassword = 'decrypted-password';

      (localStorageServices.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === APPCONSTANTS.USERNAME) return mockUsername;
        if (key === APPCONSTANTS.PASSWORD) return mockPassword;
        if (key === APPCONSTANTS.REMEMBER_ME) return true;
        return null;
      });

      jest.spyOn(commonUtils, 'decryptData').mockReturnValue(mockDecryptedPassword);

      renderLogin();

      const emailInput = screen.getByLabelText(/email, username or mobile number/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      const rememberMeCheckbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(emailInput.value).toBe(mockUsername);
      expect(passwordInput.value).toBe(mockDecryptedPassword);
      expect(rememberMeCheckbox.checked).toBe(true);
    });

    it('should handle missing saved credentials', () => {
      (localStorageServices.getItem as jest.Mock).mockReturnValue(null);

      renderLogin();

      const emailInput = screen.getByLabelText(/email, username or mobile number/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });

    it('should decrypt saved password on load', () => {
      const mockPassword = 'encrypted-password';
      const mockDecryptedPassword = 'decrypted-password';

      (localStorageServices.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === APPCONSTANTS.PASSWORD) return mockPassword;
        return null;
      });

      const decryptSpy = jest.spyOn(commonUtils, 'decryptData').mockReturnValue(mockDecryptedPassword);

      renderLogin();

      expect(decryptSpy).toHaveBeenCalledWith(mockPassword);
    });

    it('should update initialFormValues when username and password exist in localStorage', () => {
      const mockUsername = 'saved@example.com';
      const mockPassword = 'encrypted-password';
      const mockDecryptedPassword = 'decrypted-password';

      (localStorageServices.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === APPCONSTANTS.USERNAME) return mockUsername;
        if (key === APPCONSTANTS.PASSWORD) return mockPassword;
        return null;
      });

      jest.spyOn(commonUtils, 'decryptData').mockReturnValue(mockDecryptedPassword);

      renderLogin();

      const emailInput = screen.getByLabelText(/email, username or mobile number/i) as HTMLInputElement;
      expect(emailInput.value).toBe(mockUsername);
    });
  });

  describe('Input Field Updates', () => {
    it('should update email field value on change', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

      await waitFor(() => {
        expect(emailInput.value).toBe('newemail@example.com');
      });
    });

    it('should update password field value on change', async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

      await waitFor(() => {
        expect(passwordInput.value).toBe('newpassword');
      });
    });

    it('should toggle remember me checkbox', () => {
      renderLogin();
      const rememberMeCheckbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(rememberMeCheckbox.checked).toBe(false);

      fireEvent.click(rememberMeCheckbox);

      expect(rememberMeCheckbox.checked).toBe(true);
    });

    it('should update initialFormValues.current when email changes', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);

      fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });

      await waitFor(() => {
        expect((emailInput as HTMLInputElement).value).toBe('updated@example.com');
      });
    });

    it('should update initialFormValues.current when password changes', async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(passwordInput, { target: { value: 'updatedpassword' } });

      await waitFor(() => {
        expect((passwordInput as HTMLInputElement).value).toBe('updatedpassword');
      });
    });
  });

  describe('Cleanup and Lifecycle', () => {
    it('should call toastCenter.dismissAllToast on unmount', async () => {
      renderLogin();

      cleanup();

      await waitFor(() => {
        expect(toastCenter.dismissAllToast).toHaveBeenCalled();
      });
    });

    it('should update initial form values on username/password change in useEffect', () => {
      const mockUsername = 'saved@example.com';
      const mockPassword = 'encrypted-password';
      const mockDecryptedPassword = 'decrypted-password';

      (localStorageServices.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === APPCONSTANTS.USERNAME) return mockUsername;
        if (key === APPCONSTANTS.PASSWORD) return mockPassword;
        return null;
      });

      jest.spyOn(commonUtils, 'decryptData').mockReturnValue(mockDecryptedPassword);

      renderLogin();

      expect(localStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.USERNAME);
      expect(localStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.PASSWORD);
      expect(localStorageServices.getItem).toHaveBeenCalledWith(APPCONSTANTS.REMEMBER_ME);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string in email field', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });

    it('should handle empty string in password field', async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });

    it('should handle whitespace-only email', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: '   ' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });

    it('should handle very long email input', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const longEmail = 'a'.repeat(100) + '@example.com';

      fireEvent.change(emailInput, { target: { value: longEmail } });

      expect((emailInput as HTMLInputElement).value).toBe(longEmail);
    });

    it('should handle special characters in email input', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email, username or mobile number/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'test+tag@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Just verify that the inputs accept the values
      expect((emailInput as HTMLInputElement).value).toBe('test+tag@example.com');
      expect((passwordInput as HTMLInputElement).value).toBe('password123');
    });

    it('should handle decryptData returning null', () => {
      const mockPassword = 'encrypted-password';

      (localStorageServices.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === APPCONSTANTS.PASSWORD) return mockPassword;
        return null;
      });

      jest.spyOn(commonUtils, 'decryptData').mockReturnValue(null as any);

      expect(() => renderLogin()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels for all form inputs', () => {
      renderLogin();

      expect(screen.getByLabelText(/email, username or mobile number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByText('Remember me')).toBeInTheDocument();
    });

    it('should have accessible button text', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should have accessible logo', () => {
      renderLogin();
      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have accessible password toggle icons', () => {
      renderLogin();
      expect(screen.getByAltText('Show password')).toBeInTheDocument();

      fireEvent.click(screen.getByAltText('Show password'));

      expect(screen.getByAltText('Hide password')).toBeInTheDocument();
    });
  });
});
