import ModalForm, { IModalSize } from '../../components/modal/ModalForm';

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
