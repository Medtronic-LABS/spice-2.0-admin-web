import React from 'react';
import EditIcon from '../../assets/images/edit.svg';
import PlusIcon from '../../assets/images/plus.svg';
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
        <img
          src={EditIcon}
          className={`${styles.btnImgSpacing} ${buttonCustomClass ? '' : styles.btnImgFilter} ${
            buttonCustomStyle ? '' : styles.btnImgFilter
          }`}
          alt='edit-icon'
        />
      );
    } else {
      return (
        <img
          src={PlusIcon}
          className={`${styles.btnImgSpacing} ${buttonCustomClass ? '' : styles.btnImgFilter} ${
            buttonCustomStyle ? '' : styles.btnImgFilter
          }`}
          alt='plus-icon'
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
    >
      {buttonIconElmt()}
      <span style={buttonCustomStyle?.textStyle} className={styles.btnLabel + ' ' + buttonCustomClass}>
        {label}
      </span>
    </button>
  );
};

export default IconButton;
