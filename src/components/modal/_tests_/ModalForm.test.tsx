import { render, screen, fireEvent } from '@testing-library/react';
import ModalForm, { IModalProps } from '../ModalForm';

describe('<ModalForm />', () => {
  let props: IModalProps;

  beforeEach(() => {
    props = {
      title: 'Test Modal',
      show: true,
      handleCancel: jest.fn(),
      submitText: 'Submit',
      handleFormSubmit: jest.fn()
    };
  });

  it('renders without crashing', () => {
    render(<ModalForm {...props} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', () => {
    render(<ModalForm {...props} cancelText='Cancel' />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(props.handleCancel).toHaveBeenCalled();
  });

  it(`should call handleFormSubmit with handleForceSubmitprop true
    when submit button is clicked`, () => {
    render(<ModalForm {...props} handleForceSubmit={true} />);
    fireEvent.click(screen.getByText('Submit'));
    expect(props.handleFormSubmit).toHaveBeenCalled();
  });

  it(`should call handleFormSubmit with handleForceSubmit prop false
    when submit button is clicked`, () => {
    render(<ModalForm {...props} handleForceSubmit={false} />);
    fireEvent.click(screen.getByText('Submit'));
    expect(props.handleFormSubmit).toHaveBeenCalled();
  });

  it('should show deactivate button if deactivateLabel prop is provided', () => {
    render(<ModalForm {...props} deactivateLabel='Deactivate' />);
    expect(screen.getByText('Deactivate')).toBeInTheDocument();
  });

  it('should disable submit button when submitDisabled prop is true', () => {
    render(<ModalForm {...props} submitDisabled={true} />);
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('should call handleFormSubmit on submit button click when handleForceSubmit prop is true', () => {
    render(<ModalForm {...props} handleForceSubmit={true} />);
    fireEvent.click(screen.getByText('Submit'));
    expect(props.handleFormSubmit).toHaveBeenCalled();
  });

  it('calls handleFormSubmit when form is submitted and handleForceSubmit is false', () => {
    const mockHandleFormSubmit = jest.fn();
    render(
      <ModalForm
        show={true}
        // tslint:disable-next-line:no-empty
        handleCancel={() => {}}
        title='Test Modal'
        handleFormSubmit={mockHandleFormSubmit}
        handleForceSubmit={false}
        submitText='Submit'
      />
    );
    const submitBtn = screen.getByText('Submit');
    fireEvent.click(submitBtn);
    expect(mockHandleFormSubmit).toHaveBeenCalled();
  });

  it('should render with the correct title', () => {
    render(<ModalForm {...props} title='Test Title' />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render with the correct cancel text', () => {
    render(<ModalForm {...props} cancelText='Cancel' />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render with the correct submit text', () => {
    render(<ModalForm {...props} submitText='Submit' />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(<ModalForm {...props} show={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('handle cancel button click', () => {
    render(<ModalForm {...props} />);
    const closeBtn = screen.getByAltText('close');
    fireEvent.click(closeBtn);
    expect(props.handleCancel).toHaveBeenCalled();
  });
});
