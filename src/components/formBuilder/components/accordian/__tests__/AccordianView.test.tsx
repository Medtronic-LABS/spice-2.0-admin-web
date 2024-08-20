import { mount } from 'enzyme';
import AccordianView from '../AccordianView';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

const store = mockStore({
  labtest: {
    units: [
      {
        id: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2022-04-18T20:39:27+00:00',
        updatedAt: '2022-04-18T20:39:27+00:00',
        name: 'mg/dL',
        type: 'LABTEST',
        description: 'mg/dL',
        displayOrder: 6,
        active: true,
        deleted: false
      }
    ]
  }
});
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

const store = mockStore({
  labtest: {
    units: [
      {
        id: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2022-04-18T20:39:27+00:00',
        updatedAt: '2022-04-18T20:39:27+00:00',
        name: 'mg/dL',
        type: 'LABTEST',
        description: 'mg/dL',
        displayOrder: 6,
        active: true,
        deleted: false
      }
    ]
  }
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/region/4/6/labTest/lab-test/adfgsrgf'
  })
}));

const props = {
  formRef: {},
  formMeta: {
    labTest: {
      labTest: {
        id: 'labTest',
        viewType: 'CardView',
        title: 'labTest',
        familyOrder: 0
      },
      TestedOn: {
        id: 'TestedOn',
        viewType: 'DatePicker',
        title: 'Tested On',
        fieldName: 'TestedOn',
        family: 'labTest',
        isMandatory: true,
        isEnabled: true,
        minDays: 10,
        maxDays: 10,
        disableFutureDate: false,
        visibility: 'visible',
        isDefault: false,
        isDeletable: false,
        orderId: 1
      }
    }
  },
  // tslint:disable-next-line:no-empty
  setFormMeta: () => {},
  targetIds: [],
  onSubmit: {},
  onCancel: {},
  setEditGroupedFieldsOrder: {},
  presentableJson: {},
  collapsedGroup: {},
  setCollapsedGroup: {},
  addedFields: [],
  allowedFields: [],
  hashFieldIdsWithTitle: {},
  hashFieldIdsWithFieldName: {},
  culture: {},
  accordianRef: {},
  newlyAddedIdsRef: [],
  addNewFieldDisabled: false,
  isFieldNameChangable: true
};

describe('AccordianViewForm', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <AccordianView {...props} />
      </Provider>
    );
  });

  it('renders Accordian View without errors', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('renders Accordian View with isAccountCustomization', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('Handles add new Field', () => {
    const accordianHeader = wrapper.find('AccordianHeader');
    const handleAddNewFieldElement = accordianHeader.prop('handleAddNewField');
    handleAddNewFieldElement('labTest', 'Instruction');
  });

  it('Handles Update Field', () => {
    const accordianBody = wrapper.find('AccordianBody');
    const handleUpdateFieldElement = accordianBody.prop('handleUpdateFieldName');
    handleUpdateFieldElement('pressure', 'Test', 'WF', 'Test', 'WFS', true);
  });

  it('Handles Update Field with callback', () => {
    const accordianBody = wrapper.find('AccordianBody');
    const handleUpdateFieldElement = accordianBody.prop('handleUpdateFieldName');
    const callBack = jest.fn();
    handleUpdateFieldElement('pressure', 'Test', 'WF', 'Test', 'WFS', true, callBack);
  });

  it('Handles Update Field onlyCallback as false', () => {
    const accordianBody = wrapper.find('AccordianBody');
    const handleUpdateFieldElement = accordianBody.prop('handleUpdateFieldName');
    const callBack = jest.fn();
    handleUpdateFieldElement('labTest', 'labTest', 'labTest', 'labTest', 'labTest', false, callBack);
  });

  it('Handles Delete Field', () => {
    const accordianBody = wrapper.find('AccordianBody');
    const handleDeleteFieldElement = accordianBody.prop('handleDeleteField');
    handleDeleteFieldElement('labTest', 'Fname');
  });

  it('Handles Form Submit', () => {
    const submitButton = wrapper.find('button[type="submit"]');
    submitButton.simulate('click');
  });
});
