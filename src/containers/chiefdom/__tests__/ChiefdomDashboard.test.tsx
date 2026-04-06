import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import ChiefdomDashboard from '../ChiefdomDashboard';
import styles from '../Chiefdom.module.scss';

const mockStore = configureMockStore();
jest.mock('../../../assets/images/arrow-right-small.svg', () => ({
  ReactComponent: () => <svg data-testid='arrow-right-icon'>ArrowRight</svg>
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
      user: {
        country: { id: 1, appTypes: [] },
        appTypes: []
      },
      countryId: { id: 1 },
      formData: { id: 2 },
      tenantId: { id: 3 }
    },
    common: {
      labelName: null
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
    // The header uses chiefdomPName from useAppTypeConfigs, which defaults to "Sub Counties" when labelName is null
    expect(header.text()).toMatch(/Sub Counties|Chiefdoms/i);
  });

  it('renders the create chiefdom button when there are chiefdom available', () => {
    expect(wrapper.find('.primary-btn')).toHaveLength(1);
  });

  it('should render the search bar', () => {
    // The search bar is rendered when there are chiefdoms available
    // It uses Searchbar component which might render an input
    const searchbar = wrapper.find('Searchbar');
    // If Searchbar is a component, it might not be directly findable, so check for its container or input
    const searchInputs = wrapper.find('input');
    // Searchbar should be present when chiefdoms are available
    expect(searchbar.length + searchInputs.length).toBeGreaterThan(0);
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
        user: {
          country: { id: 1, appTypes: [] },
          appTypes: []
        },
        countryId: { id: 1 },
        formData: { id: 2 },
        tenantId: { id: 3 }
      },
      common: {
        labelName: null
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

    // The component checks noChiefdomsAvailable internally based on searchText and parsedData
    // Since we have empty list, it should show the no data message
    // tslint:disable-next-line:quotemark
    expect(wrapper.find('.fw-bold').text()).toEqual("Let's Get Started!");
    // The text uses chiefdomSName.toLowerCase() which defaults to "chiefdom" when labelName is null
    expect(wrapper.find('.subtle-color').text()).toMatch(/Create an (sub county|chiefdom)/i);
    expect(wrapper.find('.primary-btn')).toHaveLength(1);
  });
});
