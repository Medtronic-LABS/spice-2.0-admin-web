import styles from './Authentication.module.scss';
import logo from '../../assets/images/app-logo.svg';
import { Form } from 'react-final-form';
import ResetPasswordFields from './ResetPasswordFields';
import { Link, RouteComponentProps } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants/route';
import { useCallback, useEffect, useState } from 'react';
import APPCONSTANTS from '../../constants/appConstants';
import { info } from '../../utils/toastCenter';

interface IRouteProps extends RouteComponentProps<{ token: string }> {}
interface IResetPasswordState {
  isResetPassword: boolean;
  token: string;
  isShowPassword: boolean;
  isShowConfirmPassword: boolean;
}

interface IStateProps {
  isPasswordSet: boolean;
  email: string;
}

type Props = IRouteProps & IStateProps;

const ResetPassword = (props: Props) => {
  // const dispatch = useDispatch();
  const [passwordState, setPasswordState] = useState<IResetPasswordState>({
    isResetPassword: false,
    token: '',
    isShowPassword: false,
    isShowConfirmPassword: false
  });

  const backToLogin = useCallback(() => {
    props.history.push({ pathname: PUBLIC_ROUTES.login });
  }, [props.history]);

  const getUsername = useCallback(() => {
    const { token } = props.match.params;
    setPasswordState({ ...passwordState, token });
    // this.props.getUserName({ token, successCB: this.showToast });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params]);

  useEffect(() => {
    const url = props.history.location.search;
    const params = new URLSearchParams(url);
    const isResetPassword = Boolean(params.get('reset_password'));
    setPasswordState({ ...passwordState, isResetPassword });
    let canRequest: boolean = true;
    if (isResetPassword) {
      const expiresValue = params.get('expires');
      const expiresTime = Number(expiresValue);
      if (expiresTime < new Date().getTime()) {
        canRequest = false;
        info('', APPCONSTANTS.LINK_EXPIRED);
        backToLogin();
      }
    }
    if (canRequest) {
      getUsername();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backToLogin, getUsername, props.history.location.search]);

  const onSubmitForm = (values: any) => {
    // const postEmail = values.email;
    // const password = generatePassword(values.newPassword);
    // const { token, isResetPassword } = passwordState;
    // if (isResetPassword) {
    // dispatch(
    //   resetPassword({
    //     email:postEmail,
    //     password,
    //     token,
    //     successCB: backToLogin
    //   })
    // );
    // } else {
    // dispatch(
    //   createPassword({
    //     email:postEmail,
    //     password,
    //     token,
    //     successCB: backToLogin
    //   })
    // );
    // }
  };

  const { email } = props;

  return (
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
  );
};

export default ResetPassword;
