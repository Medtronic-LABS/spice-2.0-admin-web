import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Searchbar from '../Searchbar';

describe('Searchbar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockOnSearch = jest.fn();

  it('renders correctly with default props', () => {
    render(<Searchbar onSearch={mockOnSearch} />);

    const searchInput = screen.getByTestId('table-search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search');
    expect(searchInput).toHaveValue('');
  });

  it('renders with custom placeholder', () => {
    render(<Searchbar onSearch={mockOnSearch} placeholder='Custom search' isOutlined={false} />);

    const searchInput = screen.getByTestId('table-search-input');
    expect(searchInput).toHaveAttribute('placeholder', 'Custom search');
  });

  it('updates input value on change', () => {
    render(<Searchbar onSearch={mockOnSearch} />);

    const searchInput = screen.getByTestId('table-search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(searchInput).toHaveValue('test search');
  });

  it('debounces search callback', async () => {
    render(<Searchbar onSearch={mockOnSearch} />);

    const searchInput = screen.getByTestId('table-search-input');

    fireEvent.change(searchInput, { target: { value: 't' } });
    fireEvent.change(searchInput, { target: { value: 'te' } });
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('clears previous timeout on new input', async () => {
    render(<Searchbar onSearch={mockOnSearch} />);

    const searchInput = screen.getByTestId('table-search-input');

    fireEvent.change(searchInput, { target: { value: 'test' } });

    jest.advanceTimersByTime(200);

    fireEvent.change(searchInput, { target: { value: 'new test' } });

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('new test');
    });
  });
});
