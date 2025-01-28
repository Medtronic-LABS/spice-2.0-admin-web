import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import DistrictList from '../DistrictList';

const mockStore = configureMockStore([]);
const store = mockStore({
  district: {
    loading: false,
    districtList: [],
    count: 0,
    clinicalWorkflows: []
  },
  workflow: {
    loading: false
  },
  user: {
    user: {
      appTypes: []
    }
  },
  common: {
    labelName: null
  }
});

const matchProps = {
  params: {
    regionId: '1',
    tenantId: '12345'
  },
  history: {},
  location: {},
  match: {
    isExact: false,
    path: '',
    url: '',
    params: {
      regionId: '1',
      tenantId: '12345'
    }
  }
};

jest.mock('../../../components/modal/ModalForm', () => () => null);

jest.mock('../DistrictConsentForm', () => () => null);

describe('DistrictList', () => {
  it('should render without errors', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <DistrictList
            decactivateDistrictReq={() => {
              //
            }}
            {...matchProps}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should dispatch fetchDistrictRequest action on mount', () => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <DistrictList
            decactivateDistrictReq={() => {
              //
            }}
            {...matchProps}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toContainEqual(expect.objectContaining({ type: 'FETCH_DISTRICT_LIST_REQUEST' }));
  });

  it('should handle search and call handleSearch', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DistrictList
            decactivateDistrictReq={() => {
              //
            }}
            {...matchProps}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('input').simulate('change', { target: { value: 'searchTerm' } });
  });
});
