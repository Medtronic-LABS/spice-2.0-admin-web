import { render, screen } from '@testing-library/react';
import ConfirmationModalPopup from '../ConfirmationModalPopup';

jest.mock('../../modal/ModalForm', () => () => <div data-testid='modal-form'>Modal Form</div>);

const props: any = {
  isOpen: true,
  handleCancel: jest.fn(),
  handleSubmit: jest.fn()
};

describe('ConfirmationModalPopup', () => {
  it('renders without crashing', () => {
    render(
      <ConfirmationModalPopup
        {...props}
        popupSize='modal-md'
        cancelText='Cancel'
        submitText='Ok'
        confirmationMessage='Are you sure?'
      />
    );
    expect(screen.getByTestId('modal-form')).toBeInTheDocument();
  });
  it('render with default props values', () => {
    render(<ConfirmationModalPopup {...props} />);
    expect(screen.getByTestId('modal-form')).toBeInTheDocument();
  });
});
