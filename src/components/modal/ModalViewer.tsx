import ReactDOM from 'react-dom';
import React from 'react';

import close from '../../assets/images/close.svg';

import styles from './ModalForm.module.scss';
import { Form } from 'react-final-form';

interface IModalProps {
  title: string;
  children?: React.ReactElement;
  show: boolean;
  handleCancel: () => void;
  deactivateLabel?: string;
  size?: 'modal-md' | 'modal-lg';
  renderInsideForm?: boolean;
}

/**
 * ModalViewer component
 * Renders a modal for viewing content
 * @param {IModalProps} props - Component props
 * @returns {React.ReactElement | null} The rendered ModalViewer component or null if not shown
 */
const ModalViewer = React.memo(
  ({ children, show, handleCancel, title, size, renderInsideForm = false }: IModalProps) => {
    if (!show) {
      return null;
    }
    return ReactDOM.createPortal(
      <div className={`${styles.modal} modal modal-show`} data-testid='modal-viewer'>
        <div className={`modal-dialog modal-dialog-centered ${size ? size : styles.modalWidth}`}>
          <div className={`modal-content ${styles.modalContent}`}>
            <div className='modal-header py-1 px-1dot25 justify-content-between'>
              <h5 className={`modal-title ${styles.modalTitle}`}>{title}</h5>
              <div
                className={`d-flex justify-content-center align-items-center ${styles.closeIcon}`}
                onClick={handleCancel}
              >
                <img src={close} alt='close' />
              </div>
            </div>
            {/* wrapping inside Form to handle childcomponents to use useForm hook. see selectInput.tsx */}
            {/* tslint:disable-next-line:no-empty */}
            {renderInsideForm ? <Form onSubmit={() => {}} render={() => children} /> : children}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);
export default ModalViewer;
