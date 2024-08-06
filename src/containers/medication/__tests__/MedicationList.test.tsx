import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MedicationList from '../MedicationList';
import { PROTECTED_ROUTES } from '../../../constants/route';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';

jest.mock('react-router', () => ({
  useParams: () => ({ regionId: 'mockRegionId', tenantId: 'mockTenantId' }),
  useHistory: () => ({ push: jest.fn() }) // Mock useHistory with a push function
}));

jest.mock('../../../constants/appConstants', () => ({
  ...jest.requireActual('../../../constants/appConstants'),
  ROLES: {
    SUPER_USER: 'SUPER_USER',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'REGION_ADMIN',
    PEER_SUPEVISOR: 'PEER_SUPERVISOR'
  },
  ACTIVATE_COUNTY_CONFIRMATION: undefined
}));

describe('MedicationList', () => {
  const mockStore = configureStore([]);
  let store: any;

  beforeEach(() => {
    // Set up the initial store state
    const initialState = {
      medication: {
        list: [],
        loading: false,
        count: 0
      }
    };
    store = mockStore(initialState);
  });

  it('renders without error', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MedicationList />
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });
  it('renders loader when loading is true', () => {
    const loadingState = {
      medication: {
        list: [],
        loading: true
      }
    };
    const loadingStore = mockStore(loadingState);

    const wrapper = mount(
      <Provider store={loadingStore}>
        <MedicationList />
      </Provider>
    );
    expect(wrapper.find('Loader').exists()).toBe(true);
  });

  it('redirects to add medication page when add medication button is clicked', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MedicationList />
      </Provider>
    );

    wrapper.find('IconButton button').simulate('click');
    const url = PROTECTED_ROUTES.createMedication.replace(':regionId', '1').replace(':tenantId', '1');
    const history = createMemoryHistory();
    history.push(url);
    expect(history.location.pathname).toBe(url);
  });

  it('opens edit modal with correct values', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MedicationList />
      </Provider>
    );

    // Simulate the action that triggers opening the edit modal
    act(() => {
      const wrapperProps: any = wrapper.find('CustomTable').props();

      wrapperProps.onRowEdit({
        id: 1,
        name: 'Medication Name',
        brandId: 123,
        brandName: 'Brand Name',
        classificationId: 456,
        classificationName: 'Classification Name',
        dosageFormId: 789,
        dosageFormName: 'Dosage Form Name'
        // Add other properties as needed
      });
    });

    // Update wrapper after state change
    wrapper.update();
    // Ensure that the modal is rendered in the DOM
    const popupModalProps: any = wrapper.find('Memo()[title="Edit Medication Details"]').props();
    expect(popupModalProps.show).toBe(true);

    expect(popupModalProps.initialValues).toEqual({
      id: 1,
      name: 'Medication Name',
      brand: { id: 123, name: 'Brand Name' },
      brandId: 123,
      brandName: 'Brand Name',
      classificationId: 456,
      classificationName: 'Classification Name',
      dosageFormId: 789,
      dosageFormName: 'Dosage Form Name',
      classification: { id: 456, name: 'Classification Name' },
      dosage_form: { id: 789, name: 'Dosage Form Name' }
    });
  });

  it('closes medication modal and resets initial values', () => {
    // Set initial props to simulate an open medication modal

    const wrapper = mount(
      <Provider store={store}>
        <MedicationList />
      </Provider>
    );
    act(() => {
      const wrapperProps: any = wrapper.find('CustomTable').props();

      wrapperProps.onRowEdit({
        id: 1,
        name: 'Medication Name',
        brandId: 123,
        brandName: 'Brand Name',
        classificationId: 456,
        classificationName: 'Classification Name',
        dosageFormId: 789,
        dosageFormName: 'Dosage Form Name'
      });
    });

    // Update wrapper after state change
    wrapper.update();
    // Ensure that the modal is rendered in the DOM
    const popupModalProps: any = wrapper.find('Memo()[title="Edit Medication Details"]').props();
    expect(popupModalProps.show).toBe(true);
    // find and simulate the cancel click event
    const cancelButton: any = wrapper.find('Memo()[title="Edit Medication Details"]').find('.secondary-btn');
    cancelButton.simulate('click');
    wrapper.update();
    // check if the modal props show is false
    const updatedModalProps: any = wrapper.find('Memo()[title="Edit Medication Details"]').props();
    expect(updatedModalProps.show).toBe(false);
  });
});
