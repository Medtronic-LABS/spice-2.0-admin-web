import { shallow } from 'enzyme';
import Pagination from '../index';
import APPCONSTANTS from '../../../constants/appConstants';

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
    shallow(<Pagination {...props} />);
  });

  it('renders the correct number of pages', () => {
    const wrapper = shallow(<Pagination {...props} />);
    const pageLinks = wrapper.find('li');
    expect(pageLinks).toHaveLength(4);
  });

  it('calls onChangePage when a first page link is clicked', () => {
    props.currentPage = 2;
    props.initialPage = 2;
    const wrapper = shallow(<Pagination {...props} />);
    const secondPageLink = wrapper.find('[data-testid="firstPage"]');
    secondPageLink.simulate('click');
    wrapper.update();
    expect(props.onChangePage).toHaveBeenCalledWith(1, 10);
  });

  it('calls onChangePage when a previous page link is clicked', () => {
    props.currentPage = 4;
    props.initialPage = 4;
    const wrapper = shallow(<Pagination {...props} />);
    const prevPageLink = wrapper.find('[data-testid="prevPage"]');
    prevPageLink.simulate('click');
    wrapper.update();
    expect(props.onChangePage).toBeCalledWith(props.currentPage - 1, 10);
  });

  it('calls onChangePage when a page link is clickedd', () => {
    props.currentPage = 6;
    const wrapper = shallow(<Pagination {...props} />);
    const lastPageLink = wrapper.find('[data-testid="lastPage"]');
    lastPageLink.simulate('click');
    wrapper.update();
    expect(props.onChangePage).toBeCalledWith(10, 10);
  });
});
