import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import ResetPasswordFields from '../ResetPasswordFields';
import CryptoJS from 'crypto-js';

jest.mock('crypto-js', () => ({
  HmacSHA512: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('hashed-password')
  }),
  enc: {
    Hex: {
      stringify: jest.fn()
    }
  }
}));

describe('ResetPasswordFields', () => {
  const mockSetSubmitEnabled = jest.fn();
  const defaultProps = {
    email: 'test@example.com',
    setSubmitEnabled: mockSetSubmitEnabled,
    adminPasswordChange: false
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <ResetPasswordFields {...props} />
          </form>
        )}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_PASSWORD_HASH_KEY = 'test-key';
  });

  describe('Rendering', () => {
    it('should render new password and confirm password fields when adminPasswordChange is false', () => {
      renderComponent();
      expect(screen.getByTestId('new-password-field')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-field')).toBeInTheDocument();
      expect(screen.queryByTestId('old-password-field')).not.toBeInTheDocument();
    });

    it('should render all password fields when adminPasswordChange is true', () => {
      renderComponent({ ...defaultProps, adminPasswordChange: true });
      expect(screen.getByTestId('old-password-field')).toBeInTheDocument();
      expect(screen.getByTestId('new-password-field')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-password-field')).not.toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle new password visibility', () => {
      renderComponent();
      const newPasswordField = screen.getByPlaceholderText('Enter New Password');
      const toggleButton = screen.getAllByTitle('Show password')[0];

      expect(newPasswordField).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(newPasswordField).toHaveAttribute('type', 'text');
      fireEvent.click(toggleButton);
      expect(newPasswordField).toHaveAttribute('type', 'password');
    });

    it('should toggle confirm password visibility', () => {
      renderComponent();
      const confirmPasswordField = screen.getByPlaceholderText('Re-enter New Password');
      const toggleButton = screen.getAllByTitle('Show password')[1];

      expect(confirmPasswordField).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(confirmPasswordField).toHaveAttribute('type', 'text');
    });

    it('should toggle old password visibility when adminPasswordChange is true', () => {
      renderComponent({ ...defaultProps, adminPasswordChange: true });
      const oldPasswordField = screen.getByPlaceholderText('Enter Old Password');
      const toggleButton = screen.getAllByTitle('Show password')[0];

      expect(oldPasswordField).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(oldPasswordField).toHaveAttribute('type', 'text');
    });
  });

  it('should generate hashed password using HMAC-SHA512', () => {
    const { generatePassword } = require('../ResetPasswordFields');
    const password = 'testPassword123';
    const hashedPassword = generatePassword(password);

    expect(hashedPassword).toBe('hashed-password');
    expect(CryptoJS.HmacSHA512).toHaveBeenCalledWith(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
  });
});
