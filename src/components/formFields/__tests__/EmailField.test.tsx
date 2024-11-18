import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import EmailField from '../EmailField';
import { fetchUserByEmail } from '../../../services/userAPI';
import ApiError from '../../../global/ApiError';

jest.mock('../../../services/userAPI');
const mockFetchUserByEmail = fetchUserByEmail as jest.MockedFunction<typeof fetchUserByEmail>;

const mockSelectChildComponent = jest.fn();
jest.mock('../TextInput', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectChildComponent(props);
    return (
      <div data-testid='text-input'>
        <input data-testid='input' type='text' {...props} />
      </div>
    );
  }
}));

jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: {
    error: jest.fn()
  },
  getErrorToastArgs: jest.fn().mockReturnValue(['Error message', 'Error title'])
}));

describe('EmailField', () => {
  const mockForm: any = {
    getState: () => ({
      values: {
        users: [{ email: 'test@example.com' }]
      }
    }),
    change: jest.fn()
  };

  const defaultProps = {
    isEdit: false,
    name: 'users[0]',
    form: mockForm,
    formName: 'users',
    index: 0,
    isHF: false,
    isHFCreate: false,
    isSiteUser: false,
    clearEmail: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderEmailField = (props = {}) => {
    // tslint:disable-next-line:no-empty
    return render(<Form onSubmit={() => {}}>{() => <EmailField {...defaultProps} {...props} />}</Form>);
  };

  it('renders email field correctly', () => {
    renderEmailField();
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });
  it('validates email on blur', async () => {
    mockFetchUserByEmail.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      data: { entity: null }
    });

    renderEmailField();
    const input = screen.getByTestId('input');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('shows error when email already exists', async () => {
    (fetchUserByEmail as jest.Mock).mockResolvedValue({
      data: { entity: { username: 'test@example.com' } }
    });

    renderEmailField();
    const input = screen.getByTestId('input');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('disables input when isEdit is true', () => {
    renderEmailField({ isEdit: true });

    expect(mockSelectChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true
      })
    );
  });

  it('handles network error', async () => {
    (fetchUserByEmail as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderEmailField();
    const input = screen.getByTestId('input');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('auto-populates user data when enableAutoPopulate is true', async () => {
    const mockOnFindExistingUser = jest.fn();
    (fetchUserByEmail as jest.Mock).mockResolvedValue({
      data: { entity: { username: 'test@example.com' } }
    });

    renderEmailField({
      enableAutoPopulate: true,
      onFindExistingUser: mockOnFindExistingUser
    });

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('auto-populates user data when enableAutoPopulate is true', async () => {
    const mockOnFindExistingUser = jest.fn();
    (fetchUserByEmail as jest.Mock).mockResolvedValue({
      data: { entity: { username: 'test@example.com' } }
    });

    renderEmailField({
      enableAutoPopulate: true,
      onFindExistingUser: mockOnFindExistingUser
    });

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('handles resetEmailField ref method correctly', () => {
    const localProps: any = { isEdit: false, name: 'users[0]', form: mockForm, formName: 'users', index: 0 };
    const ref: any = { current: null };

    // tslint:disable-next-line:no-empty
    render(<Form onSubmit={() => {}}>{() => <EmailField {...localProps} ref={ref} />}</Form>);

    ref.current.resetEmailField();

    expect(mockSelectChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '',
        disabled: false
      })
    );
  });

  it('validates email on blur with isDisabled and disabled true', async () => {
    renderEmailField({ isDisabled: true, disabled: true, isEdit: false });
    const input = screen.getByTestId('input');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('auto-populates user data when enableAutoPopulate is true and username is empty', async () => {
    const mockOnFindExistingUser = jest.fn();
    (fetchUserByEmail as jest.Mock).mockResolvedValue({
      data: { entity: { username: '' } }
    });

    renderEmailField({
      enableAutoPopulate: true,
      onFindExistingUser: mockOnFindExistingUser
    });

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('validates email on blur with clearEmail as false', async () => {
    mockFetchUserByEmail.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      data: { entity: null }
    });

    renderEmailField({ clearEmail: false });
    const input = screen.getByTestId('input');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      fireEvent.blur(input);
    });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  describe('error handling', () => {
    it('handles 400 CFR error', async () => {
      const apiError = new ApiError('CFR Error', 400);
      mockFetchUserByEmail.mockRejectedValue(apiError);

      renderEmailField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles 406 different org error', async () => {
      const apiError = new ApiError('Different Org Error', 406);
      mockFetchUserByEmail.mockRejectedValue(apiError);

      renderEmailField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles 412 site admin error', async () => {
      const apiError = new ApiError('Site Admin Error', 412);
      mockFetchUserByEmail.mockRejectedValue(apiError);

      renderEmailField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles 409 already exists error', async () => {
      const apiError = new ApiError('Already Exists Error', 409);
      mockFetchUserByEmail.mockRejectedValue(apiError);

      renderEmailField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles other errors', async () => {
      const apiError = new Error('Other Error');
      mockFetchUserByEmail.mockRejectedValue(apiError);

      renderEmailField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });
});
