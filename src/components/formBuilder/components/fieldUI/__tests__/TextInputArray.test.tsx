import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TextInputArray from '../TextInputArray';
import { useLocation, matchPath } from 'react-router';

jest.mock('react-router', () => ({
  useLocation: jest.fn(),
  matchPath: jest.fn()
}));

describe('TextInputArray', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/some-path' });
    (matchPath as jest.Mock).mockReturnValue(null);
  });

  it('renders correctly with default props', () => {
    render(<TextInputArray onChange={mockOnChange} />);
    expect(screen.getByTestId('text-input-array')).toBeInTheDocument();
    expect(screen.getByText('Add new')).toBeInTheDocument();
  });

  it('renders with label and required asterisk', () => {
    render(<TextInputArray label='Test Label' required={true} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders initial values correctly', () => {
    const defaultValue = ['Item 1', 'Item 2'];
    render(<TextInputArray defaultValue={defaultValue} />);
    defaultValue.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('handles adding new items', () => {
    render(<TextInputArray onChange={mockOnChange} />);
    const addButton = screen.getByText('Add new');

    fireEvent.click(addButton);
    expect(screen.getAllByRole('listitem')).toHaveLength(2); // 1 empty item + add button
  });

  it('handles deleting items', () => {
    const defaultValue = ['Item 1', 'Item 2'];
    render(<TextInputArray defaultValue={defaultValue} onChange={mockOnChange} />);

    const deleteButtons = screen.getAllByAltText('delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(['Item 2']);
  });

  it('handles text input changes', async () => {
    const defaultValue = ['Initial'];
    render(<TextInputArray defaultValue={defaultValue} onChange={mockOnChange} />);

    const input = screen.getByText('Initial');
    input.innerText = 'Updated';
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(mockOnChange).toHaveBeenCalledWith(['Updated']);
  });

  it('handles empty text input', async () => {
    const defaultValue = ['Initial'];
    render(<TextInputArray defaultValue={defaultValue} onChange={mockOnChange} />);

    const input = screen.getByText('Initial');
    input.innerText = '';
    await waitFor(() => {
      fireEvent.blur(input);
    });

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('disables editing when disabled prop is true', () => {
    const defaultValue = ['Item 1'];
    render(<TextInputArray defaultValue={defaultValue} disabled={true} />);

    expect(screen.queryByAltText('delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Add new')).not.toBeInTheDocument();
  });

  it('handles region customize form view', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/region-customize' });
    (matchPath as jest.Mock).mockReturnValue(true);

    render(<TextInputArray obj={{ readOnly: true }} />);
    expect(screen.getByTestId('text-input-array')).toBeInTheDocument();
  });

  it('render with isRegionCustomizeForm as true and readonly as false inside obj', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/region/:regionId/:tenantId/:form/regionCustomize'
    });
    (matchPath as jest.Mock).mockReturnValue(true);
    render(<TextInputArray obj={{ readOnly: false }} />);
    expect(screen.getByTestId('text-input-array')).toBeInTheDocument();
  });
});
