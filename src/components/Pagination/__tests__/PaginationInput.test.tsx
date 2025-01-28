import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import PaginationInput from '../PaginationInput';
import styles from './Pagination.module.scss';
import APPCONSTANTS from '../../../constants/appConstants';

describe('PaginationInput', () => {
  const props = {
    maxNumber: APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE,
    onPagination: jest.fn(),
    onChange: jest.fn()
  };

  it('calls onPagination when Enter key is pressed and input value is valid', () => {
    const { getByRole, unmount } = render(<PaginationInput {...props} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(props.onPagination).toHaveBeenCalledWith(2);
    unmount();
  });

  it('calls onPagination when other key is pressed and input value is valid', () => {
    const { getByRole, unmount } = render(<PaginationInput {...props} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.keyPress(input, { key: 'ArrowRight', code: 'ArrowRight', charCode: 39 });
    expect(props.onPagination).not.toHaveBeenCalled();
    unmount();
  });

  it('calls onChange when input value is changed', () => {
    const { getByRole, unmount } = render(<PaginationInput {...props} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    unmount();
  });

  it('displays error class when input value is not valid', () => {
    const { getByRole, unmount } = render(<PaginationInput {...props} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: '200' } });
    expect(input.classList.contains(`${styles.error}`)).toBeTruthy();
    unmount();
  });
});
