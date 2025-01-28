import styles from './Authentication.module.scss';
import logo from '../../assets/images/app-logo.svg';
import { Form } from 'react-final-form';
import ResetPasswordFields, { generatePassword } from './ResetPasswordFields';
import { Link, RouteComponentProps } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants/route';
import { useCallback, useEffect, useState } from 'react';
import APPCONSTANTS from '../../constants/appConstants';
import { info } from '../../utils/toastCenter';
import { useDispatch, useSelector } from 'react-redux';
import { getUserName, resetPassword } from '../../store/user/actions';
import { resetPasswordLoadingSelector } from '../../store/user/selectors';
import Loader from '../../components/loader/Loader';

interface IRouteProps extends RouteComponentProps<{ token: string }> {}
interface IResetPasswordState {
  isTokenValid: boolean;
  token: string;
  isShowPassword: boolean;
  isShowConfirmPassword: boolean;
}

interface IStateProps {
  isPasswordSet: boolean;
  email: string;
}

type Props = IRouteProps & IStateProps;

/**
 * ResetPassword component
 * @param {Props} props - The props
 * @returns {React.ReactElement} The rendered ResetPassword component
 */
const ResetPassword = (props: Props) => {
  const dispatch = useDispatch();
  const isResetPasswordLoading = useSelector(resetPasswordLoadingSelector);

  const [passwordState, setPasswordState] = useState<IResetPasswordState>({
    isTokenValid: false,
    token: '',
    isShowPassword: false,
    isShowConfirmPassword: false
  });

  /**
   * Handles the click event to navigate back to the login page
   */
  const backToLogin = useCallback(() => {
    props.history.push({ pathname: PUBLIC_ROUTES.login });
  }, [props.history]);

  /**
   * Fetches the username based on the token
   */
  const getUsername = useCallback(() => {
    const params = new URLSearchParams(document.location.search);
    const token = params.get('token') || '';
    dispatch(
      getUserName(
        token,
        () => {
          setPasswordState({ ...passwordState, token, isTokenValid: true });
        },
        (e) => {
          info('', APPCONSTANTS.LINK_EXPIRED);
          backToLogin();
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches the username on component mount
   */
  useEffect(() => {
    getUsername();
  }, [getUsername]);

  /**
   * Handles the form submission
   * @param {Object} values - The form values
   */
  const onSubmitForm = (values: any) => {
    if (passwordState.isTokenValid) {
      const password = generatePassword(values.newPassword);
      const { token } = passwordState;
      dispatch(
        resetPassword({
          email: values.email,
          password,
          token,
          successCB: backToLogin
        })
      );
    } else {
      backToLogin();
    }
  };

  /**
   * Destructures the email from props
   */
  const { email } = props;

  /**
   * Renders the ResetPassword component
   * @returns {React.ReactElement} The rendered ResetPassword component
   */
  return isResetPasswordLoading ? (
    <Loader />
  ) : passwordState.isTokenValid ? (
    <div className={styles.loginPage}>
      <div className={styles.loginFormContainer}>
        <div className={`${styles.brand} text-center`}>
          <img src={logo} alt='Medtronics' />
        </div>
        <div className={`primary-title text-center ${styles.loginTitle}`}>Reset your password</div>
        <Form
          onSubmit={onSubmitForm}
          initialValues={{ email }}
          render={({ handleSubmit, form }) => {
            const formState = form.getState();
            return (
              <form onSubmit={handleSubmit}>
                <ResetPasswordFields email={email} adminPasswordChange={false} />
                <button disabled={!formState?.valid} type='submit' className='mt-2 btn primary-btn w-100'>
                  Submit
                </button>
              </form>
            );
          }}
        />
        <div className={styles.backToLoginFooter} onClick={backToLogin}>
          <Link to={PUBLIC_ROUTES.login}>Go to login page</Link>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ResetPassword;
