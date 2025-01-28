import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTablePaginationHook } from '../tablePagination';

describe('useTablePaginationHook', () => {
  function TestComponent() {
    const { listParams, handleSearch, handlePage } = useTablePaginationHook();

    return (
      <div>
        <div data-testid='page'>{listParams.page}</div>
        <div data-testid='rows-per-page'>{listParams.rowsPerPage}</div>
        <div data-testid='search-term'>{listParams.searchTerm}</div>
        <button onClick={() => handleSearch('example')}>Search</button>
        <button onClick={() => handlePage(2)}>Change Page</button>
      </div>
    );
  }

  it('should initialize with default listParams', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('page')).toHaveTextContent('1');
    expect(screen.getByTestId('rows-per-page')).toHaveTextContent('10');
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
  });

  it('should update listParams when handleSearch is called', async () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByTestId('page')).toHaveTextContent('1');
      expect(screen.getByTestId('rows-per-page')).toHaveTextContent('10');
      expect(screen.getByTestId('search-term')).toHaveTextContent('example');
    });
  });

  it('should update listParams when handlePage is called', async () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByText('Change Page'));

    await waitFor(() => {
      expect(screen.getByTestId('page')).toHaveTextContent('2');
      expect(screen.getByTestId('rows-per-page')).toHaveTextContent('10');
      expect(screen.getByTestId('search-term')).toHaveTextContent('');
    });
  });
});
