import React from 'react';
import { ReactComponent as EditIcon } from '../../assets/images/edit.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/plus.svg';
import styles from './IconButton.module.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isEdit?: boolean;
  customIcon?: any;
  buttonCustomStyle?: any;
  buttonCustomClass?: any;
  handleClick: () => void;
}

/**
 * A compoent for button with icon
 * @param param
 * @returns React.ReactElement
 */
const IconButton = ({
  label,
  disabled = false,
  isEdit,
  customIcon,
  type = 'button',
  buttonCustomStyle = {},
  buttonCustomClass = '',
  handleClick,
  ..._props
}: IProps): React.ReactElement => {
  const buttonIconElmt = () => {
    if (customIcon) {
      return (
        <img
          src={customIcon}
          className={`${styles.btnImgSpacing} ${buttonCustomClass ? '' : styles.btnImgFilter} ${
            buttonCustomStyle ? '' : styles.btnImgFilter
          }`}
          alt='custom-icon'
        />
      );
    } else if (isEdit) {
      return (
        <EditIcon
          className={`${styles.btnImgSpacing} ${buttonCustomClass ? '' : styles.btnImgFilter} ${
            buttonCustomStyle ? '' : styles.btnImgFilter
          }`}
          aria-labelledby='edit-icon'
          aria-label='edit-icon'
        />
      );
    } else {
      return (
        <PlusIcon
          className={`${styles.btnImgSpacing} ${buttonCustomClass ? '' : styles.btnImgFilter} ${
            buttonCustomStyle ? '' : styles.btnImgFilter
          }`}
          aria-labelledby='plus-icon'
          aria-label='plus-icon'
        />
      );
    }
  };
  return (
    <button
      type={type}
      disabled={disabled}
      style={buttonCustomStyle?.iconStyle}
      className={`btn primary-btn ${styles.iconButton} ${buttonCustomClass}`}
      onClick={handleClick}
      data-testid='detail-card-button'
    >
      {buttonIconElmt()}
      <span style={buttonCustomStyle?.textStyle} className={styles.btnLabel + ' ' + buttonCustomClass}>
        {label}
      </span>
    </button>
  );
};

export default IconButton;
