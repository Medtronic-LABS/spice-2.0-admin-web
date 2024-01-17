import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { useTablePaginationHook } from '../tablePagination';

describe('useTablePaginationHook', () => {
  let wrapper: any;
  let handleSearchVar: any;
  let handlePageVar: any;

  beforeEach(() => {
    wrapper = mount(<TestComponent />);
    handleSearchVar = wrapper.find('button').at(0).prop('onClick');
    handlePageVar = wrapper.find('button').at(1).prop('onClick');
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should initialize with default listParams', () => {
    expect(wrapper.find('.page').text()).toBe('1');
    expect(wrapper.find('.rows-per-page').text()).toBe('10');
    expect(wrapper.find('.search-term').text()).toBe('');
  });

  it('should update listParams when handleSearch is called', () => {
    act(() => {
      handleSearchVar('example');
    });
    wrapper.update();

    expect(wrapper.find('.page').text()).toBe('1');
    expect(wrapper.find('.rows-per-page').text()).toBe('10');
    expect(wrapper.find('.search-term').text()).toBe('example');
  });

  it('should update listParams when handlePage is called', () => {
    act(() => {
      handlePageVar(2, 20);
    });
    wrapper.update();

    expect(wrapper.find('.page').text()).toBe('2');
    expect(wrapper.find('.rows-per-page').text()).toBe('20');
    expect(wrapper.find('.search-term').text()).toBe('');
  });

  function TestComponent() {
    const { listParams, handleSearch, handlePage } = useTablePaginationHook();

    return (
      <div>
        <div className='page'>{listParams.page}</div>
        <div className='rows-per-page'>{listParams.rowsPerPage}</div>
        <div className='search-term'>{listParams.searchTerm}</div>
        <button onClick={() => handleSearch('example')}>Search</button>
        <button onClick={() => handlePage(2, 20)}>Change Page</button>
      </div>
    );
  }
});
