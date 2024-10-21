import React from 'react';
import { Field } from 'react-final-form';
import TextInput from '../../../../components/formFields/TextInput';
import { composeValidators, formValidators } from '../../../../utils/validation';
import { InputTypes } from '../../labTestConfig/BaseFieldConfig';

/**
 * Renders the text field wrapper component based on the provided configuration.
 * @param {any} props - The props for the TextFieldWrapper component
 */
const TextFieldWrapper = ({
  name,
  inputProps,
  customParseFn,
  customValue,
  customError,
  newError,
  formError,
  customOnBlurFn,
  customOnChangeFn,
  fieldName,
  register,
  obj,
  onlyAsterisk,
  capitalize = false,
  isCustomErrorWithMeta
}: any) => {
  const parseFn = customParseFn ? customParseFn : (val: any) => val;
  const value = customValue ? customValue : null;
  const onBlurFn = customOnBlurFn ? customOnBlurFn : (val: any) => val;
  const onChangeFn = customOnChangeFn ? customOnChangeFn : (val: any) => val;
  const keyDownFn = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputProps?.type === 'number') {
      const isDefaultPrevent =
        obj?.inputType !== InputTypes.DECIMAL
          ? event.key === '.' || event.key?.toLowerCase() === 'e'
          : event.key?.toLowerCase() === 'e';
      return isDefaultPrevent && event.preventDefault();
    }
  };

  return (
    <Field
      name={name || 'text'}
      parse={parseFn}
      type={inputProps?.type === 'number' || inputProps?.type === 'decimal' ? 'number' : 'text'}
      value={value}
      validate={inputProps?.disabledValidation ? () => null : composeValidators(...formValidators(inputProps || {}))}
    >
      {({ input, meta }) => {
        return (
          <>
            <TextInput
              {...input}
              label={inputProps?.label || 'Label'}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => keyDownFn(event)}
              onBlurCapture={onBlurFn}
              onChangeCapture={onChangeFn}
              error={
                (meta.error && formError && meta.error) ||
                (meta.data?.customError && meta.data?.customError.toString()) ||
                ((isCustomErrorWithMeta ? meta.error : true) && customError && customError.toString()) ||
                (meta.error && inputProps.error && inputProps.error + ' ' + inputProps?.label?.toLowerCase()) ||
                (meta.error &&
                  inputProps.type === 'number' &&
                  'Please enter a valid ' + inputProps?.label?.toLowerCase()) ||
                (meta.error &&
                  meta.error +
                    ' ' +
                    (fieldName?.toLowerCase() === 'interval' && input.value ? '' : inputProps?.label?.toLowerCase()))
              }
              isShowLabel={inputProps?.visible}
              required={inputProps?.required}
              capitalize={capitalize}
              disabled={inputProps?.disabled}
              onlyAsterisk={onlyAsterisk}
            />
          </>
        );
      }}
    </Field>
  );
};

export default TextFieldWrapper;
