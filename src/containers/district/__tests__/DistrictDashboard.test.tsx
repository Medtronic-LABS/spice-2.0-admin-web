import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DistrictDashboard from '../DistrictDashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import styles from './District.module.scss';
import DISTRICT_MOCK_DATA_CONSTANTS from '../../../tests/mockData/districtDataConstants';
import { act, waitFor } from '@testing-library/react';

const mockStore = configureStore([]);

jest.mock('../../../assets/images/arrow-right-small.svg', () => ({
  ReactComponent: 'ArrowRight'
}));
describe('DistrictDashboard', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = mockStore({
      district: {
        dashboardList: DISTRICT_MOCK_DATA_CONSTANTS.DASHBOARD_DISTRICT_RESPONSE_PAYLOAD,
        loading: false,
        loadingMore: false
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1'
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );
  });
  it('should render without errors', () => {
    expect(wrapper.length).toBe(1);
  });

  it('should display loader when loading is true', () => {
    store = mockStore({
      district: {
        dashboardList: DISTRICT_MOCK_DATA_CONSTANTS.DASHBOARD_DISTRICT_RESPONSE_PAYLOAD,
        loading: true,
        loadingMore: true
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1'
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );

    const loader = wrapper.find(`.${styles.loaderWrapper}.d-flex.align-items-center.justify-content-center.mt-2dot5`);
    expect(loader.length).toBe(1);
  });

  it('should display no data message when siteDashboardList is empty', () => {
    store = mockStore({
      district: {
        dashboardList: [],
        loading: false,
        loadingMore: false,
        error: null
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1'
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );
    const noDataMessage = wrapper.find('.fw-bold.highlight-text');

    expect(noDataMessage.text()).toBe('Let’s Get Started!');
  });
  it('should display search data', () => {
    store = mockStore({
      district: {
        dashboardList: [],
        loading: false,
        loadingMore: false,
        error: null
      },
      user: {
        user: {
          formDataId: '1',
          tenantId: '1'
        }
      },
      common: {
        sideMenu: [],
        labelName: null
      }
    });
    const wrapperDistrict = mount(
      <Provider store={store}>
        <Router>
          <DistrictDashboard />
        </Router>
      </Provider>
    );
    act(() => {
      const wrapperProps: any = wrapperDistrict.find('DistrictDashboard').find('button').props();
      wrapperProps.onClick();
      wrapperDistrict.update();
      waitFor(() => {
        expect(wrapperProps.onCLick).toBeCalled();
      });
    });
  });
});
