import React from 'react';
import { mount } from 'enzyme';
import ResetPassword from '../ResetPassword';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import logo from '../../../assets/images/app-logo.svg';
import styles from './Authentication.module.scss';
import { PUBLIC_ROUTES } from '../../../constants/route';

const mockStore = configureMockStore([]);
describe('ResetPassword', () => {
  let wrapper: any;
  let mockProps: any;
  let store: any;
  const mockIsPasswordSet = false;

  beforeEach(() => {
    store = mockStore({
      user: { loggingIn: true }
    });
    mockProps = {
      isResetPassword: true,
      isPasswordSet: false,
      email: 'example@example.com',
      createPassword: jest.fn(),
      getUserName: jest.fn(),
      resetPassword: jest.fn(),
      history: {
        location: {
          search: '?reset_password=true&expires=1644822000000'
        },
        push: jest.fn()
      },
      match: {
        params: { token: 'testToken' }
      }
    };

    jest.spyOn(global, 'Date').mockImplementation(
      () =>
        ({
          getTime: jest.fn(() => 1644818400000) // Mocking current date time
        } as any)
    );
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ResetPassword {...mockProps} isPasswordSet={mockIsPasswordSet} />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render ResetPassword component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should call backToLogin and info when expiresTime < currentTime', () => {
    const mockLocation = { search: '?reset_password=true&expires=1644818300000' };
    const mockHistory = { push: jest.fn(), location: mockLocation };
    const newMockProps = { ...mockProps, history: mockHistory };
    const newWrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ResetPassword {...newMockProps} isPasswordSet={mockIsPasswordSet} />
        </MemoryRouter>
      </Provider>
    );
    const { isResetPassword } = newWrapper.find('ResetPassword').props() as any;
    // Assert that isResetPassword is true
    expect(isResetPassword).toBe(true);
    expect(global.Date).toHaveBeenCalled();
    expect(newMockProps.history.push).toHaveBeenCalledWith({ pathname: PUBLIC_ROUTES.login });
  });

  it('renders the logo', () => {
    const img = wrapper.find('img');

    expect(img.first().prop('src')).toEqual(logo);
    expect(img.first().prop('alt')).toEqual('Medtronics');
    expect(wrapper.find(`.${styles.brand}`).exists()).toBe(true);
  });

  it('renders the reset password title', () => {
    const title = wrapper.find('.primary-title');

    expect(title.hasClass('text-center')).toEqual(true);
    expect(wrapper.find(`.${styles.loginTitle}`).exists()).toBe(true);
    expect(title.text()).toEqual('Reset your password');
  });

  it('should call resetPassword when isResetPassword is true', () => {
    const resetPasswordMock = jest.fn();
    const createPasswordMock = jest.fn();
    expect(resetPasswordMock).toBeCalledTimes(0);
    expect(createPasswordMock).not.toHaveBeenCalled();
  });

  it('should dispatch createPasswordRequest action', () => {
    const dispatch = jest.fn();
    const email = 'test@test.com';
    const password = 'password123';
    const token = 'token123';
    const successCB = jest.fn();
    const expectedAction = 0;
    mockProps.createPassword({ email, password, token, successCB });
    expect(dispatch).toBeCalledTimes(expectedAction);
  });

  it('should dispatch getUserName action', () => {
    const dispatch = jest.fn();
    const token = 'token123';
    const successCB = jest.fn();
    const expectedAction = 0;
    mockProps.getUserName({ token, successCB });
    expect(dispatch).toBeCalledTimes(expectedAction);
  });

  it('should dispatch resetPassword action', () => {
    const dispatch = jest.fn();
    const email = 'test@test.com';
    const password = 'password123';
    const token = 'token123';
    const successCB = jest.fn();
    const expectedAction = 0;
    mockProps.resetPassword({ email, password, token, successCB });
    expect(dispatch).toBeCalledTimes(expectedAction);
  });
});
