import { render, screen, fireEvent } from '@testing-library/react';
import ModalViewer from '../ModalViewer';

jest.mock('../../../assets/images/close.svg', () => ({
  ReactComponent: 'closeIcon'
}));

describe('ModalViewer', () => {
  const mockHandleCancel = jest.fn();
  const defaultProps = {
    title: 'Test Modal',
    show: true,
    handleCancel: mockHandleCancel
  };

  beforeEach(() => {
    mockHandleCancel.mockClear();
    jest.clearAllMocks();
  });

  it('should not render when show is false', () => {
    render(
      <ModalViewer {...defaultProps} show={false}>
        <div>Modal Content</div>
      </ModalViewer>
    );

    expect(screen.queryByTestId('modal-viewer')).not.toBeInTheDocument();
  });

  it('should render modal with correct title and content', () => {
    render(
      <ModalViewer {...defaultProps}>
        <div>Modal Content</div>
      </ModalViewer>
    );

    expect(screen.getByTestId('modal-viewer')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call handleCancel when close button is clicked', () => {
    render(
      <ModalViewer {...defaultProps}>
        <div>Modal Content</div>
      </ModalViewer>
    );

    const closeButton = screen.getByAltText('close');
    fireEvent.click(closeButton);
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it('should render content inside Form when renderInsideForm is true', () => {
    render(
      <ModalViewer {...defaultProps} renderInsideForm={true} size='modal-lg'>
        <div>
          <button type='submit'>Render form submit</button>
        </div>
      </ModalViewer>
    );

    fireEvent.click(screen.getByText('Render form submit'));
  });
});
