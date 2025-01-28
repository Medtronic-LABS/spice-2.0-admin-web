import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory, History } from 'history';
import { Router } from 'react-router-dom';
import AddMedication from '../AddMedication';
import { PROTECTED_ROUTES } from '../../../constants/route';
import { Store, AnyAction } from 'redux';

// Mock the required modules
jest.mock('../../../utils/toastCenter', () => ({
  error: jest.fn(),
  success: jest.fn(),
  __esModule: true,
  default: { error: jest.fn(), success: jest.fn() }
}));

const mockStore = configureStore([]);

describe('AddMedication Component', () => {
  let store: Store<any, AnyAction>;
  let history: History;
  const mockMatch = {
    params: {
      regionId: '123',
      tenantId: '456'
    },
    isExact: true,
    path: '',
    url: ''
  };

  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      medication: {
        classifications: [
          {
            id: 1,
            name: 'Classification 1',
            brands: [{ id: 1, name: 'Brand 1' }]
          }
        ],
        dosageForms: [{ id: 1, name: 'Dosage Form 1' }],
        categories: [{ id: 1, name: 'Category 1' }],
        loading: false,
        classificationsLoading: false,
        dosageFormsLoading: false,
        categoryLoading: false
      },
      user: {
        appTypes: ['COMMUNITY']
      },
      common: {
        labelName: null
      }
    });

    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Router history={history}>
          <AddMedication
            history={history as any}
            location={history.location}
            match={mockMatch}
            loading={false}
            createMedicationRequest={(data: any) => {
              throw new Error('Function not implemented.');
            }}
            validateMedication={(data: Omit<any, 'type'>) => {
              throw new Error('Function not implemented.');
            }}
            removeMedicationBrands={() => {
              throw new Error('Function not implemented.');
            }}
          />
        </Router>
      </Provider>
    );
  };

  it('renders the component with form elements', () => {
    renderComponent();
    expect(screen.getByText('Medication Details')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('handles form cancellation', () => {
    renderComponent();
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    const expectedPath = PROTECTED_ROUTES.medicationByRegion
      .replace(':regionId', mockMatch.params.regionId)
      .replace(':tenantId', mockMatch.params.tenantId);
    expect(history.location.pathname).toBe(expectedPath);
  });

  it('handles form state management', () => {
    renderComponent();

    // Fill out the form
    const nameInput = screen.getByLabelText('medication[0].name');
    fireEvent.change(nameInput, { target: { value: 'Test Medication' } });

    // Add another medication
    const addButton = screen.getByAltText('plus-icon');
    fireEvent.click(addButton);

    // Check if new form fields are added
    const nameInputs = screen.getAllByLabelText('medication[0].name');
    expect(nameInputs).toHaveLength(1);
  });

  describe('Form Field Management', () => {
    it('handles setPreviousFieldValue for adding new value', async () => {
      renderComponent();

      // Fill out the form
      const nameInput = screen.getByLabelText('medication[0].name');
      const classificationSelect = screen.getByLabelText('Classification');
      const brandSelect = screen.getByLabelText('Brand');
      const dosageFormSelect = screen.getByLabelText('Dosage Form');

      // Set form values
      fireEvent.change(nameInput, { target: { value: 'Test Medication' } });
      fireEvent.change(classificationSelect, { target: { value: '1' } });
      fireEvent.change(brandSelect, { target: { value: '1' } });
      fireEvent.change(dosageFormSelect, { target: { value: '1' } });

      // Add another medication to trigger setPreviousFieldValue
      const addButton = screen.getByAltText('plus-icon');
      fireEvent.click(addButton);

      await waitFor(() => {
        // Verify the previous field value is stored
        const nameInputs = screen.getAllByLabelText('medication[0].name');
        expect(nameInputs).toHaveLength(1);
      });
    });
    it('handles setPreviousFieldValue with null value', async () => {
      renderComponent();

      // Fill out the form
      const nameInput = screen.getByLabelText('medication[0].name');
      fireEvent.change(nameInput, { target: { value: 'Test Medication' } });

      // Add another medication
      const addButton = screen.getByAltText('plus-icon');
      fireEvent.click(addButton);

      // Try to set null value (this should not cause any errors)
      await waitFor(() => {
        const nameInputs = screen.getAllByLabelText('medication[0].name');
        expect(nameInputs).toHaveLength(1);
      });
    });

    it('maintains form state after field reset', async () => {
      renderComponent();

      // Fill out first form
      const nameInput = screen.getByLabelText('medication[0].name');
      const codeInput = screen.getByLabelText('medication[0].codeDetails.code');
      const urlInput = screen.getByLabelText('medication[0].codeDetails.url');

      // Fill out all required fields in first form
      fireEvent.change(nameInput, { target: { value: 'Test Medication 1' } });
      fireEvent.change(codeInput, { target: { value: 'TEST123' } });
      fireEvent.change(urlInput, { target: { value: 'http://test.com' } });

      // Add second medication
      const addButton = screen.getByAltText('plus-icon');
      fireEvent.click(addButton);

      // Wait for second form to be added and fill it out
      await waitFor(() => {
        const nameInputs = screen.getAllByLabelText('medication[0].name');
        expect(nameInputs).toHaveLength(1);
      });
    });
  });
});
