import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AccordianView from '../AccordianView';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import APPCONSTANTS from '../../../../../constants/appConstants';

const mockStore = configureMockStore();

const initialState = {
  labtest: {
    units: [
      {
        id: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mg/dL',
        type: 'LABTEST',
        description: 'mg/dL',
        displayOrder: 6,
        active: true,
        deleted: false
      },
      {
        id: 3,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mmol/L',
        type: 'LABTEST',
        description: 'mmol/L',
        displayOrder: 3,
        active: true,
        deleted: false
      },
      {
        id: 4,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mcmol/L',
        type: 'LABTEST',
        description: 'mcmol/L',
        displayOrder: 8,
        active: true,
        deleted: false
      },
      {
        id: 5,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'pg/mL',
        type: 'LABTEST',
        description: 'pg/mL',
        displayOrder: 13,
        active: true,
        deleted: false
      },
      {
        id: 7,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mg/24 hrs',
        type: 'LABTEST',
        description: 'mg/24 hrs',
        displayOrder: 4,
        active: true,
        deleted: false
      },
      {
        id: 8,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mg/g',
        type: 'LABTEST',
        description: 'mg/g',
        displayOrder: 2,
        active: true,
        deleted: false
      },
      {
        id: 9,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'g/dL',
        type: 'LABTEST',
        description: 'g/dL',
        displayOrder: 1,
        active: true,
        deleted: false
      },
      {
        id: 10,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mg/mg',
        type: 'LABTEST',
        description: 'mg/mg',
        displayOrder: 7,
        active: true,
        deleted: false
      },
      {
        id: 11,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mU/L',
        type: 'LABTEST',
        description: 'mU/L',
        displayOrder: 10,
        active: true,
        deleted: false
      },
      {
        id: 13,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mmol/mol',
        type: 'LABTEST',
        description: 'mmol/mol',
        displayOrder: 5,
        active: true,
        deleted: false
      },
      {
        id: 15,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mEq/L',
        type: 'LABTEST',
        description: 'mEq/L',
        displayOrder: 9,
        active: true,
        deleted: false
      },
      {
        id: 16,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mug/dL',
        type: 'LABTEST',
        description: 'mug/dL',
        displayOrder: 11,
        active: true,
        deleted: false
      },
      {
        id: 17,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'ng/dL',
        type: 'LABTEST',
        description: 'ng/dL',
        displayOrder: 12,
        active: true,
        deleted: false
      },
      {
        id: 20,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'U/L',
        type: 'LABTEST',
        description: 'U/L',
        displayOrder: 13,
        active: true,
        deleted: false
      },
      {
        id: 21,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: '%',
        type: 'LABTEST',
        description: '%',
        displayOrder: 16,
        active: true,
        deleted: false
      },
      {
        id: 22,
        createdBy: 1,
        updatedBy: 1,
        createdAt: '2024-10-09T17:32:13+05:30',
        updatedAt: '2024-10-09T17:32:13+05:30',
        name: 'mU/mL',
        type: 'LABTEST',
        description: 'mU/mL',
        displayOrder: 15,
        active: true,
        deleted: false
      }
    ],
    labTestCustomizationData: {
      id: 29,
      uniqueName: 'bgTest1727682227830',
      testName: 'Bg test',
      formInput: {
        formLayout: [
          {
            id: 'labTest',
            viewType: 'CardView',
            title: 'Bg test',
            familyOrder: 0
          },
          {
            id: 'TestedOn',
            viewType: 'DatePicker',
            title: 'Tested On',
            fieldName: 'TestedOn',
            family: 'labTest',
            isMandatory: true,
            isEnabled: true,
            visibility: 'visible',
            isDefault: false,
            disableFutureDate: true,
            minDays: '2',
            maxDays: null,
            isDeletable: false,
            orderId: 1
          },
          {
            id: 'Test',
            viewType: 'EditText',
            title: 'Test',
            fieldName: 'Test',
            family: 'labTest',
            isMandatory: true,
            isEnabled: true,
            isResult: true,
            visibility: 'visible',
            hint: '',
            errorMessage: '',
            inputType: 2,
            isDefault: false,
            orderId: 2,
            code: '234',
            url: '',
            resource: 'Quantity',
            condition: null,
            minValue: null,
            maxValue: null,
            unitList: [
              {
                name: 'mmol/mol',
                id: 'mmol/mol'
              }
            ],
            ranges: [
              {
                unitType: 'mmol/mol',
                gender: 'Male',
                minRange: 2,
                maxRange: 4,
                displayRange: '2'
              },
              {
                unitType: 'mmol/mol',
                gender: 'Female',
                minRange: 1,
                maxRange: 2,
                displayRange: '3'
              }
            ]
          }
        ]
      },
      countryId: 4,
      tenantId: null,
      codeDetails: {
        code: '2344',
        url: 'hghg'
      }
    },
    labtestJson: {
      formLayout: [
        {
          id: 'labTest',
          viewType: 'CardView',
          title: 'Bg test',
          familyOrder: 0
        },
        {
          id: 'TestedOn',
          viewType: 'DatePicker',
          title: 'Tested On',
          fieldName: 'TestedOn',
          family: 'labTest',
          isMandatory: true,
          isEnabled: true,
          visibility: 'visible',
          isDefault: false,
          disableFutureDate: true,
          minDays: '2',
          maxDays: null,
          isDeletable: false,
          orderId: 1
        },
        {
          id: 'Test',
          viewType: 'EditText',
          title: 'Test',
          fieldName: 'Test',
          family: 'labTest',
          isMandatory: true,
          isEnabled: true,
          isResult: true,
          visibility: 'visible',
          hint: '',
          errorMessage: '',
          inputType: 2,
          isDefault: false,
          orderId: 2,
          code: '234',
          url: '',
          resource: 'Quantity',
          condition: null,
          minValue: null,
          maxValue: null,
          unitList: [
            {
              name: 'mmol/mol',
              id: 'mmol/mol'
            }
          ],
          ranges: [
            {
              unitType: 'mmol/mol',
              gender: 'Male',
              minRange: 2,
              maxRange: 4,
              displayRange: '2'
            },
            {
              unitType: 'mmol/mol',
              gender: 'Female',
              minRange: 1,
              maxRange: 2,
              displayRange: '3'
            }
          ]
        }
      ]
    }
  }
};

const store = mockStore(initialState);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    tenantId: '32',
    regionId: '4',
    form: 'Workflow test',
    clinicalWorkflowId: '64',
    workflowId: 'workflowCustomize'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const mockSetFormMeta = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockSetEditGroupedFieldsOrder = jest.fn();
const mockSetCollapsedGroup = jest.fn();

const defaultProps = {
  formRef: { current: { getState: () => ({ values: {}, valid: true }) } },
  formMeta: {
    labTest: {
      labTest: {
        id: 'labTest',
        viewType: 'CardView',
        title: 'Bg test',
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
        visibility: 'visible',
        isDefault: false,
        disableFutureDate: true,
        minDays: '2',
        maxDays: null,
        isDeletable: false,
        orderId: 1
      },
      Test: {
        id: 'Test',
        viewType: 'EditText',
        title: 'Test',
        fieldName: 'Test',
        family: 'labTest',
        isMandatory: true,
        isEnabled: true,
        isResult: true,
        visibility: 'visible',
        hint: '',
        errorMessage: '',
        inputType: 2,
        isDefault: false,
        orderId: 2,
        code: '234',
        url: '',
        resource: 'Quantity',
        minValue: null,
        maxValue: null,
        unitList: [
          {
            name: 'mmol/mol',
            id: 'mmol/mol'
          }
        ],
        ranges: [
          {
            unitType: 'mmol/mol',
            gender: 'Male',
            minRange: 2,
            maxRange: 4,
            displayRange: '2'
          },
          {
            unitType: 'mmol/mol',
            gender: 'Female',
            minRange: 1,
            maxRange: 2,
            displayRange: '3'
          }
        ],
        condition: [
          {
            targetId: 'Test',
            conditionType: 'EQUALS',
            value: '2024-10-10'
          }
        ],
        targetViews: [
          {
            Test: {}
          }
        ]
      }
    }
  },
  setFormMeta: mockSetFormMeta,
  targetIds: [],
  onSubmit: mockOnSubmit,
  onCancel: mockOnCancel,
  setEditGroupedFieldsOrder: mockSetEditGroupedFieldsOrder,
  presentableJson: jest.fn(),
  collapsedGroup: { labTest: true },
  setCollapsedGroup: mockSetCollapsedGroup,
  addedFields: [],
  allowedFields: [],
  hashFieldIdsWithTitle: {},
  hashFieldIdsWithFieldName: {},
  culture: {},
  accordianRef: { current: {} },
  newlyAddedIdsRef: [],
  addNewFieldDisabled: false,
  isFieldNameChangable: true,
  isShow: true,
  sethashFieldIdsWithFieldName: jest.fn()
};

describe('AccordianView', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Labtest Customization', () => {
    it('renders AccordianView without errors', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );
      expect(getByTestId('accordian-view')).toBeInTheDocument();
    });

    it('renders AccordianHeader with correct title', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );
      expect(screen.getByText('Bg test')).toBeInTheDocument();
    });

    it('renders Add New Field button when isShow is true', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );
      expect(screen.getByText('Add New Field')).toBeInTheDocument();
    });

    it('does not render Add New Field button when isShow is false', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} isShow={false} />
          </BrowserRouter>
        </Provider>
      );
      expect(screen.queryByText('Add New Field')).not.toBeInTheDocument();
    });

    it('renders Edit Order button', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );
      expect(screen.getByText('Edit Order')).toBeInTheDocument();
    });

    it('calls onCancel when Cancel button is clicked', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('disables Add New Field button when addNewFieldDisabled is true', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} addNewFieldDisabled={true} />
          </BrowserRouter>
        </Provider>
      );

      const addNewFieldButton = screen.getByText('Add New Field').closest('button');
      expect(addNewFieldButton).toBeDisabled();
    });

    it('renders workflow customization fields when isWorkFlowCustomization is true', () => {
      const workflowProps = {
        ...defaultProps,
        isWorkFlowCustomization: true
      };

      const { getByTestId } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...workflowProps} />
          </BrowserRouter>
        </Provider>
      );

      expect(getByTestId('accordian-view')).toBeInTheDocument();
    });

    it('handles form submission with invalid data', () => {
      const invalidProps = {
        ...defaultProps,
        formRef: {
          current: {
            getState: () => ({
              values: {},
              valid: false,
              errors: {
                labTest: {
                  TestedOn: { code: 'Please enter the code' }
                }
              }
            })
          }
        }
      };

      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...invalidProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(screen.getByText('Submit'));
    });

    it('toggles accordian sections', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );

      const accordianHeader = screen.getByText('Bg test');
      fireEvent.click(accordianHeader);

      expect(mockSetCollapsedGroup).toHaveBeenCalled();
    });

    it('handles workflow customization fields', () => {
      const workflowProps = {
        ...defaultProps,
        isWorkFlowCustomization: true
      };

      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...workflowProps} />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByTestId('accordian-view')).toBeInTheDocument();
    });

    it('should handle addNewFieldFn by adding new field', () => {
      const { getByTestId, getByRole } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByRole('button', { name: 'Text' }));
      expect(getByTestId('accordian-view')).toBeInTheDocument();
    });

    it('should scroll to newly added field with isWorkFlowCustomization as true', () => {
      const mockAccordianRef = {
        current: {
          labTest: document.createElement('div')
        }
      };

      const propsWithRef = {
        ...defaultProps,
        accordianRef: mockAccordianRef,
        isWorkFlowCustomization: true
      };

      const { getByRole } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...propsWithRef} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(getByRole('button', { name: 'Text Input' }));

      waitFor(() => {
        expect(mockAccordianRef.current.labTest.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'end'
        });
      });
    });

    it(`should handle the delete button click with isCustomizationForm as false
      and isWorkFlowCustomization as false`, () => {
      const localProps = {
        ...defaultProps,
        isCustomizationForm: false,
        isWorkFlowCustomization: false
      };
      const { getByTestId, unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByTestId('delete-field-icon'));
      unmount();
    });

    it('should handle the delete button click with isCustomizationForm as false and isWorkFlowCustomization as true with', () => {
      const localProps = {
        ...defaultProps,
        formMeta: {
          workflow: {
            workflow: {
              id: 'workflow',
              viewType: 'CardView',
              title: 'Workflow test',
              familyOrder: 0,
              isCustomWorkflow: true
            },
            Name: {
              id: 'Name',
              viewType: 'EditText',
              title: 'Name',
              fieldName: 'Name',
              family: 'workflow',
              isSummary: false,
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              condition: [],
              hint: 'enter a name',
              errorMessage: '',
              inputType: -1,
              isNotDefault: true,
              minLength: '2',
              maxLength: '10',
              orderId: 1
            }
          }
        },
        isCustomizationForm: false,
        isWorkFlowCustomization: true
      };
      const { getByTestId, unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByTestId('delete-field-icon'));
      unmount();
    });

    it('should handle the update field name', () => {
      const { unmount, getByLabelText } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...defaultProps} />
          </BrowserRouter>
        </Provider>
      );
      const input = getByLabelText('labTest.Test.title');
      fireEvent.change(input, { target: { value: 'New Name' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('New Name');
      unmount();
    });

    it('should handle submit with code exists but url is missing', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '123',
                url: ''
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '234',
              url: ''
            }
          ]
        }
      });

      const props = {
        ...defaultProps,
        formRef: {
          current: {
            getState: () => ({
              values: {
                labTest: {
                  Test: {
                    code: '123',
                    url: ''
                  }
                }
              },
              errors: {}
            })
          }
        }
      };

      render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...props} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(screen.getByText('Submit'));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle submit with url exists but code is missing', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '',
                url: 'www.example.com'
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '',
              url: 'www.example.com'
            }
          ]
        }
      });

      const localProps = {
        ...defaultProps,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              code: '',
              url: 'www.example.com'
            }
          }
        }
      };

      render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(screen.getByText('Submit'));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle submit with code and url exists but code is invalid', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '123.456',
                url: 'www.example.com'
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '123.456',
              url: 'www.example.com'
            }
          ]
        }
      });

      const localProps = {
        ...defaultProps,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              code: '123.456',
              url: 'www.example.com'
            }
          }
        }
      };

      render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(screen.getByText('Submit'));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('handles form submission with valid data', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '123456',
                url: 'www.example.com'
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '123456',
              url: 'www.example.com'
            }
          ]
        }
      });

      const localProps = {
        ...defaultProps,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              code: '123456',
              url: 'www.example.com'
            }
          }
        }
      };
      const { getByText } = render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(getByText('Submit'));
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should handle custom new condition add errors as newErrors', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '123456',
                url: 'www.example.com'
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '123456',
              url: 'www.example.com'
            }
          ]
        }
      });

      const localProps = {
        ...defaultProps,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              code: '123456',
              url: 'www.example.com'
            }
          }
        }
      };
      const { getByText, getByTestId } = render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(getByTestId('add-new-range-plus-icon'));

      fireEvent.click(getByText('Submit'));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle edit order button click', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '123456',
                url: 'www.example.com'
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '123456',
              url: 'www.example.com'
            }
          ]
        }
      });

      const localProps = {
        ...defaultProps,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              code: '123456',
              url: 'www.example.com'
            }
          }
        }
      };
      const { getByLabelText } = render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      const editOrderBtn = getByLabelText('edit-field-order');
      fireEvent.click(editOrderBtn);
    });

    it('correctly computes unAddedFields based on allowedFields and addedFields', () => {
      const allowedFields = [
        { key: 'field1', label: 'Field 1' },
        { key: 'field3', label: 'Field 3' },
        { key: 'field2', label: 'Field 2' }
      ];
      const addedFields = ['field1', 'field3'];

      const props = {
        ...defaultProps,
        allowedFields,
        addedFields,
        formMeta: { ...defaultProps.formMeta, labTest: { ...defaultProps.formMeta.labTest } }
      };

      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...props} />
          </BrowserRouter>
        </Provider>
      );

      // Check if the component logic correctly filters out 'field1' and 'field3'
      expect(screen.queryByText('Field 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Field 3')).not.toBeInTheDocument();
    });

    it('toggles accordian sections with error', () => {
      const localStore = mockStore({
        ...initialState,
        labTestCustomizationData: {
          ...initialState.labtest.labTestCustomizationData,
          formInput: {
            formLayout: [
              ...initialState.labtest.labTestCustomizationData.formInput.formLayout,
              {
                ...initialState.labtest.labTestCustomizationData.formInput.formLayout[2],
                code: '123456',
                url: 'www.example.com'
              }
            ]
          }
        },
        labtestJson: {
          formLayout: [
            ...initialState.labtest.labtestJson.formLayout,
            {
              ...initialState.labtest.labtestJson.formLayout[2],
              code: '123456',
              url: 'www.example.com'
            }
          ]
        }
      });

      const localProps = {
        ...defaultProps,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              code: '123456',
              url: 'www.example.com'
            }
          }
        }
      };
      const { getByText, getByTestId } = render(
        <Provider store={localStore}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );

      fireEvent.click(getByTestId('add-new-range-plus-icon'));

      fireEvent.click(getByText('Submit'));
      expect(mockOnSubmit).not.toHaveBeenCalled();

      const accordianHeader = screen.getByText('Bg test');
      fireEvent.click(accordianHeader);

      expect(mockSetCollapsedGroup).toHaveBeenCalled();
    });

    it('should handle the delete button click with new field added with isFieldNameChangable as true and condition fields', () => {
      const { getByTestId, unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView
              {...defaultProps}
              newlyAddedIdsRef={['Test']}
              isFieldNameChangable={true}
              hashFieldIdsWithFieldName={{ Test: {} }}
              hashFieldIdsWithTitle={{ Test: 'Test' }}
            />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByTestId('add-new-range-plus-icon'));
      fireEvent.click(getByTestId('delete-field-icon'));
      unmount();
    });

    it('should handle the delete button click with new field added with isFieldNameChangable as false and different condition fields to make branch coverage', () => {
      const localProps = {
        ...defaultProps,
        isFieldNameChangable: false,
        formMeta: {
          labTest: {
            ...defaultProps.formMeta.labTest,
            Test: {
              ...defaultProps.formMeta.labTest.Test,
              condition: [
                {
                  targetId: 'Test',
                  conditionType: 'EQUALS',
                  value: '2024-10-10'
                },
                {
                  targetId: 'TestedOn',
                  conditionType: 'EQUALS',
                  value: '2024-10-10'
                }
              ],
              targetViews: [
                {
                  TestedOn: {}
                }
              ]
            }
          }
        }
      };
      const { getByTestId, unmount } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView
              {...localProps}
              newlyAddedIdsRef={['Test']}
              isFieldNameChangable={false}
              hashFieldIdsWithFieldName={{ Test: {} }}
              hashFieldIdsWithTitle={{ Test: 'Test' }}
            />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByTestId('add-new-range-plus-icon'));
      fireEvent.click(getByTestId('delete-field-icon'));
      unmount();
    });

    it('should handle the add new field and update field firstName with isFieldNameChangable as true with hashFieldIdsWithFieldName and without hashFieldIdsWithTitle', () => {
      const localProps = {
        ...defaultProps,
        formMeta: {
          ...defaultProps.formMeta,
          labTest: {
            ...defaultProps.formMeta.labTest,
            NewField: {
              id: 'NewField',
              viewType: 'Spinner',
              title: '',
              fieldName: '',
              family: 'labTest',
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              hint: '',
              optionsList: [],
              errorMessage: '',
              isDefault: false,
              isResult: true,
              orderId: 3,
              code: null,
              url: null,
              resource: null,
              condition: null
            }
          }
        },
        targetIds: [
          {
            key: 'TestedOn',
            label: 'Tested  On'
          },
          {
            key: 'Test',
            label: 'Test'
          }
        ],
        isFieldNameChangable: true,
        newlyAddedIdsRef: ['NewField'],
        hashFieldIdsWithFieldName: { NewField: {} },
        hashFieldIdsWithTitle: {}
      };
      const { getByLabelText, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByLabelText('add-new-field'));
      const button = container.querySelector('button.dropdown-item');
      fireEvent.click(button!);
      expect(mockSetFormMeta).toHaveBeenCalled();

      const input = getByLabelText('labTest.NewField.fieldName');
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('Test');
    });

    it('should handle the add new field and update field firstName with isFieldNameChangable as true without hashFieldIdsWithFieldName and with hashFieldIdsWithTitle', () => {
      const localProps = {
        ...defaultProps,
        formMeta: {
          ...defaultProps.formMeta,
          labTest: {
            ...defaultProps.formMeta.labTest,
            NewField: {
              id: 'NewField',
              viewType: 'Spinner',
              title: '',
              fieldName: '',
              family: 'labTest',
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              hint: '',
              optionsList: [],
              errorMessage: '',
              isDefault: false,
              isResult: true,
              orderId: 3,
              code: null,
              url: null,
              resource: null,
              condition: null
            }
          }
        },
        targetIds: [
          {
            key: 'TestedOn',
            label: 'Tested  On'
          },
          {
            key: 'Test',
            label: 'Test'
          }
        ],
        isFieldNameChangable: true,
        newlyAddedIdsRef: ['NewField'],
        hashFieldIdsWithTitle: { NewField: 'NewField' }
      };
      const { getByLabelText, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByLabelText('add-new-field'));
      const button = container.querySelector('button.dropdown-item');
      fireEvent.click(button!);
      expect(mockSetFormMeta).toHaveBeenCalled();

      const input = getByLabelText('labTest.NewField.fieldName');
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('Test');
    });

    it('should set error when error is defined', () => {
      const mockState: any = {
        fields: {
          'labTest.Test.url': {
            data: {
              customError: 'Test error'
            }
          }
        },
        formState: {
          errors: {}
        }
      };

      const props = {
        ...defaultProps,
        formRef: {
          current: {
            mutators: {
              setError: ([fieldName, error]: any, state: any) => {
                if (error !== undefined) {
                  const { fields } = state;
                  const field = fields[fieldName];
                  field.data.customError = error;
                  field.touched = true;
                  state.formState.errors[fieldName] = error;
                } else {
                  delete state.formState.errors[fieldName];
                }
              }
            }
          }
        }
      };

      render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...props} />
          </BrowserRouter>
        </Provider>
      );

      props.formRef.current.mutators.setError('labTest.Test.url', mockState);

      expect(mockState.fields['labTest.Test.url'].data.customError).toBe('Test error');
    });

    it('render no family', () => {
      const localProps = {
        ...defaultProps,
        formMeta: {
          [APPCONSTANTS.NO_FAMILY]: {}
        }
      };
      const { getByTestId } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      expect(getByTestId('accordian-view')).toBeInTheDocument();
    });
  });

  describe('Customization Form', () => {
    const customizationProps = {
      ...defaultProps,
      formMeta: {
        workflow: {
          workflow: {
            id: 'workflow',
            viewType: 'CardView',
            title: 'Workflow test',
            familyOrder: 0,
            isCustomWorkflow: true
          },
          Name: {
            id: 'Name',
            viewType: 'EditText',
            title: 'Name',
            fieldName: 'Name',
            family: 'workflow',
            isSummary: false,
            isMandatory: false,
            isEnabled: true,
            visibility: 'visible',
            condition: [],
            hint: 'enter a name',
            errorMessage: '',
            inputType: -1,
            isNotDefault: true,
            minLength: '2',
            maxLength: '10',
            orderId: 1
          }
        }
      },
      collapsedGroup: { workflow: true },
      isCustomizationForm: true
    };
    const customizationStore = mockStore({
      ...initialState,
      workflow: {
        formJSON: {
          id: 50,
          createdBy: 2,
          updatedBy: 2,
          createdAt: '2024-10-17T15:57:17+05:30',
          updatedAt: '2024-10-17T15:57:17+05:30',
          tenantId: 32,
          type: 'Module',
          category: 'Input_form',
          formInput:
            '{"time":1729160900994,"formLayout":[{"id":"workflow","viewType":"CardView","title":"Workflow test","familyOrder":0,"isCustomWorkflow":true},{"id":"Name","viewType":"EditText","title":"Name","fieldName":"Name","family":"workflow","isSummary":false,"isMandatory":false,"isEnabled":true,"visibility":"visible","condition":[],"hint":"enter a name","errorMessage":"","inputType":-1,"isNotDefault":true,"minLength":"2","maxLength":"10","orderId":1}]}',
          countryId: 4,
          clinicalWorkflowId: 74,
          districtId: null,
          active: true,
          deleted: false,
          form_input: {
            formLayout: [
              {
                id: 'workflow',
                viewType: 'CardView',
                title: 'Workflow test',
                familyOrder: 0,
                isCustomWorkflow: true
              },
              {
                id: 'Name',
                viewType: 'EditText',
                title: 'Name',
                fieldName: 'Name',
                family: 'workflow',
                isSummary: false,
                isMandatory: false,
                isEnabled: true,
                visibility: 'visible',
                condition: [],
                hint: 'enter a name',
                errorMessage: '',
                inputType: -1,
                isNotDefault: true,
                minLength: '2',
                maxLength: '10',
                orderId: 1
              }
            ]
          }
        }
      }
    });
    it('renders customization form fields when isCustomizationForm is true', () => {
      const { getByTestId } = render(
        <Provider store={customizationStore}>
          <BrowserRouter>
            <AccordianView {...customizationProps} />
          </BrowserRouter>
        </Provider>
      );

      expect(getByTestId('accordian-view')).toBeInTheDocument();
    });

    it(`should handle the add new field and update field firstName for customization form
      with field name as firstName`, () => {
      const localProps = {
        ...customizationProps,
        formMeta: {
          ...customizationProps.formMeta,
          workflow: {
            ...customizationProps.formMeta.workflow,
            NewField: {
              id: 'NewField',
              viewType: 'Spinner',
              title: '',
              fieldName: '',
              family: 'workflow',
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              hint: '',
              optionsList: [],
              errorMessage: '',
              isDefault: false,
              isResult: true,
              orderId: 3,
              code: null,
              url: null,
              resource: null,
              condition: []
            }
          }
        },
        targetIds: [
          {
            key: 'TestedOn',
            label: 'Tested  On'
          },
          {
            key: 'Test',
            label: 'Test'
          }
        ],
        isFieldNameChangable: true
      };
      const { getByLabelText, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByLabelText('add-new-field'));
      const button = container.querySelector('button.dropdown-item');
      fireEvent.click(button!);
      expect(mockSetFormMeta).toHaveBeenCalled();

      const input = getByLabelText('workflow.NewField.fieldName');
      fireEvent.change(input, { target: { value: 'firstName' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('firstName');
    });

    it(`should handle the add new field and update field firstName for customization form
      with field name as FirstName and isEditable as true`, () => {
      const localProps = {
        ...customizationProps,
        formMeta: {
          ...customizationProps.formMeta,
          workflow: {
            ...customizationProps.formMeta.workflow,
            NewField: {
              id: 'NewField',
              viewType: 'Spinner',
              title: '',
              fieldName: '',
              family: 'workflow',
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              hint: '',
              optionsList: [],
              errorMessage: '',
              isDefault: false,
              isResult: true,
              orderId: 3,
              code: null,
              url: null,
              resource: null,
              condition: [],
              isEditable: true
            }
          }
        },
        targetIds: [
          {
            key: 'TestedOn',
            label: 'Tested  On'
          },
          {
            key: 'Test',
            label: 'Test'
          }
        ],
        isFieldNameChangable: true
      };
      const { getByLabelText, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByLabelText('add-new-field'));
      const button = container.querySelector('button.dropdown-item');
      fireEvent.click(button!);
      expect(mockSetFormMeta).toHaveBeenCalled();

      const input = getByLabelText('workflow.NewField.fieldName');
      fireEvent.change(input, { target: { value: 'FirstName' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('FirstName');
    });

    it(`should handle the add new field and update field firstName for customization form
      with field name as glucose`, () => {
      const localProps = {
        ...customizationProps,
        formMeta: {
          ...customizationProps.formMeta,
          workflow: {
            ...customizationProps.formMeta.workflow,
            NewField: {
              id: 'NewField',
              viewType: 'Spinner',
              title: '',
              fieldName: '',
              family: 'workflow',
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              hint: '',
              optionsList: [],
              errorMessage: '',
              isDefault: false,
              isResult: true,
              orderId: 3,
              code: null,
              url: null,
              resource: null,
              condition: []
            }
          }
        },
        targetIds: [
          {
            key: 'TestedOn',
            label: 'Tested  On'
          },
          {
            key: 'Test',
            label: 'Test'
          }
        ],
        isFieldNameChangable: true
      };
      const { getByLabelText, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByLabelText('add-new-field'));
      const button = container.querySelector('button.dropdown-item');
      fireEvent.click(button!);
      expect(mockSetFormMeta).toHaveBeenCalled();

      const input = getByLabelText('workflow.NewField.fieldName');
      fireEvent.change(input, { target: { value: 'glucose' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('glucose');
    });

    it('should handle the add new field and update field firstName for customization form with field name as Glucose and unitMeasurement value', () => {
      const localProps = {
        ...customizationProps,
        formMeta: {
          ...customizationProps.formMeta,
          workflow: {
            ...customizationProps.formMeta.workflow,
            NewField: {
              id: 'NewField',
              viewType: 'Spinner',
              title: '',
              fieldName: '',
              family: 'workflow',
              isMandatory: false,
              isEnabled: true,
              visibility: 'visible',
              hint: '',
              optionsList: [],
              errorMessage: '',
              isDefault: false,
              isResult: true,
              orderId: 3,
              code: null,
              url: null,
              resource: null,
              condition: [],
              unitMeasurement: []
            }
          }
        },
        targetIds: [
          {
            key: 'TestedOn',
            label: 'Tested  On'
          },
          {
            key: 'Test',
            label: 'Test'
          }
        ],
        isFieldNameChangable: true
      };
      const { getByLabelText, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <AccordianView {...localProps} />
          </BrowserRouter>
        </Provider>
      );
      fireEvent.click(getByLabelText('add-new-field'));
      const button = container.querySelector('button.dropdown-item');
      fireEvent.click(button!);
      expect(mockSetFormMeta).toHaveBeenCalled();

      const input = getByLabelText('workflow.NewField.fieldName');
      fireEvent.change(input, { target: { value: 'Glucose' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('Glucose');
    });
  });
});
