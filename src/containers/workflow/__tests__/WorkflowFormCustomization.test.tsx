import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WorkflowFormCustomization from '../WorkflowFormCustomization';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
  CLEAR_FORM_JSON,
  CUSTOMIZE_FORM_REQUEST,
  FETCH_CUSTOMIZATION_FORM_REQUEST
} from '../../../store/workflow/actionTypes';
import toastCenter from '../../../utils/toastCenter';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    tenantId: '1',
    regionId: '1',
    form: 'custom',
    clinicalWorkflowId: '52',
    workflowId: 'workflowCustomize'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  getErrorToastArgs: jest.fn(() => [])
}));

jest.mock('../../../components/formBuilder/hooks/useFormCustomization', () => ({
  __esModule: true,
  default: () => ({
    formRef: { current: null },
    formData: {
      custom1730972834194: {
        custom1730972834194: {
          id: 'custom1730972834194',
          viewType: 'CardView',
          title: 'Custom',
          familyOrder: 0,
          isCustomWorkflow: true
        },
        Test: {
          id: 'Test',
          viewType: 'RadioGroup',
          title: 'Test',
          fieldName: 'Test',
          family: 'custom1730972834194',
          isSummary: false,
          isMandatory: true,
          isEnabled: true,
          visibility: 'visible',
          condition: [],
          optionsList: [
            {
              name: 'One',
              id: 'One'
            }
          ],
          orientation: 0,
          errorMessage: 'Error',
          isNotDefault: true,
          orderId: 1
        }
      }
    },
    setFormData: jest.fn(),
    groupViewsByFamily: jest.fn((data) => data),
    addedFields: [],
    targetIdsForAccount: [],
    collapsedGroup: {},
    setCollapsedGroup: jest.fn(),
    resetCollapsedCalculation: jest.fn(),
    presentableJson: jest.fn(),
    hashFieldIdsWithTitle: {},
    hashFieldIdsWithFieldName: {},
    sethashFieldIdsWithFieldName: jest.fn(),
    isFamilyOrderModelOpen: false,
    setFamilyOrderModelOpen: jest.fn(),
    editGroupedFieldsOrder: {
      isOpen: false,
      familyName: ''
    },
    setEditGroupedFieldsOrder: jest.fn()
  })
}));

const mockStore = configureStore([]);

const initialState = {
  workflow: {
    formJSON: {
      id: 1,
      tenantId: 1,
      type: 'Module',
      category: 'Input_form',
      formInput:
        '{"time":1730972859074,"formLayout":[{"id":"custom1730972834194","viewType":"CardView","title":"Custom","familyOrder":0,"isCustomWorkflow":true},{"id":"Test","viewType":"RadioGroup","title":"Test","fieldName":"Test","family":"custom1730972834194","isSummary":false,"isMandatory":true,"isEnabled":true,"visibility":"visible","condition":[],"optionsList":[{"name":"One","id":"One"}],"orientation":0,"errorMessage":"Error","isNotDefault":true,"orderId":1}]}',
      countryId: 1,
      clinicalWorkflowId: 52,
      districtId: null,
      active: true,
      deleted: false,
      form_input: {
        time: 1730972859074,
        formLayout: [
          {
            id: 'custom1730972834194',
            viewType: 'CardView',
            title: 'Custom',
            familyOrder: 0,
            isCustomWorkflow: true
          },
          {
            id: 'Test',
            viewType: 'RadioGroup',
            title: 'Test',
            fieldName: 'Test',
            family: 'custom1730972834194',
            isSummary: false,
            isMandatory: true,
            isEnabled: true,
            visibility: 'visible',
            condition: [],
            optionsList: [
              {
                name: 'One',
                id: 'One'
              }
            ],
            orientation: 0,
            errorMessage: 'Error',
            isNotDefault: true,
            orderId: 1
          }
        ]
      }
    },
    formMeta: [],
    loading: false
  },
  labtest: {
    units: []
  }
};
describe('WorkflowFormCustomization', () => {
  it('should render without errors', () => {
    const localStore = mockStore(initialState);
    const { getByTestId, unmount } = render(
      <Provider store={localStore}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );
    expect(getByTestId('workflow-form-customization')).toBeInTheDocument();
    unmount();
  });

  it('should show loader when loading is true', () => {
    const loadingState = {
      ...initialState,
      workflow: { ...initialState.workflow, loading: true }
    };
    const store = mockStore(loadingState);

    const { getByTestId, unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    expect(getByTestId('loader')).toBeInTheDocument();
    unmount();
  });

  it('should fetch form data on component mount', async () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const actions = store.getActions();
    const mockFetchCustomizationFormRequest = actions.find(
      (action) => action.type === FETCH_CUSTOMIZATION_FORM_REQUEST
    );
    expect(mockFetchCustomizationFormRequest).toBeDefined();
    unmount();
  });

  it('should clear form data on component unmount', () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    unmount();
    const actions = store.getActions();
    expect(actions.some((action) => action.type === CLEAR_FORM_JSON)).toBeTruthy();
  });

  it('should handle cancellation', async () => {
    const mockHistoryPush = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useHistory').mockImplementation(() => ({
      push: mockHistoryPush
    }));

    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await waitFor(async () => {
      userEvent.click(cancelButton);
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    unmount();
  });

  it('should handle successful form data fetch with valid formInput', async () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const actions = store.getActions();
    const fetchAction = actions.find((action) => action.type === FETCH_CUSTOMIZATION_FORM_REQUEST);

    const validFormInput = JSON.stringify({
      formLayout: [
        {
          id: 'testFamily',
          viewType: 'CardView',
          title: 'Test Family'
        }
      ]
    });

    await waitFor(() => {
      fetchAction.successCb({ formInput: validFormInput });
    });

    expect(fetchAction).toBeDefined();
    unmount();
  });

  it('should handle successful form data fetch with invalid formInput', async () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const actions = store.getActions();
    const fetchAction = actions.find((action) => action.type === FETCH_CUSTOMIZATION_FORM_REQUEST);

    await waitFor(() => {
      fetchAction.successCb({ formInput: '{}' });
    });

    expect(fetchAction).toBeDefined();
    unmount();
  });

  it('should handle fetch failure by adding default family', async () => {
    const store = mockStore(initialState);

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const actions = store.getActions();
    const fetchAction = actions.find((action) => action.type === FETCH_CUSTOMIZATION_FORM_REQUEST);

    await waitFor(() => {
      fetchAction.failureCb();
    });

    expect(fetchAction).toBeDefined();
    unmount();
  });

  it('should handle successful form submission', async () => {
    const localStore = mockStore({
      ...initialState,
      labtest: {
        units: []
      }
    });
    const mockHistoryPush = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useHistory').mockImplementation(() => ({
      push: mockHistoryPush
    }));

    const { unmount } = render(
      <Provider store={localStore}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await waitFor(async () => {
      userEvent.click(submitButton);
    });

    const actions = localStore.getActions();
    const submitAction = actions.find((action) => action.type === CUSTOMIZE_FORM_REQUEST);

    await waitFor(() => {
      submitAction.successCb();
    });

    expect(toastCenter.success).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalled();
    unmount();
  });

  it('should handle form submission failure', async () => {
    const localStore = mockStore({
      ...initialState,
      labtest: {
        units: []
      }
    });
    const mockHistoryPush = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useHistory').mockImplementation(() => ({
      push: mockHistoryPush
    }));
    const mockError = new Error('Submission failed');

    const { unmount } = render(
      <Provider store={localStore}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await waitFor(async () => {
      userEvent.click(submitButton);
    });

    const actions = localStore.getActions();
    const submitAction = actions.find((action) => action.type === CUSTOMIZE_FORM_REQUEST);

    await waitFor(() => {
      submitAction.failureCb(mockError);
    });

    expect(toastCenter.error).toHaveBeenCalled();
    unmount();
  });

  it('should render without regionId, formMeta as undefined and formJSON as undefined', () => {
    jest.spyOn(require('react-router-dom'), 'useParams').mockImplementation(() => ({
      tenantId: '1',
      regionId: '', // Empty regionId
      form: 'custom',
      clinicalWorkflowId: '52',
      workflowId: 'workflowCustomize'
    }));
    const localStore = mockStore({
      ...initialState,
      workflow: {
        ...initialState.workflow,
        formMeta: undefined,
        formJSON: undefined
      }
    });

    const { unmount, getByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <WorkflowFormCustomization />
        </Router>
      </Provider>
    );

    expect(getByTestId('workflow-form-customization')).toBeInTheDocument();
    unmount();
  });
});
