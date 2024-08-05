import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import SubCountyDashboard from '../SubCountyDashboard';
import styles from '../SubCounty.module.scss';

const mockStore = configureMockStore();
jest.mock('../../../assets/images/arrow-right-small.svg', () => ({
  ReactComponent: 'ArrowRight'
}));

describe('SubCountyDashboard', () => {
  let store: any;
  let wrapper: any;

  const initialState = {
    operatingUnit: {
      operatingUnitDashboardList: [
        { name: 'OU1', id: '1', tenantId: '1', siteCount: 5 },
        { name: 'OU2', id: '2', tenantId: '2', siteCount: 10 }
      ],
      operatingUnitCount: 2,
      operatingUnitLoading: false,
      operatingUnitLoadingMore: false,
      operatingUnitDetail: {}
    },
    user: {
      countryId: { id: 1 },
      formData: { id: 2 },
      tenantId: { id: 3 }
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SubCountyDashboard />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render operating unit cards', () => {
    expect(wrapper.find(`.${styles.summaryCard}`).length).toEqual(15);
  });
  it('renders the header correctly', () => {
    const header = wrapper.find('.page-title');
    expect(header).toHaveLength(1);
    expect(header.text()).toEqual('Operating Units');
  });

  it('renders the create operating unit button when there are operating units available', () => {
    expect(wrapper.find('.primary-btn')).toHaveLength(1);
  });

  it('should render the search bar', () => {
    expect(wrapper.find('[placeholder="Search Operating Unit"]').length).toEqual(2);
  });

  it('renders the no data message when there are no operating units available', () => {
    const state = {
      operatingUnit: {
        operatingUnitDashboardList: [],
        operatingUnitCount: 2,
        operatingUnitLoading: false,
        operatingUnitLoadingMore: false,
        operatingUnitDetail: {}
      },
      user: {
        countryId: { id: 1 },
        formData: { id: 2 },
        tenantId: { id: 3 }
      }
    };
    store = mockStore(state);
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SubCountyDashboard />
        </MemoryRouter>
      </Provider>
    );

    wrapper.setProps({ noSubCountysAvailable: true, loading: false });
    expect(wrapper.find('.fw-bold').text()).toEqual('Let’s Get Started!');
    expect(wrapper.find('.subtle-color').text()).toEqual('Create an operating unit');
    expect(wrapper.find('.primary-btn')).toHaveLength(1);
  });
});
