import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomTable from '../CustomTable';

jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: 'EditIcon'
}));

jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loading-component'>Loading</div>);

const columnsDef: any = [
  { id: 1, name: 'id', label: 'ID' },
  { id: 2, name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' } // don't add id to test key value become columnIndex
];

const rowData: any = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  // don't add id to test key value become rowIndex
  { name: 'Jane Doe', email: 'jane.doe@example.com', isCustomIconInvisible: true }
];

const props = {
  columnsDef,
  rowData,
  isEdit: true,
  isDelete: true
};

describe('CustomTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call handlePageChange and scroll to top when handleChangeRowsPerPage is called', () => {
    const handlePageChangeMock = jest.fn();
    const scrollToMock = jest.fn();

    const newProps = {
      ...props,
      page: 1,
      rowsPerPage: 10,
      count: 30,
      handlePageChange: handlePageChangeMock
    };

    render(<CustomTable {...newProps} />);

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollToMock
    });

    const rowsPerPageSelect = screen.getByLabelText('Rows per page');
    fireEvent.change(rowsPerPageSelect, { target: { value: 20 } });

    waitFor(() => {
      expect(handlePageChangeMock).toHaveBeenCalledWith(1, 20);
    });

    waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    });
  });
  it('should render without throwing an error', () => {
    render(<CustomTable {...props} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
  });

  it('should render table header with correct column names', () => {
    render(<CustomTable {...props} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render table rows with correct data', () => {
    render(<CustomTable {...props} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
  });

  it('should render Pagination component when count prop is provided', () => {
    const newProps = { ...props, page: 1, rowsPerPage: 10, count: 12 };
    render(<CustomTable {...newProps} />);
    // Assuming your Pagination component has a role or a test id you can query.
    // You might need to adjust this part to match your actual Pagination component implementation.
    expect(screen.getByText('1 - 10 of 12')).toBeInTheDocument();
  });

  it('should render ConfirmationModalPopup component when openDialog state is true', () => {
    const newProps = { ...props, confirmationTitle: 'Are you sure?' };
    render(<CustomTable {...newProps} />);
    const deleteDiv = screen.getAllByTestId('delete-icon')[0];
    expect(deleteDiv).toBeInTheDocument();
    fireEvent.click(deleteDiv);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should render ConfirmationModalPopup component with one row data when openDialog state is true', () => {
    const newProps = { ...props, confirmationTitle: 'Are you sure?', rowData: [rowData[0]] };
    render(<CustomTable {...newProps} />);
    const deleteDiv = screen.getByTestId('delete-icon');
    expect(deleteDiv).toBeInTheDocument();
    fireEvent.click(deleteDiv);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should close ConfirmationModalPopup component when openDialog state is false', () => {
    const newProps = { ...props, confirmationTitle: 'Are you sure?' };
    const { queryByText, getAllByTestId } = render(<CustomTable {...newProps} isEdit={false} isDelete={true} />);

    // Find the delete icon and click it to open the modal
    const deleteIcon = getAllByTestId('delete-icon')[0];
    fireEvent.click(deleteIcon);

    // Verify that the modal is open
    expect(queryByText('Are you sure?')).toBeInTheDocument();

    // Close the modal by clicking the cancel button (or any other way your UI provides for closing the modal)
    const cancelButton = queryByText('Cancel');
    if (cancelButton) {
      fireEvent.click(cancelButton);
    }

    // Verify that the modal is closed
    expect(queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('should call handlePageChange and scroll to top when handlePageChangeWrapper is called', () => {
    const handlePageChangeMock = jest.fn();
    const scrollToMock = jest.fn();

    const newProps = {
      ...props,
      page: 1,
      rowsPerPage: 10,
      count: 30,
      handlePageChange: handlePageChangeMock
    };

    render(<CustomTable {...newProps} />);

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      writable: true,
      value: scrollToMock
    });

    const nextPageButton = screen.getByText('›');

    fireEvent.click(nextPageButton);

    waitFor(() => {
      expect(handlePageChangeMock).toHaveBeenCalledWith(2, 10);
    });
    waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    });
  });

  it('should call onRowEdit when edit icon is clicked', () => {
    const onRowEditMock = jest.fn();
    const newProps = {
      ...props,
      isRowEdit: true,
      onRowEdit: onRowEditMock
    };

    render(<CustomTable {...newProps} />);

    const editIcon = screen.getAllByTestId('edit-icon')[0];
    expect(editIcon).toBeInTheDocument();

    // Click the first edit icon
    fireEvent.click(editIcon);

    // Check if onRowEdit was called with the correct arguments
    expect(onRowEditMock).toHaveBeenCalledTimes(1);
    expect(onRowEditMock).toHaveBeenCalledWith({
      ...rowData[0],
      index: 0
    });
  });

  it('should call onCustomConfirmed when custom icon is clicked and isPopupNeeded is false', () => {
    const onCustomConfirmedMock = jest.fn();
    const newProps = {
      ...props,
      isCustom: true,
      onCustomConfirmed: onCustomConfirmedMock,
      CustomIcon: () => <div data-testid='custom-icon'>Custom</div>,
      customTitle: 'Custom Action'
    };

    render(<CustomTable {...newProps} />);

    const customIcons = screen.getAllByTestId('custom-icon');
    expect(customIcons.length).toBeGreaterThan(0);

    // Click the first custom icon
    fireEvent.click(customIcons[0]);

    expect(onCustomConfirmedMock).toHaveBeenCalledWith({
      ...rowData[0],
      index: 0
    });
  });

  it('should set state when custom icon is clicked and isPopupNeeded is true', () => {
    const newProps = {
      ...props,
      isCustom: true,
      isPopupNeeded: true,
      CustomIcon: () => <div data-testid='custom-icon'>Custom</div>,
      customTitle: 'Custom Action'
    };

    render(<CustomTable {...newProps} />);

    const customIcons = screen.getAllByTestId('custom-icon');
    expect(customIcons.length).toBeGreaterThan(0);
    fireEvent.click(customIcons[0]);
  });

  it('should set state correctly when activate icon is clicked', () => {
    const onActivateClickMock = jest.fn();
    const newProps = {
      ...props,
      isActivate: true,
      isEdit: false,
      isDelete: false,
      onActivateClick: onActivateClickMock,
      activateConfirmationTitle: 'Are you sure you want to activate?'
    };

    render(<CustomTable {...newProps} />);

    const activateIcons = screen.getAllByTestId('activate-icon');
    expect(activateIcons.length).toBeGreaterThan(0);

    fireEvent.click(activateIcons[0]);

    expect(screen.getByText('Are you sure you want to activate?')).toBeInTheDocument();

    const okButton = screen.getByText('Ok');
    expect(okButton).toBeInTheDocument();

    fireEvent.click(okButton);

    expect(onActivateClickMock).toHaveBeenCalledWith({
      ...rowData[0],
      index: 0
    });
  });

  it('should call onCustomConfirmed and close custom confirmation dialog when handleCustomConfirmed is called', () => {
    const onCustomConfirmedMock = jest.fn();
    const newProps = {
      ...props,
      isCustom: true,
      isEdit: false,
      isDelete: false,
      isPopupNeeded: true,
      onCustomConfirmed: onCustomConfirmedMock,
      CustomIcon: () => <div data-testid='custom-icon'>Custom</div>,
      customTitle: 'Custom Action',
      customConfirmationTitle: 'Are you sure?',
      customPopupTitle: 'Custom Confirmation'
    };

    render(<CustomTable {...newProps} />);

    const customIcons = screen.getAllByTestId('custom-icon');
    fireEvent.click(customIcons[0]);

    expect(screen.getByText('Custom Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    const okButton = screen.getByText('Ok');
    fireEvent.click(okButton);

    expect(onCustomConfirmedMock).toHaveBeenCalledWith({
      ...rowData[0],
      index: 0
    });
    expect(screen.queryByText('Custom Confirmation')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('should close custom confirmation dialog when Cancel button is clicked', () => {
    const newProps = {
      ...props,
      isCustom: true,
      isPopupNeeded: true,
      CustomIcon: () => <div data-testid='custom-icon'>Custom</div>,
      customTitle: 'Custom Action',
      customConfirmationTitle: 'Are you sure?'
    };

    render(<CustomTable {...newProps} />);

    const customIcons = screen.getAllByTestId('custom-icon');
    fireEvent.click(customIcons[0]);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Custom Confirmation')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('should call onDeleteClick when delete is confirmed', () => {
    const onDeleteClickMock = jest.fn();
    const newProps = {
      ...props,
      isDelete: true,
      onDeleteClick: onDeleteClickMock,
      confirmationTitle: 'Are you sure you want to delete?',
      deleteTitle: 'Delete Confirmation'
    };

    render(<CustomTable {...newProps} />);

    const deleteIcons = screen.getAllByTestId('delete-icon');
    fireEvent.click(deleteIcons[0]);

    expect(screen.getByText('Are you sure you want to delete?')).toBeInTheDocument();

    const okButton = screen.getByText('Ok');
    fireEvent.click(okButton);

    expect(onDeleteClickMock).toHaveBeenCalledWith({
      data: rowData[0],
      index: 0,
      pageNo: undefined
    });

    expect(screen.queryByText('Are you sure you want to delete?')).not.toBeInTheDocument();
  });

  it('should call handleRowClick when a row is clicked', () => {
    const handleRowClickMock = jest.fn();
    const newProps = {
      ...props,
      handleRowClick: handleRowClickMock
    };

    render(<CustomTable {...newProps} />);

    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toBeInTheDocument();

    if (firstRow) {
      fireEvent.click(firstRow);
    }

    expect(handleRowClickMock).toHaveBeenCalledTimes(1);
    expect(handleRowClickMock).toHaveBeenCalledWith(rowData[0]);
  });

  it('should render Loading component when loading prop is true', () => {
    const newProps = { ...props, loading: true };
    render(<CustomTable {...newProps} />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('should render custom table with no data', () => {
    const newProps = { ...props, rowData: [] };
    render(<CustomTable {...newProps} />);
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('should render custom table with actionFormatter', () => {
    const newProps = {
      ...props,
      actionFormatter: {
        hideEditIcon: (row: any) => row.isEdit,
        hideDeleteIcon: (row: any) => row.isDelete,
        hideCustomIcon: (row: any) => row.isCustom
      }
    };
    render(<CustomTable {...newProps} />);
    expect(screen.getAllByTestId('edit-icon').length).toBe(2);
    expect(screen.getAllByTestId('delete-icon').length).toBe(2);
  });
});
