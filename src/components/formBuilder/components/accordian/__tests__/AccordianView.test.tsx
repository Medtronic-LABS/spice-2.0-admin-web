import { mount } from 'enzyme';
import AccordianView from '../AccordianView';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/region/4/6/Adfgsrgf/lab-test/adfgsrgf'
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
        familyOrder: 0,
        isCustomWorkflow: true
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
  addNewFieldDisabled: false,
  isFieldNameChangable: true
};

describe('SubCountyForm', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(<AccordianView {...props} />);
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
