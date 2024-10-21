import ModalForm, { IModalSize } from '../modal/ModalForm';

interface IModalPopupTypes {
  isOpen: boolean;
  popupTitle: string;
  cancelText: string;
  submitText: string;
  submitTestId?: string;
  handleCancel: () => void;
  handleSubmit: () => void;
  popupSize: IModalSize;
  confirmationMessage: string | undefined;
}

/**
 * ConfirmationModalPopup component for displaying a confirmation dialog
 * @param {IModalPopupTypes} props - The component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.popupTitle - The title of the modal
 * @param {string} props.cancelText - The text for the cancel button
 * @param {string} props.submitText - The text for the submit button
 * @param {string} [props.submitTestId] - The test ID for the submit button
 * @param {() => void} props.handleCancel - Function to handle cancel action
 * @param {() => void} props.handleSubmit - Function to handle submit action
 * @param {IModalSize} props.popupSize - The size of the modal
 * @param {string} [props.confirmationMessage] - The confirmation message to display
 */
const ConfirmationModalPopup = ({
  isOpen,
  popupTitle,
  cancelText = 'Cancel',
  submitText = 'Ok',
  submitTestId,
  handleCancel,
  handleSubmit,
  popupSize = 'modal-md',
  confirmationMessage = ''
}: IModalPopupTypes) => {
  return (
    <ModalForm
      show={isOpen}
      title={popupTitle}
      cancelText={cancelText}
      submitText={submitText}
      handleCancel={handleCancel}
      handleFormSubmit={handleSubmit}
      size={popupSize}
      submitTestId={submitTestId}
    >
      <>{confirmationMessage}</>
    </ModalForm>
  );
};

export default ConfirmationModalPopup;
