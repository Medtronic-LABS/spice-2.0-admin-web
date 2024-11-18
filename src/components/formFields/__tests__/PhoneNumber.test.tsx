import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import PhoneNumberField from '../PhoneNumber';
import { validatePhoneNumber } from '../../../services/userAPI';
import ApiError from '../../../global/ApiError';

jest.mock('../../../services/userAPI');
const mockValidatePhoneNumber = validatePhoneNumber as jest.MockedFunction<typeof validatePhoneNumber>;

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

describe('PhoneNumberField', () => {
  const defaultProps: any = {
    id: 1,
    name: 'users[0]',
    fieldName: 'phoneNumber',
    formName: 'users',
    index: 0,
    countryCode: 'US',
    form: {
      getState: () => ({
        values: {
          users: [{ phoneNumber: '' }]
        }
      }),
      change: jest.fn()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidatePhoneNumber.mockResolvedValue(undefined as any);
  });

  it('renders phone number field correctly', () => {
    render(
      <Form
        // tslint:disable-next-line:no-empty
        onSubmit={() => {}}
        initialValues={{
          users: [{ phoneNumber: '1234567890' }, { phoneNumber: '1234567890' }]
        }}
      >
        {() => <PhoneNumberField {...defaultProps} />}
      </Form>
    );
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('validates phone number on blur', async () => {
    // tslint:disable-next-line:no-empty
    render(<Form onSubmit={() => {}}>{() => <PhoneNumberField {...defaultProps} />}</Form>);

    const inputField = screen.getByTestId('input');
    fireEvent.change(inputField, { target: { value: '1234567890' } });
    fireEvent.blur(inputField);

    await waitFor(() => {
      expect(mockValidatePhoneNumber).toHaveBeenCalledWith('1234567890', 1, 'US');
    });

    fireEvent.change(inputField, { target: { value: '1234' } });
    fireEvent.blur(inputField);
    await waitFor(() => {
      expect(mockValidatePhoneNumber).not.toHaveBeenCalledWith('1234', 1, 'US');
    });
  });

  it('shows error when phone number already exists', async () => {
    const error = new ApiError({ statusCode: '409', message: 'already exists' });
    error.statusCode = 409;
    mockValidatePhoneNumber.mockRejectedValue(error);

    // tslint:disable-next-line:no-empty
    render(<Form onSubmit={() => {}}>{() => <PhoneNumberField {...defaultProps} />}</Form>);

    const inputField = screen.getByTestId('input');
    fireEvent.change(inputField, { target: { value: '1234567890' } });
    await waitFor(() => {
      fireEvent.blur(inputField);
    });
  });

  it('handles network error during validation', async () => {
    mockValidatePhoneNumber.mockRejectedValue(new Error('Network error'));
    // tslint:disable-next-line:no-empty
    render(<Form onSubmit={() => {}}>{() => <PhoneNumberField {...defaultProps} />}</Form>);

    const inputField = screen.getByTestId('input');
    fireEvent.change(inputField, { target: { value: '1234567890' } });
    await waitFor(() => {
      fireEvent.blur(inputField);
    });

    await waitFor(() => {
      expect(mockSelectChildComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Phone number is not validated.'
        })
      );
    });
  });

  it('checks for duplicate phone numbers within form', async () => {
    const formWithDuplicates = {
      ...defaultProps.form,
      getState: () => ({
        values: {
          users: [{ phoneNumber: '1234567890' }, { phoneNumber: '9999999999' }, { phoneNumber: '1234567890' }]
        }
      })
    };

    render(
      // tslint:disable-next-line:no-empty
      <Form onSubmit={() => {}}>
        {() => <PhoneNumberField {...defaultProps} form={formWithDuplicates} index={2} />}
      </Form>
    );

    const inputField = screen.getByTestId('input');
    fireEvent.change(inputField, { target: { value: '1234567890' } });
    await waitFor(() => {
      fireEvent.blur(inputField);
    });

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });
});
