import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableFilter from '../Filter';

jest.mock('../../../assets/images/filter-icon.svg', () => ({
  ReactComponent: 'FilterIcon'
}));

describe('TableFilter Component', () => {
  const mockSetSelectedRole = jest.fn();
  const mockSetSelectedFacility = jest.fn();

  const defaultProps = {
    filterData: {
      isShow: true,
      name: 'Test Filter',
      isSearchable: true,
      data: [
        { id: 1, name: 'Option 1', tenantId: 'tenant1', organizations: [{ name: 'Org 1' }] },
        { id: 2, name: 'Option 2', tenantId: 'tenant2', organizations: [{ name: 'Org 2' }] }
      ]
    },
    isFacility: false,
    setSelectedRole: mockSetSelectedRole,
    setSelectedFacility: mockSetSelectedFacility,
    filterCount: 2
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when isShow is true', () => {
    render(<TableFilter {...defaultProps} />);
    expect(screen.getByText('Test Filter')).toBeInTheDocument();
  });

  it('does not render when isShow is false', () => {
    render(<TableFilter {...{ ...defaultProps, filterData: { ...defaultProps.filterData, isShow: false } }} />);
    expect(screen.queryByText('Test Filter')).not.toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<TableFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Filter'));
    expect(screen.getByPlaceholderText('Search Facility')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<TableFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Filter'));

    const searchInput = screen.getByPlaceholderText('Search Facility');
    fireEvent.input(searchInput, { target: { value: 'Option 1' } });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText('Org 1')).toBeInTheDocument();
      expect(screen.queryByText('Org 2')).not.toBeInTheDocument();
    });
  });

  it('handles select all for roles', async () => {
    render(<TableFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Filter'));

    const selectAllCheckbox = screen.getByLabelText('Select all');
    fireEvent.click(selectAllCheckbox);
    jest.advanceTimersByTime(300);

    expect(mockSetSelectedRole).toHaveBeenCalled();

    fireEvent.click(selectAllCheckbox);
    jest.advanceTimersByTime(300);
    expect(mockSetSelectedRole).toHaveBeenCalledWith(expect.any(Function));
  });

  it('handles select all for roles with multiple options', async () => {
    const multipleOptionsProps = {
      ...defaultProps,
      isFacility: false,
      setSelectedRole: mockSetSelectedRole,
      filterData: {
        ...defaultProps.filterData,
        data: [
          { id: 1, name: 'Option 1', tenantId: 'tenant1', organizations: [{ name: 'Org 1' }] },
          { id: 2, name: 'Option 2', tenantId: 'tenant2', organizations: [{ name: 'Org 2' }] },
          { id: 3, name: 'Option 3', tenantId: 'tenant3', organizations: [{ name: 'Org 3' }] }
        ]
      }
    };

    render(<TableFilter {...multipleOptionsProps} />);

    fireEvent.click(screen.getByText('Test Filter'));
    const selectAllCheckbox = screen.getByLabelText('Select all');
    fireEvent.click(selectAllCheckbox);

    expect(mockSetSelectedRole).toHaveBeenCalled();
    const selectAllCallback = mockSetSelectedRole.mock.calls[0][0];
    const result = selectAllCallback([]);
    expect(result).toEqual(['Option 1', 'Option 2', 'Option 3']);
  });

  it('handles select all for facilities', async () => {
    render(<TableFilter {...{ ...defaultProps, isFacility: true }} />);
    fireEvent.click(screen.getByText('Test Filter'));

    const selectAllCheckbox = screen.getByLabelText('Select all');
    fireEvent.click(selectAllCheckbox);
    jest.advanceTimersByTime(300);

    expect(mockSetSelectedFacility).toHaveBeenCalled();

    fireEvent.click(selectAllCheckbox);
    jest.advanceTimersByTime(300);
    expect(mockSetSelectedFacility).toHaveBeenCalledWith(expect.any(Function));
  });

  it('handles select all for facilities with multiple options', async () => {
    const multipleOptionsProps = {
      ...defaultProps,
      isFacility: true,
      setSelectedFacility: mockSetSelectedFacility,
      filterData: {
        ...defaultProps.filterData,
        data: [
          { id: 1, name: 'Option 1', tenantId: 'tenant1', organizations: [{ name: 'Org 1' }] },
          { id: 2, name: 'Option 2', tenantId: 'tenant2', organizations: [{ name: 'Org 2' }] },
          { id: 3, name: 'Option 3', tenantId: 'tenant3', organizations: [{ name: 'Org 3' }] }
        ]
      }
    };

    render(<TableFilter {...multipleOptionsProps} />);

    fireEvent.click(screen.getByText('Test Filter'));
    const selectAllCheckbox = screen.getByLabelText('Select all');
    fireEvent.click(selectAllCheckbox);

    expect(mockSetSelectedFacility).toHaveBeenCalled();
    const selectAllCallback = mockSetSelectedFacility.mock.calls[0][0];
    const result = selectAllCallback([]);
    expect(result).toEqual(['tenant1', 'tenant2', 'tenant3']);
  });

  it('handles individual selection for roles', () => {
    render(<TableFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Filter'));

    const option1Checkbox = screen.getByLabelText('Org 1');
    fireEvent.click(option1Checkbox);

    expect(mockSetSelectedRole).toHaveBeenCalled();
  });

  it('handles individual selection for facilities', () => {
    render(<TableFilter {...{ ...defaultProps, isFacility: true }} />);
    fireEvent.click(screen.getByText('Test Filter'));

    const option1Checkbox = screen.getByLabelText('Option 1 Org 1');
    fireEvent.click(option1Checkbox);

    expect(mockSetSelectedFacility).toHaveBeenCalled();
  });

  it('closes dropdown when clicking outside', () => {
    render(<TableFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Filter'));

    expect(screen.getByPlaceholderText('Search Facility')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByPlaceholderText('Search Facility')).not.toBeInTheDocument();
  });

  it('displays no results message when search has no matches', async () => {
    render(<TableFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Filter'));

    const searchInput = screen.getByPlaceholderText('Search Facility');
    await userEvent.type(searchInput, 'No Match');

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('handles adding and removing facility tenant IDs', async () => {
    render(
      <TableFilter
        {...{
          ...defaultProps,
          isFacility: true,
          setSelectedFacility: mockSetSelectedFacility
        }}
      />
    );
    fireEvent.click(screen.getByText('Test Filter'));
    const option1Checkbox = screen.getByLabelText('Option 1 Org 1');
    fireEvent.click(option1Checkbox);

    expect(mockSetSelectedFacility).toHaveBeenLastCalledWith(expect.any(Function));

    const addCallback = mockSetSelectedFacility.mock.calls[0][0];
    const resultAdd = addCallback([]);
    expect(resultAdd).toEqual(['tenant1']);

    fireEvent.click(option1Checkbox);

    expect(mockSetSelectedFacility).toHaveBeenLastCalledWith(expect.any(Function));
    const removeCallback = mockSetSelectedFacility.mock.calls[1][0];
    const resultRemove = removeCallback(['tenant1']);
    expect(resultRemove).toEqual([]);
  });

  it('handles adding and removing role names', async () => {
    render(
      <TableFilter
        {...{
          ...defaultProps,
          isFacility: false,
          setSelectedRole: mockSetSelectedRole
        }}
      />
    );
    fireEvent.click(screen.getByText('Test Filter'));
    const option1Checkbox = screen.getByLabelText('Org 1');
    fireEvent.click(option1Checkbox);

    expect(mockSetSelectedRole).toHaveBeenLastCalledWith(expect.any(Function));

    const addCallback = mockSetSelectedRole.mock.calls[0][0];
    const resultAdd = addCallback([]);
    expect(resultAdd).toEqual(['Option 1']);

    fireEvent.click(option1Checkbox);

    expect(mockSetSelectedRole).toHaveBeenLastCalledWith(expect.any(Function));
    const removeCallback = mockSetSelectedRole.mock.calls[1][0];
    const resultRemove = removeCallback(['Option 1']);
    expect(resultRemove).toEqual([]);
  });

  it('automatically selects "Select all" when all options are individually selected', () => {
    const props = {
      ...defaultProps,
      isFacility: false,
      setSelectedRole: mockSetSelectedRole,
      filterData: {
        ...defaultProps.filterData,
        data: [
          { id: 1, name: 'Option 1', tenantId: 'tenant1', organizations: [{ name: 'Org 1' }] },
          { id: 2, name: 'Option 2', tenantId: 'tenant2', organizations: [{ name: 'Org 2' }] }
        ]
      }
    };

    render(<TableFilter {...props} />);
    fireEvent.click(screen.getByText('Test Filter'));

    fireEvent.click(screen.getByLabelText('Org 1'));
    fireEvent.click(screen.getByLabelText('Org 2'));

    const selectAllCheckbox = screen.getByLabelText('Select all') as HTMLInputElement;
    expect(selectAllCheckbox.checked).toBe(true);
  });

  it('automatically unselects "Select all" when any option is unselected', () => {
    const props = {
      ...defaultProps,
      isFacility: false,
      setSelectedRole: mockSetSelectedRole,
      filterData: {
        ...defaultProps.filterData,
        data: [
          { id: 1, name: 'Option 1', tenantId: 'tenant1', organizations: [{ name: 'Org 1' }] },
          { id: 2, name: 'Option 2', tenantId: 'tenant2', organizations: [{ name: 'Org 2' }] }
        ]
      }
    };

    render(<TableFilter {...props} />);
    fireEvent.click(screen.getByText('Test Filter'));

    fireEvent.click(screen.getByLabelText('Select all'));

    fireEvent.click(screen.getByLabelText('Org 1'));

    const selectAllCheckbox = screen.getByLabelText('Select all') as HTMLInputElement;
    expect(selectAllCheckbox.checked).toBe(false);
  });
});
