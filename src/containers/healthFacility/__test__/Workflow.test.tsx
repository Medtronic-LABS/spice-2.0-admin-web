import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Workflows from '../Workflows';
import APPCONSTANTS from '../../../constants/appConstants';
import { IWorkflow } from '../../../store/healthFacility/types';
import { FormApi, FormState } from 'final-form';

// Mocking Checkbox Component
jest.mock('../../../components/formFields/Checkbox', () => ({
  __esModule: true,
  default: ({ label, ...props }: { label: string }) => (
    <label>
      <input type='checkbox' {...props} /> {label}
    </label>
  )
}));

// Create a mock store
const mockStore = configureStore([]);

// Mocking a form state to match FormState type
const mockFormState: FormState<any, Partial<any>> = {
  active: undefined,
  dirty: false,
  dirtyFields: {},
  dirtyFieldsSinceLastSubmit: {},
  dirtySinceLastSubmit: false,
  error: undefined,
  errors: {},
  hasSubmitErrors: false,
  hasValidationErrors: false,
  initialValues: {},
  invalid: false,
  modified: {},
  modifiedSinceLastSubmit: false,
  pristine: true,
  submitError: undefined,
  submitErrors: {},
  submitFailed: false,
  submitSucceeded: false,
  submitting: false,
  touched: {},
  valid: true,
  validating: false,
  values: {
    healthFacility: {
      workflows: []
    }
  },
  visited: {}
};

// Mocking FormApi
const mockFormApi: Partial<FormApi<any, Partial<any>>> = {
  getState: jest.fn(() => mockFormState)
};

// Helper function to render the component with store
const renderWithStore = (store: any, form: FormApi<any, Partial<any>>, formName: string) =>
  render(
    <Provider store={store}>
      <Workflows form={form} formName={formName} />
    </Provider>
  );

describe('Workflows Component', () => {
  let store: any;
  const workflows: IWorkflow[] = [
    { id: '1', name: 'Blood Test', moduleType: APPCONSTANTS.WORKFLOW_MODULE.clinical, appTypes: ['COMMUNITY'] },
    { id: '2', name: 'X-Ray', moduleType: APPCONSTANTS.WORKFLOW_MODULE.clinical, appTypes: ['NON_COMMUNITY'] },
    { id: '3', name: 'Custom Task', moduleType: APPCONSTANTS.WORKFLOW_MODULE.customized, appTypes: ['COMMUNITY'] }
  ];

  beforeEach(() => {
    store = mockStore({
      healthFacility: {
        workflowList: workflows,
        workflowLoading: false
      }
    });
  });

  it('should render clinical workflows', () => {
    renderWithStore(store, mockFormApi as FormApi<any, Partial<any>>, 'testForm');

    // Check if the clinical workflows are rendered
    const clinicalWorkflowTitle = screen.getByText(APPCONSTANTS.CLINICAL_WORKFLOW);
    expect(clinicalWorkflowTitle).toBeInTheDocument();
  });

  it('should show error message when no clinical workflow is selected', () => {
    // Mock form state to trigger error
    mockFormApi.getState = jest.fn(() => ({
      ...mockFormState,
      values: {
        healthFacility: {
          workflows: [] // No workflows selected
        }
      }
    }));

    renderWithStore(store, mockFormApi as FormApi<any, Partial<any>>, 'testForm');

    const errorMessage = screen.getByText('Please select a clinical workflow');
    expect(errorMessage).toBeInTheDocument();
  });
});
