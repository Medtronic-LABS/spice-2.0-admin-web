import React from 'react';
import { convertToCaptilize, convertToLowerCase } from '../../utils/validation';
import styles from './TextInput.module.scss';
import CustomTooltip from '../tooltip';

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isShowLabel?: boolean;
  error?: string;
  toolTipTitle?: string;
  errorLabel?: string;
  helpertext?: React.ReactElement;
  showLoader?: boolean;
  removeErrorContainer?: boolean;
  capitalize?: boolean;
  lowerCase?: boolean;
  onlyAsterisk?: boolean;
}

const TextInput = ({
  label = '',
  isShowLabel = true,
  error = '',
  errorLabel = '',
  helpertext,
  toolTipTitle,
  required = true,
  onlyAsterisk = false,
  showLoader = false,
  removeErrorContainer = false,
  capitalize = false,
  lowerCase = false,
  ...props
}: ITextInputProps) => {
  const InputElement = (
    <input
      onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
        if (capitalize || lowerCase) {
          const start = (event.target as HTMLInputElement).selectionStart as number;
          const end = (event.target as HTMLInputElement).selectionEnd as number;
          (event.target as HTMLInputElement).value = capitalize
            ? convertToCaptilize((event.target as HTMLInputElement).value)
            : convertToLowerCase((event.target as HTMLInputElement).value);
          (event.target as HTMLInputElement).setSelectionRange(start, end);
        }
      }}
      className='input'
      {...props}
      autoComplete='off'
      id={props.name}
      aria-label={props.name}
    />
  );
  return (
    <div className={`${styles.textInput} ${error ? styles.danger : ''}`} data-testid='text-input'>
      {isShowLabel && (
        <>
          <label htmlFor={props.name}>
            {label}
            {(required || onlyAsterisk) && <span className='input-asterisk'>*</span>}
          </label>
          <br />
        </>
      )}
      {toolTipTitle ? <CustomTooltip title={toolTipTitle}>{InputElement}</CustomTooltip> : InputElement}
      {showLoader && (
        <div className={styles.iconContainer}>
          <em className={styles.loader} />
        </div>
      )}
      <div className='d-flex'>
        {!removeErrorContainer && (
          <div className={styles.error}>
            {error} {error && errorLabel}
          </div>
        )}
        {helpertext}
      </div>
    </div>
  );
};

export default TextInput;
