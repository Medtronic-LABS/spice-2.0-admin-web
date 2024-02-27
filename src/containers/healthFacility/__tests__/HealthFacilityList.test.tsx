import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import HealthFacilityList from '../HealthFacilityList';
import CustomTable from '../../../components/customTable/CustomTable';
// import { SITE_MOCK_DATA } from '../../../';

const mockStore = configureMockStore();
jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: 'EditIcon'
}));

describe('SiteList', () => {
  let store: any;
  let wrapper: any;

  beforeEach(() => {
    store = mockStore({
      site: {
        siteList: [
          { id: 9, name: 'Site1' },
          { id: 8, name: 'Site2' }
        ],
        loading: false,
        total: 0
      },
      user: {
        user: {
          countryId: '11'
        },
        country: {
          id: 88
        }
      }
    });

    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/10']}>
          <Route path='/region/:regionId'>
            <HealthFacilityList />
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render CustomTable component', () => {
    expect(wrapper.find(CustomTable)).toHaveLength(1);
  });

  it('should open site edit modal', () => {
    const componentWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/11/22/site']}>
          <Route path='/region/:regionId/:tenantId/site'>
            <HealthFacilityList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const customTable = componentWrapper.find(CustomTable);
    const DetailCard = componentWrapper.find('DetailCard');
    const ModalForm = componentWrapper.find('Memo()');

    const handleRowClick: any = customTable.prop('handleRowClick');
    const onRowEdit: any = customTable.prop('onRowEdit');
    const onButtonClick: any = DetailCard.prop('onButtonClick');
    const handleCancel: any = ModalForm.prop('handleCancel');
    const handleFormSubmit: any = ModalForm.prop('handleFormSubmit');
    const handleRender: any = ModalForm.prop('render');

    handleRowClick({ id: 1, name: 'Site1' });
    onButtonClick();
    onRowEdit({
      id: '9',
      name: 'Site New',
      siteType: 'Postal',
      tenantId: '1',
      siteLevel: 'level 1',
      operatingUnitName: 'OU one'
    });
    handleCancel();
    handleFormSubmit({ site: { addressType: ['Postal', 'Physical'] } });
    handleRender(jest.fn());
    expect(componentWrapper.find(CustomTable)).toHaveLength(1);
  });
});
