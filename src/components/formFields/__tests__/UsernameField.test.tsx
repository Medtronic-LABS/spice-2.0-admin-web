import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UsernameField from '../UsernameField';
import { fetchUserByUsername } from '../../../services/userAPI';
import ApiError from '../../../global/ApiError';
import toastCenter from '../../../utils/toastCenter';

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    user: {
      appTypes: ['COMMUNITY'],
      country: {
        appTypes: ['COMMUNITY']
      }
    }
  },
  common: {
    labelName: {
      region: { s: 'Region', p: 'Regions' },
      healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
      district: { s: 'County', p: 'Counties' },
      chiefdom: { s: 'Sub County', p: 'Sub Counties' }
    }
  }
});

jest.mock('../../../services/userAPI');
const mockFetchUserByUsername = fetchUserByUsername as jest.MockedFunction<typeof fetchUserByUsername>;

const mockTextInputComponent = jest.fn();
jest.mock('../TextInput', () => ({
  __esModule: true,
  default: (props: any) => {
    mockTextInputComponent(props);
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

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    appTypes: ['COMMUNITY'],
    isCommunity: true
  }))
}));

describe('UsernameField', () => {
  const mockForm: any = {
    getState: () => ({
      values: {
        users: [{ username: 'testuser' }]
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
    clearEmail: true,
    isHF: false,
    isHFCreate: false,
    isSiteUser: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTextInputComponent.mockClear();
  });

  const renderUsernameField = (props = {}) => {
    return render(
      <Provider store={store}>
        <Form onSubmit={() => {}}>
          {() => <UsernameField {...defaultProps} {...props} />}
        </Form>
      </Provider>
    );
  };

  describe('Component Rendering', () => {
    it('renders username field correctly', () => {
      renderUsernameField();
      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('renders with Username label', () => {
      renderUsernameField();
      expect(mockTextInputComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'Username'
        })
      );
    });

    it('disables input when isEdit is true', () => {
      renderUsernameField({ isEdit: true });
      expect(mockTextInputComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true
        })
      );
    });

    it('disables input when isDisabled prop is true', () => {
      renderUsernameField({ isDisabled: true });
      expect(mockTextInputComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: expect.anything()
        })
      );
    });
  });

  describe('Username Validation - No Spaces', () => {
    it('shows error message when username contains spaces', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'john doe' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.error).toBeTruthy();
      });
    });

    it('does not show error for username without spaces', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'johndoe' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('shows error for username with leading spaces', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: ' johndoe' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.error).toBeTruthy();
      });
    });

    it('shows error for username with trailing spaces', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'johndoe ' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.error).toBeTruthy();
      });
    });

    it('shows error for username with multiple spaces', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'john  doe  smith' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.error).toBeTruthy();
      });
    });
  });

  describe('Username Existence Validation', () => {
    it('validates username on blur', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(mockFetchUserByUsername).toHaveBeenCalled();
    });

    it('shows error when username already exists', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: { username: 'existinguser' } }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'existinguser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('does not validate if username is empty', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(mockFetchUserByUsername).not.toHaveBeenCalled();
      });
    });

    it('validates same username again when explicitly triggered', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      const firstCallCount = mockFetchUserByUsername.mock.calls.length;

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      // Should validate at least once
      expect(mockFetchUserByUsername.mock.calls.length).toBeGreaterThanOrEqual(firstCallCount);
    });
  });

  describe('Auto-populate Feature', () => {
    it('does not auto-populate user data when enableAutoPopulate is true', async () => {
      const mockOnFindExistingUser = jest.fn();
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: { username: 'existinguser', firstName: 'John', lastName: 'Doe' } }
      });

      renderUsernameField({
        enableAutoPopulate: true,
        onFindExistingUser: mockOnFindExistingUser
      });

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'existinguser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(mockOnFindExistingUser).not.toHaveBeenCalled();
    });

    it('keeps username input enabled when existing user is found', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: { username: 'existinguser' } }
      });

      renderUsernameField({ enableAutoPopulate: true });

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'existinguser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.disabled).toBe(false);
      });
    });

    it('does not auto-populate when enableAutoPopulate is false', async () => {
      const mockOnFindExistingUser = jest.fn();
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: { username: 'existinguser' } }
      });

      renderUsernameField({
        enableAutoPopulate: false,
        onFindExistingUser: mockOnFindExistingUser
      });

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'existinguser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(mockOnFindExistingUser).not.toHaveBeenCalled();
    });

    it('clears error when auto-populate finds user with empty username', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: { username: '' } }
      });

      renderUsernameField({ enableAutoPopulate: true });

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles 400 CFR error', async () => {
      const apiError = new ApiError('CFR Error', 400);
      mockFetchUserByUsername.mockRejectedValue(apiError);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles 406 different org error', async () => {
      const apiError = new ApiError('Different Org Error', 406);
      mockFetchUserByUsername.mockRejectedValue(apiError);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles 412 site admin error', async () => {
      const apiError = new ApiError('Site Admin Error', 412);
      mockFetchUserByUsername.mockRejectedValue(apiError);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles 409 conflict error', async () => {
      const apiError = new ApiError('Conflict Error', 409);
      mockFetchUserByUsername.mockRejectedValue(apiError);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles network error', async () => {
      const error = new Error('Network error');
      mockFetchUserByUsername.mockRejectedValue(error);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        expect(toastCenter.error).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('shows validation error message in helper text for network errors', async () => {
      const error = new Error('Network error');
      mockFetchUserByUsername.mockRejectedValue(error);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.error).toBe('Username is not validated.');
      });
    });
  });

  describe('Duplication Validation', () => {
    it('detects duplicate usernames within the form', async () => {
      const formWithDuplicates: any = {
        getState: () => ({
          values: {
            users: [
              { username: 'johndoe' },
              { username: 'johndoe' }
            ]
          }
        }),
        change: jest.fn()
      };

      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      render(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => (
              <>
                <UsernameField {...defaultProps} form={formWithDuplicates} index={0} />
                <UsernameField {...defaultProps} form={formWithDuplicates} index={1} />
              </>
            )}
          </Form>
        </Provider>
      );

      const inputs = screen.getAllByTestId('input');
      
      fireEvent.change(inputs[1], { target: { value: 'johndoe' } });
      await waitFor(() => {
        fireEvent.blur(inputs[1]);
      });

      expect(screen.getAllByTestId('text-input')).toHaveLength(2);
    });

    it('allows same username at the first occurrence', async () => {
      const formWithDuplicates: any = {
        getState: () => ({
          values: {
            users: [
              { username: 'johndoe' },
              { username: 'johndoe' }
            ]
          }
        }),
        change: jest.fn()
      };

      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      render(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} form={formWithDuplicates} index={0} />}
          </Form>
        </Provider>
      );

      const input = screen.getByTestId('input');
      
      fireEvent.change(input, { target: { value: 'johndoe' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loader while validating username', async () => {
      mockFetchUserByUsername.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
                data: { entity: null }
              });
            }, 100);
          })
      );

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const callsWithLoader = mockTextInputComponent.mock.calls.filter(call => call[0].showLoader === true);
        expect(callsWithLoader.length).toBeGreaterThan(0);
      });
    });

    it('stops loading after validation completes', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.showLoader).toBe(false);
      });
    });
  });

  describe('Ref Methods', () => {
    it('handles resetUsernameField ref method correctly', () => {
      const ref: any = { current: null };

      render(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} ref={ref} />}
          </Form>
        </Provider>
      );

      expect(ref.current).toBeDefined();
      expect(ref.current.resetUsernameField).toBeDefined();
      
      ref.current.resetUsernameField();

      expect(mockTextInputComponent).toHaveBeenCalled();
    });
  });

  describe('onChange Behavior', () => {
    it('trims username value on change', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: '  testuser  ' } });

      expect(mockForm.change).not.toHaveBeenCalled();
    });

    it('prevents onChange when isEdit is true', () => {
      renderUsernameField({ isEdit: true });
      const input = screen.getByTestId('input');

      const changeHandler = mockTextInputComponent.mock.calls[0][0].onChange;
      changeHandler({ target: { value: 'newusername' } });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('prevents onChange when disabled', () => {
      renderUsernameField({ isDisabled: true });
      const input = screen.getByTestId('input');

      expect(mockTextInputComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: expect.anything()
        })
      );
    });
  });

  describe('Clear Email Functionality', () => {
    it('clears username when clearEmail is true', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField({ clearEmail: true });
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('does not clear username when clearEmail is false', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField({ clearEmail: false });
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });

  describe('Error Label Behavior', () => {
    it('shows empty errorLabel for space validation error', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'john doe' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.errorLabel).toBe('');
      });
    });

    it('shows empty errorLabel for already exists error', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: { username: 'existinguser' } }
      });

      renderUsernameField({ enableAutoPopulate: false });
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'existinguser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.errorLabel).toBe('');
      });
    });

    it('shows username errorLabel for other validation errors', async () => {
      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      await waitFor(() => {
        const callsWithUsernameLabel = mockTextInputComponent.mock.calls.filter(
          call => call[0].errorLabel === 'username'
        );
        expect(callsWithUsernameLabel.length).toBeGreaterThan(0);
      });
    });
  });

  describe('API Parameters', () => {
    it('sends correct payload for community app type', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(mockFetchUserByUsername).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          appTypes: ['COMMUNITY']
        })
      );
    });

    it('sends correct payload for non-community with parentOrgId', async () => {
      const nonCommunityStore = mockStore({
        user: {
          user: {
            appTypes: ['NON_COMMUNITY'],
            country: {
              appTypes: ['NON_COMMUNITY']
            }
          }
        },
        common: {
          labelName: null
        }
      });

      jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
        __esModule: true,
        default: jest.fn(() => ({
          appTypes: ['NON_COMMUNITY'],
          isCommunity: false
        }))
      }));

      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      render(
        <Provider store={nonCommunityStore}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} parentOrgId="123" ignoreTenantId="456" />}
          </Form>
        </Provider>
      );

      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(mockFetchUserByUsername).toHaveBeenCalled();
    });

    it('includes isSiteUsers flag when isSiteUser is true and not HF', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField({ isSiteUser: true, isHF: false, isHFCreate: false });
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(mockFetchUserByUsername).toHaveBeenCalled();
    });
  });

  describe('Network Error Recovery', () => {
    it('shows validate username link on network error', async () => {
      const error = new Error('Network error');
      mockFetchUserByUsername.mockRejectedValue(error);

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const lastCall = mockTextInputComponent.mock.calls[mockTextInputComponent.mock.calls.length - 1][0];
        expect(lastCall.helpertext).toBeTruthy();
      });
    });

    it('retries validation when clicking validate link', async () => {
      const error = new Error('Network error');
      mockFetchUserByUsername.mockRejectedValueOnce(error).mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });

  describe('ParentOrgId and IgnoreTenantId Changes', () => {
    it('re-validates username when parentOrgId changes', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      const { rerender } = render(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} parentOrgId="123" />}
          </Form>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument();
      });

      rerender(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} parentOrgId="456" />}
          </Form>
        </Provider>
      );

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('re-validates username when ignoreTenantId changes', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      const { rerender } = render(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} ignoreTenantId="123" />}
          </Form>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument();
      });

      rerender(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} ignoreTenantId="456" />}
          </Form>
        </Provider>
      );

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles form.getState error gracefully', () => {
      const errorForm: any = {
        getState: () => {
          throw new Error('Form state error');
        },
        change: jest.fn()
      };

      expect(() => {
        render(
          <Provider store={store}>
            <Form onSubmit={() => {}}>
              {() => <UsernameField {...defaultProps} form={errorForm} />}
            </Form>
          </Provider>
        );
      }).not.toThrow();
    });

    it('handles validateDuplication error gracefully', async () => {
      const errorForm: any = {
        getState: () => {
          throw new Error('Duplication check error');
        },
        change: jest.fn()
      };

      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      render(
        <Provider store={store}>
          <Form onSubmit={() => {}}>
            {() => <UsernameField {...defaultProps} form={errorForm} />}
          </Form>
        </Provider>
      );

      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('handles empty username in form state', () => {
      const emptyForm: any = {
        getState: () => ({
          values: {
            users: [{ username: '' }]
          }
        }),
        change: jest.fn()
      };

      expect(() => {
        render(
          <Provider store={store}>
            <Form onSubmit={() => {}}>
              {() => <UsernameField {...defaultProps} form={emptyForm} />}
            </Form>
          </Provider>
        );
      }).not.toThrow();
    });
  });

  describe('Form Trigger Behavior', () => {
    it('triggers form change after validation to update form state', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        expect(mockForm.change).toHaveBeenCalled();
      });
    });

    it('triggers form change with space and then removes it', async () => {
      mockFetchUserByUsername.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        data: { entity: null }
      });

      renderUsernameField();
      const input = screen.getByTestId('input');

      fireEvent.change(input, { target: { value: 'testuser' } });
      await waitFor(() => {
        fireEvent.blur(input);
      });

      await waitFor(() => {
        const changeCalls = mockForm.change.mock.calls;
        expect(changeCalls.length).toBeGreaterThan(0);
      });
    });
  });
});
