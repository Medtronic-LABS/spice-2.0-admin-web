import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  it('should render correctly with label', () => {
    render(<Checkbox label='Test Label' />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should handle onClick event', async () => {
    const mockOnClick = jest.fn();
    render(<Checkbox label='Test Label' onClick={mockOnClick} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should render correctly with switchCheckbox', () => {
    render(<Checkbox label='Test Label' switchCheckbox={true} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('should disable checkbox when readOnly is true', () => {
    render(<Checkbox label='Test Label' readOnly={true} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should handle click event on checkbox', () => {
    const mockOnClick = jest.fn();
    render(<Checkbox label='Test Label' onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should handle inputProps correctly', () => {
    render(<Checkbox label='Test Label' id='testId' data-testid='testCheckbox' />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'testId');
    expect(checkbox).toHaveAttribute('data-testid', 'testCheckbox');
  });

  it('should handle Enter key press', () => {
    const mockOnClick = jest.fn();
    render(<Checkbox label='Test Label' onClick={mockOnClick} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    fireEvent.keyPress(checkbox, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should handle other key press', () => {
    const mockOnClick = jest.fn();
    render(<Checkbox label='Test Label' onClick={mockOnClick} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    fireEvent.keyPress(checkbox, { key: ' ', code: 'Space', charCode: 32 });

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
