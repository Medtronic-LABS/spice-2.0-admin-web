import { mount, shallow } from 'enzyme';
import AppLayout from '../AppLayout';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import APPCONSTANTS from '../../../constants/appConstants';

const mockStore = configureMockStore();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/region'
  })
}));

jest.mock('../../../assets/images/home.svg', () => ({
  ReactComponent: 'HomeIcon'
}));

describe('AppLayout component', () => {
  const store = mockStore({
    user: {
      initializing: false,
      user: {
        role: APPCONSTANTS.ROLES.SUPER_ADMIN
      }
    }
  });
  it('renders component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <AppLayout children={<div>RENDER</div>} />
        </Router>
      </Provider>
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('test useEffect()', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 800 // Set the desired value here
    });

    const mockSetIsMenuTogglable = jest.fn();
    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: jest.fn().mockImplementation((initialState) => [initialState, mockSetIsMenuTogglable])
    }));
    const wrapper = shallow(
      <Provider store={store}>
        <Router>
          <AppLayout children={<div>RENDER</div>} />
        </Router>
      </Provider>
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
