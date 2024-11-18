import React from 'react';
import styles from './Radio.module.scss';

interface IRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorLabel?: string;
  value?: string;
  options: Array<{ value: string | boolean; label: string }>;
  input: { [key: string]: any };
  meta?: { [key: string]: any };
  required?: boolean;
  fieldLabel?: string;
  onChange?: (e: any) => void;
  isRadioSquare?: boolean;
}

const handleChange = (input: any, onChange: (e: any) => void, event: any) => {
  if (input) {
    input.onChange(event);
  }
  if (onChange) {
    onChange(event);
  }
};

const Radio = ({
  options,
  meta,
  input,
  value,
  errorLabel = '',
  required = false,
  fieldLabel,
  onChange,
  isRadioSquare = true
}: IRadioProps) => {
  return (
    <div className={styles.radioInputEnclosure} data-testid='radio-input-enclosure'>
      <div className='input-field-label'>
        {fieldLabel}
        {required && <span className='input-asterisk text-danger'>*</span>}
      </div>
      {isRadioSquare ? (
        <div
          className='btn-group w-100'
          role='group'
          aria-label='Basic radio toggle button group'
          data-testid='radio-button-group'
        >
          {options.map((option: any) => (
            <button
              key={option.value}
              type='button'
              className={`btn ${
                option.value === (input.value || value) ? 'btn-primary' : 'btn-outline-secondary'
              } py-1`}
              value={option.value}
              onClick={() => handleChange(input, onChange as (e: any) => void, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        options.map((option: any) => (
          <label
            key={option.value}
            className={`d-inline-flex align-items-center ${styles.radioContainer}`}
            data-testid='radio-label'
          >
            <div className={`${styles.radioWrapper} me-0dot5`}>
              <input
                {...input}
                type='radio'
                className='d-flex'
                value={option.value}
                checked={option.value === (input?.value || value)}
                onChange={(event) => handleChange(input, onChange as (e: any) => void, event.target.value)}
              />
            </div>
            {option.label}
          </label>
        ))
      )}
      <div className={styles.error}>{meta?.touched && meta.error ? `${meta.error} ${errorLabel}` : ''}</div>
    </div>
  );
};

export default Radio;
