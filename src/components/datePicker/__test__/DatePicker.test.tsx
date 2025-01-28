import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DatePickerComponent from '../DatePicker';

jest.mock('../../assets/images/calendar-icon.svg', () => ({
  ReactComponent: () => <svg data-testid='calendar-icon' />
}));

describe('DatePickerComponent', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Test Date',
    isShowLabel: true,
    onChange: mockOnChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label when isShowLabel is true', () => {
    const { unmount } = render(<DatePickerComponent {...defaultProps} />);
    expect(screen.getByText('Test Date')).toBeInTheDocument();
    unmount();
  });

  it('does not render label when isShowLabel is false', () => {
    const { unmount } = render(<DatePickerComponent {...defaultProps} isShowLabel={false} />);
    expect(screen.queryByText('Test Date')).not.toBeInTheDocument();
    unmount();
  });

  it('shows required asterisk when required prop is true', () => {
    const { unmount } = render(<DatePickerComponent {...defaultProps} required={true} />);
    expect(screen.getByText('*')).toBeInTheDocument();
    unmount();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This is an error';
    const errorLabel = 'Error Label';
    const { unmount } = render(<DatePickerComponent {...defaultProps} error={errorMessage} errorLabel={errorLabel} />);
    expect(screen.getByText(`${errorMessage} ${errorLabel}`)).toBeInTheDocument();
    unmount();
  });

  it('renders calendar icon', () => {
    const { unmount } = render(<DatePickerComponent label={'Test Date'} onChange={mockOnChange} todayButton={true} />);
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    unmount();
  });

  it('shows calendar when icon is clicked', () => {
    const { unmount } = render(<DatePickerComponent {...defaultProps} />);
    const calendarIcon = screen.getByTestId('calendar-icon');
    fireEvent.click(calendarIcon);
    unmount();
  });

  it('initializes with provided date value', () => {
    const initialDate = '2024-03-15';
    const { unmount } = render(<DatePickerComponent {...defaultProps} value={initialDate} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('15/03/2024');
    unmount();
  });

  it('handles date selection correctly', () => {
    const { unmount } = render(<DatePickerComponent {...defaultProps} />);
    const dateInput = screen.getByRole('textbox');

    const newDate = '15/03/2024';
    fireEvent.change(dateInput, { target: { value: newDate } });

    expect(dateInput).toHaveValue(newDate);

    expect(mockOnChange).toHaveBeenCalled();
    unmount();
  });

  it('calls onChange callback when a new date is selected', async () => {
    const onChangeMock = jest.fn();
    const { unmount } = render(
      <DatePickerComponent label='Test Date Picker' isShowLabel={true} onChange={onChangeMock} />
    );

    const iconButton = screen.getByTestId('calendar-icon');
    fireEvent.click(iconButton);

    const dateInput = screen.getByRole('textbox');
    fireEvent.change(dateInput, { target: { value: '15/11/2024' } });

    // Ensure that the selected date changes
    await waitFor(() => {
      const updatedDate = (dateInput as HTMLInputElement).value;
      expect(updatedDate).toBe('15/11/2024');
    });
    unmount();
  });

  it('renders custom header with all controls and handles interactions with onChange', async () => {
    const { unmount, container } = render(<DatePickerComponent {...defaultProps} />);

    fireEvent.click(screen.getByRole('textbox'));

    expect(screen.getByRole('button', { name: '<' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
    expect(container.getElementsByClassName('monthSelect')[0]).toBeInTheDocument();
    expect(container.getElementsByClassName('yearSelect')[0]).toBeInTheDocument();

    const prevMonthBtn = screen.getByRole('button', { name: '<' });
    const nextMonthBtn = screen.getByRole('button', { name: '>' });

    fireEvent.click(prevMonthBtn);
    fireEvent.click(nextMonthBtn);

    const yearSelect = container.getElementsByClassName('yearSelect')[0];
    fireEvent.change(yearSelect, { target: { value: '2023' } });
    expect(yearSelect).toHaveValue('2023');

    const monthSelect = container.getElementsByClassName('monthSelect')[0];
    fireEvent.change(monthSelect, { target: { value: 'March' } });
    expect(monthSelect).toHaveValue('March');

    const mockStopPropagation = jest.fn();
    const mockPreventDefault = jest.fn();

    fireEvent.click(prevMonthBtn, {
      stopPropagation: mockStopPropagation,
      preventDefault: mockPreventDefault
    });

    unmount();
  });

  it('renders custom header with all controls and handles interactions without onChange', async () => {
    const { unmount, container } = render(<DatePickerComponent label={'Test Date'} isShowLabel={true} />);

    fireEvent.click(screen.getByRole('textbox'));

    expect(screen.getByRole('button', { name: '<' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
    expect(container.getElementsByClassName('monthSelect')[0]).toBeInTheDocument();
    expect(container.getElementsByClassName('yearSelect')[0]).toBeInTheDocument();

    const prevMonthBtn = screen.getByRole('button', { name: '<' });
    const nextMonthBtn = screen.getByRole('button', { name: '>' });

    fireEvent.click(prevMonthBtn);
    fireEvent.click(nextMonthBtn);

    const yearSelect = container.getElementsByClassName('yearSelect')[0];
    fireEvent.change(yearSelect, { target: { value: '2023' } });
    expect(yearSelect).toHaveValue('2023');

    const monthSelect = container.getElementsByClassName('monthSelect')[0];
    fireEvent.change(monthSelect, { target: { value: 'March' } });
    expect(monthSelect).toHaveValue('March');

    const mockStopPropagation = jest.fn();
    const mockPreventDefault = jest.fn();

    fireEvent.click(prevMonthBtn, {
      stopPropagation: mockStopPropagation,
      preventDefault: mockPreventDefault
    });

    unmount();
  });

  it('handles null date in selection', () => {
    const { unmount } = render(<DatePickerComponent {...defaultProps} />);
    const dateInput = screen.getByRole('textbox');
    fireEvent.change(dateInput, {
      target: { value: '15/03/2024' }
    });
    fireEvent.change(dateInput, {
      target: { value: '' }
    });
    expect(dateInput).toHaveValue('');
    unmount();
  });

  it('handles direct date selection through calendar', async () => {
    const { unmount } = render(<DatePickerComponent label={'Test Date'} isShowLabel={true} />);
    fireEvent.click(screen.getByRole('textbox'));
    const options = screen.getAllByRole('option');
    const lastOption = options[options.length - 1];
    fireEvent.click(lastOption);
    unmount();
  });
});
