import Pagination from '../index';
import { fireEvent, render, waitFor } from '@testing-library/react';
import APPCONSTANTS from '../../../constants/appConstants';

jest.mock('../PaginationInput', () => () => <div data-testid='PaginationInput'>PaginationInput</div>);

describe('Pagination component', () => {
  const props = {
    length: APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE,
    total: 100,
    onChangePage: jest.fn(),
    initialPage: 1,
    currentPage: 1,
    onChangeRowsPerPage: jest.fn()
  };
  beforeEach(() => {
    props.length = APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE;
    props.total = 100;
    props.currentPage = 1;
  });

  it('renders without crashing', () => {
    const { getByText, unmount } = render(<Pagination {...props} />);
    expect(getByText('Rows per page')).toBeInTheDocument();
    unmount();
  });

  it('renders the correct number of pages', () => {
    const { getAllByRole, unmount } = render(<Pagination {...props} />);
    const pageLinks = getAllByRole('listitem');
    expect(pageLinks).toHaveLength(4);
    unmount();
  });

  it('calls onChangePage when a first page link is clicked', () => {
    props.currentPage = 2;
    props.initialPage = 2;
    const { getByTestId, unmount } = render(<Pagination {...props} />);
    const secondPageLink = getByTestId('firstPage');
    secondPageLink.click();
    expect(props.onChangePage).toHaveBeenCalledWith(1, 10);
    unmount();
  });

  it('calls onChangePage when a previous page link is clicked', () => {
    props.currentPage = 4;
    props.initialPage = 4;
    const { getByTestId, unmount } = render(<Pagination {...props} />);
    const prevPageLink = getByTestId('prevPage');
    prevPageLink.click();
    expect(props.onChangePage).toBeCalledWith(props.currentPage - 1, 10);
    unmount();
  });

  it('calls onChangePage when a page link is clickedd', () => {
    props.currentPage = 6;
    const { getByTestId, unmount } = render(<Pagination {...props} />);
    const lastPageLink = getByTestId('lastPage');
    lastPageLink.click();
    expect(props.onChangePage).toBeCalledWith(10, 10);
    unmount();
  });

  it('should call onChangeRowsPerPage when rows per page is changed', () => {
    const { getByLabelText, unmount } = render(<Pagination {...props} />);
    const rowsPerPageSelect = getByLabelText('Rows per page');
    fireEvent.change(rowsPerPageSelect, { target: { value: 20 } });
    waitFor(() => {
      expect(props.onChangeRowsPerPage).toHaveBeenCalledWith(20);
    });
    unmount();
  });

  it('should handle anchor click', () => {
    const { getAllByTestId, unmount } = render(<Pagination {...props} />);
    const anchors = getAllByTestId('anchor');
    anchors[1].click();
    expect(props.onChangePage).toHaveBeenCalledWith(2, 10);
    unmount();
  });
});
