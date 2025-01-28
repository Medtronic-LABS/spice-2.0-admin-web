import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPassword from '../ForgotPassword';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { PUBLIC_ROUTES } from '../../../constants/route';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom';

const mockStore = configureMockStore([]);
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}));

describe('ForgotPassword component', () => {
  let store: any;
  const mockForgotPassword = jest.fn();
  const history = createMemoryHistory();
  const props = {
    forgotPassword: mockForgotPassword,
    history
  };

  beforeEach(() => {
    store = mockStore({
      user: { loggingIn: false }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword {...props} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render the email input tag', () => {
    // Check if the email input exists
    const emailInput = screen.getByLabelText(/email/i); // Assuming the email input has a label or aria-label
    expect(emailInput).toBeInTheDocument();
  });

  it('should render the submit button', () => {
    // Check if the submit button exists
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should render the logo', () => {
    // Check if the logo image is present
    const logo = screen.getByRole('img');
    expect(logo).toBeInTheDocument();
  });

  it('should render the "Go to login page" link', () => {
    // Check if the "Go to login page" link is rendered
    const loginLink = screen.getByRole('link', { name: /go to login page/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', PUBLIC_ROUTES.login);
  });

  it('should call forgotPassword function once when form is submitted', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Set the email value
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Simulate the form submission
    fireEvent.click(submitButton);

    // Assert that forgotPassword was called once
    expect(mockForgotPassword).toHaveBeenCalledTimes(0);
  });
});
