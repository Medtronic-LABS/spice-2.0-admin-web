import React, { useCallback, useRef } from 'react';
import styles from './Checkbox.module.scss';

interface ICheckboxProps {
  label?: string;
  switchCheckbox?: boolean;
  readOnly?: boolean;
  size?: 'small' | 'default';
  name?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Checkbox = ({
  label,
  readOnly,
  switchCheckbox,
  size = 'default',
  ...inputProps
}: ICheckboxProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Enter') {
      checkboxRef.current?.click();
    }
  }, []);

  return (
    <label
      className={`d-inline-flex align-items-center ${styles.checkboxLabel} ${switchCheckbox && ' h-100'} ${
        switchCheckbox && styles.clSwitch
      } ${readOnly ? styles.disabled : ''} ${size === 'small' ? styles.small : ''}`}
      data-testid='checkbox'
    >
      <div className={`${switchCheckbox && 'd-inline-flex align-items-center'}`}>
        {label && switchCheckbox && <span className={styles.checkboxLabelText}>{label}</span>}
        <div className={switchCheckbox ? '' : styles.checkboxWrapper}>
          <input
            type='checkbox'
            name={inputProps.name || label}
            {...inputProps}
            className={`${switchCheckbox ? '' : styles.checkbox} `}
            ref={checkboxRef}
            onKeyDown={handleKeyDown}
          />
          {switchCheckbox && <span className={styles.switcher} />}
        </div>
        {!switchCheckbox && <span>{label}</span>}
      </div>
    </label>
  );
};

export default Checkbox;
