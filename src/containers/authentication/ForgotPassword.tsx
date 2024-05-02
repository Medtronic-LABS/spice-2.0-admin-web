import { Field, Form } from 'react-final-form';
import logo from '../../assets/images/app-logo.svg';
import styles from './Authentication.module.scss';
import { composeValidators, required, validateEmail } from '../../utils/validation';
import TextInput from '../../components/formFields/TextInput';
import { Link } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../constants/route';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { forgotPasswordRequest } from '../../store/user/actions';

interface IRouteProps {
  history: History;
}

const ForgotPassword = (props: IRouteProps) => {
  const dispatch = useDispatch();

  const backToLogin = () => {
    props.history.push({ pathname: '/' });
  };

  const onSubmitForm = (values: any) => {
    dispatch(forgotPasswordRequest({ email: values.email, successCB: backToLogin }));
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginFormContainer}>
        <div className={`${styles.brand} text-center`}>
          <img src={logo} alt='Medtronics' />
        </div>
        <div className={`primary-title text-center ${styles.loginTitle}`}>Forgot Password</div>
        <Form
          onSubmit={onSubmitForm}
          render={({ handleSubmit }) => (
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
                  />
                )}
              />
              <button type='submit' className='mt-2 btn primary-btn w-100'>
                Submit
              </button>
            </form>
          )}
        />
        <div className={styles.backToLoginFooter}>
          <Link to={PUBLIC_ROUTES.login}>Go to login page</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
