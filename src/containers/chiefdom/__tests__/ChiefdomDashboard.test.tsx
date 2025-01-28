import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import ChiefdomDashboard from '../ChiefdomDashboard';
import styles from '../Chiefdom.module.scss';

const mockStore = configureMockStore();
jest.mock('../../../assets/images/arrow-right-small.svg', () => ({
  ReactComponent: 'ArrowRight'
}));

describe('ChiefdomDashboard', () => {
  let store: any;
  let wrapper: any;

  const initialState = {
    chiefdom: {
      chiefdomDashboardList: [
        { name: 'OU1', id: '1', tenantId: '1', siteCount: 5 },
        { name: 'OU2', id: '2', tenantId: '2', siteCount: 10 }
      ],
      chiefdomCount: 2,
      chiefdomLoading: false,
      chiefdomLoadingMore: false,
      chiefdomDetail: {}
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
          <ChiefdomDashboard />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render chiefdom cards', () => {
    expect(wrapper.find(`.${styles.summaryCard}`).length).toEqual(15);
  });
  it('renders the header correctly', () => {
    const header = wrapper.find('.page-title');
    expect(header).toHaveLength(1);
    expect(header.text()).toEqual('Sub Counties');
  });

  it('renders the create chiefdom button when there are chiefdom available', () => {
    expect(wrapper.find('.primary-btn')).toHaveLength(1);
  });

  it('should render the search bar', () => {
    expect(wrapper.find('[placeholder="Search Sub County"]').length).toEqual(2);
  });

  it('renders the no data message when there are no chiefdom available', () => {
    const state = {
      chiefdom: {
        chiefdomDashboardList: [],
        chiefdomCount: 2,
        chiefdomLoading: false,
        chiefdomLoadingMore: false,
        chiefdomDetail: {}
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
          <ChiefdomDashboard />
        </MemoryRouter>
      </Provider>
    );

    wrapper.setProps({ noChiefdomsAvailable: true, loading: false });
    // tslint:disable-next-line:quotemark
    expect(wrapper.find('.fw-bold').text()).toEqual("Let's Get Started!");
    expect(wrapper.find('.subtle-color').text()).toEqual('Create an sub county');
    expect(wrapper.find('.primary-btn')).toHaveLength(1);
  });
});
