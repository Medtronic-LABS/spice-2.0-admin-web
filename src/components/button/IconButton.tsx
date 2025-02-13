import React from 'react';
import { ReactComponent as EditIcon } from '../../assets/images/edit.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/plus.svg';
import styles from './IconButton.module.scss';

type IElmOrder = 'img' | 'text';
interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isEdit?: boolean;
  customIcon?: any;
  customBtnWidth?: string;
  buttonCustomStyle?: any;
  buttonCustomClass?: any;
  customBtnElmOrder?: IElmOrder[];
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
  customBtnWidth,
  customBtnElmOrder = ['img', 'text'],
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
          className={`${styles.btnImgSpacing}  m-0 m${customBtnElmOrder[0] === 'img' ? 'e' : 's'}-0dot375 order-${
            customBtnElmOrder[0] === 'img' ? '1' : '2'
          } ${buttonCustomClass ? '' : styles.btnImgFilter} ${buttonCustomStyle ? '' : styles.btnImgFilter}`}
          style={{ width: `${customBtnWidth ? customBtnWidth + 'px' : 'auto'}` }}
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
      <span
        style={buttonCustomStyle?.textStyle}
        className={`${styles.btnLabel} ${buttonCustomClass} order-${customBtnElmOrder[0] === 'img' ? '2' : '1'}`}
      >
        {label}
      </span>
    </button>
  );
};

export default IconButton;
