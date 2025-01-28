import React, { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/images/app-logo.svg';
import Checkbox from '../../components/formFields/Checkbox';
import TextInput from '../../components/formFields/TextInput';
import { composeValidators, required, validateEmail } from '../../utils/validation';
import styles from './Authentication.module.scss';
import localStorageServices from '../../global/localStorageServices';
import APPCONSTANTS from '../../constants/appConstants';
import { decryptData } from '../../utils/commonUtils';
import showPass from '../../assets/images/showPass.svg';
import hidePass from '../../assets/images/hidePass.svg';
import { PUBLIC_ROUTES } from '../../constants/route';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { loginRequest } from '../../store/user/actions';
import { useDispatch } from 'react-redux';

interface ILoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}
/**
 * Login component
 * @param {any} props - The props
 * @returns {React.ReactElement} The rendered Login component
 */
const Login = (props: any): React.ReactElement => {
  const dispatch = useDispatch();
  const username = localStorageServices.getItem(APPCONSTANTS.USERNAME);
  const password = localStorageServices.getItem(APPCONSTANTS.PASSWORD);
  const rememberMe = localStorageServices.getItem(APPCONSTANTS.REMEMBER_ME);
  const initialFormValues = useRef({
    email: username || '',
    password: password ? decryptData(password) : '',
    rememberMe
  } as ILoginForm);
  const [isShowPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (username && password) {
      initialFormValues.current = {
        email: username,
        password: decryptData(password),
        rememberMe: true
      };
    }
    return () => {
      toastCenter.dismissAllToast();
    };
  }, [password, username]);

  /**
   * Handles the form submission
   * @param {Object} param0 - The form data
   */
  const onSubmit = ({
    email,
    password: newPassword,
    rememberMe: newRememberMe = false
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    dispatch(
      loginRequest({
        username: email,
        password: newPassword,
        rememberMe: newRememberMe,
        failureCb: (e: Error) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e.name === 'TypeError' ? { ...e, message: APPCONSTANTS.LOGIN_FAILED_MESSAGE } : e,
              APPCONSTANTS.LOGIN_FAILED_TITLE,
              e?.message === APPCONSTANTS.INVALID_CREDENTIALS ? e.message : APPCONSTANTS.LOGIN_FAILED_MESSAGE
            )
          );
        }
      })
    );
  };

  /**
   * Handles the click event to toggle password visibility
   */
  const setShowPasswordHandle = () => {
    setShowPassword(!isShowPassword);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginFormContainer}>
        <div className={`${styles.brand} text-center`}>
          <Logo aria-labelledby='Medtronic' />
        </div>
        <div className='primary-title text-center'>
          <b>Welcome</b>
        </div>
        <div className={`primary-title text-center ${styles.loginTitle}`}>Login to your account</div>

        <Form
          onSubmit={onSubmit}
          initialValues={initialFormValues.current}
          data-testid='login-form'
          render={({ handleSubmit, valid }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name='email'
                type='text'
                validate={composeValidators(required, validateEmail)}
                render={({ input, meta }) => (
                  <TextInput
                    {...input}
                    label='Email'
                    errorLabel='email'
                    error={(meta.touched && meta.error) || undefined}
                    onChange={(e) => {
                      initialFormValues.current = {
                        ...initialFormValues.current,
                        email: e.target.value
                      };
                      input.onChange(e);
                    }}
                  />
                )}
              />
              <div className={styles.togglePassword}>
                <Field
                  name='password'
                  type={isShowPassword ? 'text' : 'password'}
                  validate={required}
                  render={({ input, meta }) => (
                    <TextInput
                      {...input}
                      label='Password'
                      errorLabel='password'
                      error={(meta.touched && meta.error) || undefined}
                      className={styles.passwordBox}
                      onChange={(e) => {
                        initialFormValues.current = {
                          ...initialFormValues.current,
                          password: e.target.value
                        };
                        input.onChange(e);
                      }}
                    />
                  )}
                />
                <img
                  className={styles.eyeIcon}
                  title={isShowPassword ? 'Hide password' : 'Show password'}
                  src={isShowPassword ? hidePass : showPass}
                  onClick={setShowPasswordHandle}
                  alt={isShowPassword ? 'Hide password' : 'Show password'}
                />
              </div>
              <div className='d-flex align-items-center justify-content-between mt-1'>
                <div>
                  <Field
                    name='rememberMe'
                    type='checkbox'
                    render={({ input }) => <Checkbox label='Remember me' {...input} />}
                  />
                </div>
                <div className={`link-text ${styles.forgotPassword}`}>
                  <Link to={PUBLIC_ROUTES.forgotPassword}>Forgot password?</Link>
                </div>
              </div>
              <button disabled={!valid || props.loggingIn} type='submit' className='mt-2 btn primary-btn w-100'>
                Login
              </button>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default Login;
