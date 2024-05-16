import { Field } from 'react-final-form';
import TextInput from '../../components/formFields/TextInput';
import APPCONSTANTS from '../../constants/appConstants';
import { composeValidators, isEmpty, validatePassword } from '../../utils/validation';
import styles from './Authentication.module.scss';
import ShowPasswordIcon from '../../assets/images/showPass.svg';
import HidePasswordIcon from '../../assets/images/hidePass.svg';
import TickIcon from '../../assets/images/tick.svg';
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import commonPassword from '../../utils/Common_Passwords';
import { sanitize } from 'dompurify';

export const generatePassword = (password: string) => {
  const hmac = CryptoJS.HmacSHA512(password, process.env.REACT_APP_PASSWORD_HASH_KEY as string);
  return hmac.toString(CryptoJS.enc.Hex);
};

export const ResetPasswordFields = ({
  email,
  setSubmitEnabled,
  adminPasswordChange
}: {
  email: string;
  setSubmitEnabled?: any;
  adminPasswordChange: any;
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isShowOldPassword, setShowOldPassword] = useState(false);

  const checkUsername = (password: string) => {
    if (isEmpty(password)) {
      return APPCONSTANTS.ENTER_PASSWORD;
    } else if (email?.split('@')[0] === password) {
      return APPCONSTANTS.PASSWORD_SHOULD_NOT_MATCH_ACC_NAME;
    } else if (commonPassword.includes(password)) {
      return APPCONSTANTS.COMMON_PASSWORDS_ARE_NOT_ALLOWED;
    }
  };

  const setShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!isShowConfirmPassword);
  };

  const toggleOldPassword = () => {
    setShowOldPassword(!isShowOldPassword);
  };

  const validatePasswordMatch = (value: string, allValues: any) => {
    setSubmitEnabled?.(false);
    if (isEmpty(value)) {
      setSubmitEnabled?.(false);
      return APPCONSTANTS.ENTER_CONFIRM_PASSWORD;
    } else if (value !== allValues.newPassword) {
      setSubmitEnabled?.(false);
      return APPCONSTANTS.CONFIRM_PASSWORD_SHOULD_MATCH;
    } else if (value) {
      setSubmitEnabled?.(true);
    }
    return '';
  };

  const validateOldPassword = (value: string) => {
    setSubmitEnabled?.(false);
    if (isEmpty(value)) {
      setSubmitEnabled?.(false);
      return APPCONSTANTS.ENTER_PASSWORD;
    } else if (value) {
      setSubmitEnabled?.(true);
    }
    return '';
  };

  const handleShowPasswordText = () => (isShowPassword ? 'Hide password' : 'Show password');

  const handleShowPasswordIcon = () => (isShowPassword ? HidePasswordIcon : ShowPasswordIcon);

  const handleShowTickIcon = (meta: any) => (
    <img className={`${styles.tickIcon} ${meta.error ? 'invisible' : 'visible'}`} src={TickIcon} alt='tick-icon' />
  );

  const handleIsError = (input: any, meta: any) =>
    input.value ? meta.dirty && meta.error : meta.initial && meta.error;

  return (
    <>
      {adminPasswordChange && (
        <div className={styles.togglePassword}>
          <Field
            name='oldPassword'
            type={isShowOldPassword ? 'text' : 'password'}
            validate={composeValidators(validatePassword, validateOldPassword)}
            parse={(value) => sanitize(value)}
            render={({ input, meta }) => (
              <div>
                <TextInput
                  {...input}
                  placeholder='Enter Old Password'
                  label='Old Password'
                  errorLabel=''
                  error={handleIsError(input, meta)}
                  className={styles.passwordBox}
                />
                {handleShowTickIcon(meta)}
                <img
                  className={styles.eyeIcon}
                  title={isShowOldPassword ? 'Hide password' : 'Show password'}
                  src={isShowOldPassword ? HidePasswordIcon : ShowPasswordIcon}
                  onClick={toggleOldPassword}
                  alt={isShowOldPassword ? 'Hide password' : 'Show password'}
                />
              </div>
            )}
          />
        </div>
      )}
      <div className={styles.togglePassword}>
        <Field
          name='newPassword'
          type={isShowPassword ? 'text' : 'password'}
          validate={composeValidators(validatePassword, checkUsername)}
          parse={(value) => sanitize(value)}
          render={({ input, meta }) => (
            <>
              <TextInput
                {...input}
                label='New Password'
                placeholder='Enter New Password'
                error={handleIsError(input, meta)}
                className={styles.passwordBox}
                toolTipTitle={APPCONSTANTS.PASSWORD_RULE}
              />
              {handleShowTickIcon(meta)}
              <img
                className={styles.eyeIcon}
                title={handleShowPasswordText()}
                src={handleShowPasswordIcon()}
                onClick={setShowPassword}
                alt={handleShowPasswordText()}
              />
            </>
          )}
        />
      </div>
      {!adminPasswordChange && (
        <div className={styles.togglePassword}>
          <Field
            name='confirmPassword'
            type={isShowConfirmPassword ? 'text' : 'password'}
            validate={composeValidators(validatePassword, validatePasswordMatch)}
            parse={(value) => sanitize(value)}
            render={({ input: newIn, meta }) => (
              <div>
                <TextInput
                  {...newIn}
                  placeholder='Re-enter New Password'
                  label='Confirm New Password'
                  errorLabel=''
                  error={handleIsError(newIn, meta)}
                  className={styles.passwordBox}
                />
                {handleShowTickIcon(meta)}
                <img
                  className={styles.eyeIcon}
                  title={isShowConfirmPassword ? 'Hide password' : 'Show password'}
                  src={isShowConfirmPassword ? HidePasswordIcon : ShowPasswordIcon}
                  onClick={toggleShowConfirmPassword}
                  alt={isShowConfirmPassword ? 'Hide password' : 'Show password'}
                />
              </div>
            )}
          />
        </div>
      )}
    </>
  );
};

export default ResetPasswordFields;
