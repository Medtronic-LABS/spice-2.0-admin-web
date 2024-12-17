import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import React, { useRef } from 'react';
import { FormApi } from 'final-form';
import { resetFields } from '../../utils/commonUtils';

import close from '../../assets/images/close.svg';
import styles from './ModalForm.module.scss';

/** Type for modal size */
export type IModalSize = 'modal-md' | 'modal-lg' | 'modal-xl';

/**
 * Interface for ModalForm props
 */
export interface IModalProps {
  title: string;
  cancelText?: string;
  submitTestId?: string;
  submitText: string;
  submitDisabled?: boolean;
  children?: React.ReactElement;
  show: boolean;
  handleCancel: (val?: boolean) => void;
  deactivateLabel?: string;
  handleForceSubmit?: boolean;
  hideFooterButton?: boolean;
  handleFormSubmit: (values?: any) => void;
  handleDeactivate?: () => void;
  render?: (form?: FormApi<any>, ref?: HTMLDivElement | null) => React.ReactElement;
  mutators?: object;
  initialValues?: object;
  size?: IModalSize;
  isDeactivateModal?: boolean;
  showCloseBtn?: boolean;
}

/**
 * ModalForm component
 * Renders a modal with a form
 * @param {IModalProps} props - Component props
 * @returns {React.ReactElement | null} The rendered ModalForm component or null if not shown
 */
const ModalForm = React.memo(
  ({
    children,
    show,
    handleCancel,
    title,
    cancelText,
    submitText,
    submitTestId,
    submitDisabled = false,
    deactivateLabel,
    handleForceSubmit = false,
    handleFormSubmit,
    handleDeactivate,
    initialValues = {},
    hideFooterButton = false,
    size,
    render,
    mutators,
    showCloseBtn = true
  }: IModalProps): React.ReactElement | null => {
    /** Reference to the modal div */
    const ref = useRef<HTMLDivElement>(null);

    if (!show) {
      return null;
    }

    const isFromCloseBtn = true;

    return ReactDOM.createPortal(
      <div ref={ref} className={`${styles.modal} modal modal-show`} data-testid='modal-form'>
        <div className={`modal-dialog modal-dialog-centered ${size ? size : styles.modalWidth}`}>
          <div className={`modal-content ${styles.modalContent}`}>
            {/* Modal header */}
            <div id='modal-header' className='modal-header py-1 px-1dot25 justify-content-between'>
              <h5 className={`modal-title ${styles.modalTitle}`} data-testid='modal-title'>
                {title}
              </h5>
              {showCloseBtn && (
                <div
                  className={`d-flex justify-content-center align-items-center ${styles.closeIcon}`}
                  onClick={() => handleCancel(isFromCloseBtn)}
                >
                  <img src={close} alt='close' />
                </div>
              )}
            </div>
            {/* Form component */}
            <Form
              onSubmit={(value) => {
                if (!handleForceSubmit) {
                  handleFormSubmit(value);
                }
              }}
              initialValues={initialValues}
              mutators={{
                ...mutators,
                resetFields
              }}
              render={({ handleSubmit, form, values }) => {
                return (
                  <form
                    onSubmit={(val) => {
                      if (!handleForceSubmit) {
                        handleSubmit(val);
                      }
                    }}
                  >
                    {/* Modal body */}
                    <div className={`${styles.scroll} modal-body px-1dot25 py-1dot5`}>
                      {render ? render(form, ref.current) : children}
                    </div>
                    {/* Modal footer */}
                    {!hideFooterButton && (
                      <div className={`modal-footer py-0dot75 px-1dot25`}>
                        {deactivateLabel && (
                          <button
                            type='button'
                            className='btn danger-btn me-auto'
                            data-dismiss='modal'
                            onClick={handleDeactivate}
                          >
                            {deactivateLabel}
                          </button>
                        )}
                        {cancelText && (
                          <button
                            type='button'
                            className='btn secondary-btn me-0dot5'
                            data-dismiss='modal'
                            onClick={() => handleCancel()}
                          >
                            {cancelText}
                          </button>
                        )}
                        <button
                          type='submit'
                          className='btn primary-btn'
                          data-testid={submitTestId}
                          disabled={submitDisabled}
                          onClick={
                            handleForceSubmit
                              ? (e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleFormSubmit(values);
                                }
                              : () => null
                          }
                        >
                          {submitText}
                        </button>
                      </div>
                    )}
                  </form>
                );
              }}
            />
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

export default ModalForm;
