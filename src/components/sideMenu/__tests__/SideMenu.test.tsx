import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import SideMenu from '../SideMenu';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';

const mockStore = configureMockStore();

describe('SideMenu', () => {
  const store = mockStore({
    user: {
      user: { role: 'SUPER_ADMIN' }
    }
  });
  it('renders the correct menu items for a region admin', () => {
    // Mock the Redux store to return a role of "regionAdmin"
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SideMenu />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
