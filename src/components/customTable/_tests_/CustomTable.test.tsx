import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomTable from '../CustomTable';
import { IColumns } from '../CustomTable';

jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: 'EditIcon'
}));

const columnsDef: IColumns[] = [
  { id: 1, name: 'id', label: 'ID' },
  { id: 2, name: 'name', label: 'Name' },
  { id: 3, name: 'email', label: 'Email' }
];

const rowData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
];

const props = {
  columnsDef,
  rowData,
  isEdit: true,
  isDelete: true
};

describe('CustomTable', () => {
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

  it('should close ConfirmationModalPopup component when openDialog state is false', () => {
    const newProps = { ...props, confirmationTitle: 'Are you sure?' };
    const { queryByText } = render(<CustomTable {...newProps} isEdit={false} isDelete={true} />);

    // Find the delete icon and click it to open the modal
    const deleteIcon = screen.getAllByTestId('delete-icon')[0];
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
});
