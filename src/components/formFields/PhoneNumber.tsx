import { Field, FieldRenderProps } from 'react-final-form';
import { composeValidators, normalizePhone, required, validateMobile } from '../../utils/validation';
import styles from './TextInput.module.scss';
import TextInput from './TextInput';
import { useCallback, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import APPCONSTANTS from '../../constants/appConstants';
import ApiError from '../../global/ApiError';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { IHFUserGet } from '../../store/healthFacility/types';
import { validatePhoneNumber } from '../../services/userAPI';

interface IProps {
  id: number;
  name: string;
  fieldName: string;
  form: FormApi<any>;
  formName: string;
  index: number;
}

const PhoneNumberField = ({ id, name, fieldName, form, formName, index }: IProps) => {
  const submitEnabledStatus = useRef(true);
  const currentphoneNumber = useRef(
    (() => {
      try {
        return form?.getState().values[formName][index].phoneNumber;
      } catch (e) {
        console.error(e);
        return '';
      }
    })()
  );

  const lastCheckedNumber = useRef<string>(currentphoneNumber.current);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [isNetworkError, setNetworkError] = useState(false);
  const alreadyExistError = APPCONSTANTS.PHONE_NUMBER_ALREADY_EXISTS_ERR_MSG;
  const duplicationError = APPCONSTANTS.PHONE_NUMBER_DUPLICATION_ERR_MSG;

  const isValidPhoneNumber = (phoneNumber?: string, checkSameNumberAgain?: boolean) => {
    return (
      phoneNumber && !validateMobile(phoneNumber) && (lastCheckedNumber.current !== phoneNumber || checkSameNumberAgain)
    );
  };

  const validateIfNumberExist = useCallback(
    (number: string) => error ||
      ((validating || !submitEnabledStatus.current) && (lastCheckedNumber.current !== number)
        ? ' ' // blank space is given as error to block submition till number already exist validation is completed
        : ''),
    [error, submitEnabledStatus, validating]
  );

  const validateDuplication = useCallback(
    (value: string) => {
      try {
        if (lastCheckedNumber.current !== value) {
          return '';
        }
        let smallestDuplicateIndex: number = -1;
        const users = form?.getState().values[formName];
        let count = 0;
        users.forEach(({ phoneNumber }: IHFUserGet, i: number) => {
          if (phoneNumber === value) {
            if (smallestDuplicateIndex < 0) {
              smallestDuplicateIndex = i;
            }
            count++;
          }
        });
        return count > 1 && smallestDuplicateIndex !== index ? duplicationError : '';
      } catch (e) {
        console.error(e);
      }
    },
    [form, formName, duplicationError, index]
  );

  const validatePhoneNumberFn = useCallback(
    async (phoneNumber: string, checkSameNumberAgain?: boolean) => {
      try {
        if (!isValidPhoneNumber(phoneNumber, checkSameNumberAgain)) {
          return;
        }
        setValidating(true);
        setLoading(true);
        await validatePhoneNumber(phoneNumber, id).then((res) => {
          submitEnabledStatus.current = true;
          setError('');
          setValidating(false);
          setLoading(false);
          lastCheckedNumber.current = phoneNumber;
          form.change?.(`${name}.phoneNumber`, phoneNumber + ' '); // to trigger onchange space added
          form.change?.(`${name}.phoneNumber`, phoneNumber);
        });
        setNetworkError(false);
      } catch (e: any) {
        setLoading(false);
        if (e instanceof ApiError && e.statusCode === 409) {
          setError(alreadyExistError);
          form.change?.(`${name}.phoneNumber`, phoneNumber + ' '); // to trigger onchange space added
          form.change?.(`${name}.phoneNumber`, phoneNumber);
          lastCheckedNumber.current = phoneNumber;
        } else {
          setNetworkError(true);
          lastCheckedNumber.current = '';
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, ''));
        }
      }
    },
    [id, form, name, alreadyExistError]
  );

  return (
    <Field
      name={`${name}.${fieldName}`}
      type='text'
      validate={composeValidators(required, validateMobile, validateIfNumberExist, validateDuplication)}
      parse={normalizePhone}
      render={({ input, meta }: FieldRenderProps<string>) => {
        return (
          <TextInput
            {...input}
            onBlur={(event) => {
              if (currentphoneNumber.current.length === 0 || lastCheckedNumber.current !== currentphoneNumber.current) {
                input.onBlur(event);
                submitEnabledStatus.current = false;
                validatePhoneNumberFn(input.value);
              }
            }}
            onChange={(event) => {
              submitEnabledStatus.current = false;
              currentphoneNumber.current = event.target.value.trim();
              setNetworkError(false);
              input.onChange(event);
            }}
            lowerCase={true}
            showLoader={loading}
            label='Phone number'
            errorLabel={
              alreadyExistError === meta.error || isNetworkError || !meta.error || meta.error === ' '
                ? ''
                : 'phone number'
            }
            error={
              (isNetworkError ? 'Phone number is not validated.' : meta.touched && (meta.error || '')) || undefined
            }
            helpertext={
              isNetworkError ? (
                <div>
                  <span className={styles.validateErrorText} onClick={() => validatePhoneNumberFn(input.value, true)}>
                    Validate
                  </span>
                </div>
              ) : (
                <></>
              )
            }
          />
        );
      }}
    />
  );
};
export default PhoneNumberField;
