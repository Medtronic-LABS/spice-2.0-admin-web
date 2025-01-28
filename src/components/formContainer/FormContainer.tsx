import React from 'react';

import styles from './FormContainer.module.scss';

interface IFormWrapperProps {
  label: string;
  icon?: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps the children in a box with labelled header
 * @param props - Props for the FormContainer component.
 * @returns React.ReactElement
 */
const FormContainer = ({ label, icon, children, required = false }: IFormWrapperProps): React.ReactElement => {
  return (
    <div className={styles.box}>
      <header className={`lh-3dot375 px-1dot375 d-flex align-items-center primary-title ${styles.header}`}>
        {icon ? <img src={icon} alt='' className={`${styles.headerIcon} me-0dot625`} /> : null}
        <b>{label}</b>
        {required && (
          <span className='input-asterisk'>
            <b>*</b>
          </span>
        )}
      </header>
      <div className={`px-1dot25 py-1dot5 ${styles.formBody}`}>{children}</div>
    </div>
  );
};

export default FormContainer;
