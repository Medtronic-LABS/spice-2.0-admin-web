import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DragDropFiles from '../DragDropFiles';
import toastCenter from '../../../utils/toastCenter';

jest.mock('../../../assets/images/upload_blue.svg', () => ({
  ReactComponent: () => <svg data-testid='upload-icon' />
}));
jest.mock('../../../utils/toastCenter', () => ({
  error: jest.fn()
}));
// Mock function for onUploadSubmit prop
const mockOnUploadSubmit = jest.fn();

describe('DragDropFiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { unmount, getByTestId } = render(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);
    expect(getByTestId('dragDropMainDiv')).toBeInTheDocument();
    unmount();
  });

  it('should call handleDragOver on drag over', () => {
    const event = { preventDefault: jest.fn() };
    const { unmount, getByTestId } = render(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);

    // Fire the dragover event on the main div
    fireEvent.dragOver(getByTestId('dragDropMainDiv'), event);

    waitFor(() => {
      expect(event.preventDefault).toHaveBeenCalled();
    });
    unmount();
  });

  it('should call handleDrop on drop with valid file type', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const event = { preventDefault: jest.fn(), dataTransfer: { files: [file] } };

    const { unmount, getByTestId } = render(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);
    // Simulate drop event
    waitFor(() => {
      fireEvent.drop(getByTestId('dragDropMainDiv'), event);
    });

    // Check if the file name is shown in the file details label
    expect(screen.getByText(file.name)).toBeInTheDocument();
    unmount();
  });

  it('should not set file state on drop with invalid file type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { preventDefault: jest.fn(), dataTransfer: { files: [file] } };

    const { unmount, getByTestId } = render(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);
    // Simulate drop event
    waitFor(() => {
      fireEvent.drop(getByTestId('dragDropMainDiv'), event);
    });

    // Verify that file detail label does not exist for invalid file type
    const fileLabel = screen.queryByText(file.name);
    expect(fileLabel).not.toBeInTheDocument();
    unmount();
  });

  it('should call onUploadSubmit prop with file when upload button is clicked', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const { unmount, getByLabelText } = render(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);
    // Simulate file input change event
    waitFor(() => {
      fireEvent.change(getByLabelText(/file upload/i), {
        target: { files: [file] }
      });
    });

    // Simulate button click event
    waitFor(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    // Check if the onUploadSubmit mock function was called with the file
    waitFor(() => {
      expect(mockOnUploadSubmit).toHaveBeenCalledWith(file);
    });
    unmount();
  });
  it('should show error toast when invalid file is uploaded', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { preventDefault: jest.fn(), target: { files: [file] } };

    const { unmount, container } = render(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);

    // Simulate file input change event
    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, event);

    // Verify that error toast was called
    expect(toastCenter.error).toHaveBeenCalledWith('Error', 'Please upload a valid file');

    unmount();
  });

  it('should show handle when valid file is uploaded', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const event = { preventDefault: jest.fn(), target: { files: [file] } };

    const { unmount, container, getByLabelText, getByText } = render(
      <DragDropFiles onUploadSubmit={mockOnUploadSubmit} />
    );

    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, event);
    waitFor(() => {
      expect(getByLabelText(file.name)).toBeInTheDocument();
    });
    expect(getByText('Upload')).toBeInTheDocument();
    fireEvent.click(getByText('Upload'));
    waitFor(() => {
      expect(mockOnUploadSubmit).toHaveBeenCalledWith(file);
    });

    unmount();
  });
});
