import ModalForm, { IModalSize } from '../modal/ModalForm';

interface IModalPopupTypes {
  isOpen: boolean;
  popupTitle: string;
  cancelText: string;
  submitText: string;
  handleCancel: () => void;
  handleSubmit: () => void;
  popupSize: IModalSize;
  confirmationMessage: string | undefined;
}

const ConfirmationModalPopup = ({
  isOpen,
  popupTitle,
  cancelText = 'Cancel',
  submitText = 'Ok',
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
    >
      <>{confirmationMessage}</>
    </ModalForm>
  );
};

export default ConfirmationModalPopup;
