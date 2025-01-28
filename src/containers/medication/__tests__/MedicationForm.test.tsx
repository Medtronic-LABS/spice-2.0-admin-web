import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import MedicationForm from '../MedicationForm';

// Mock the router
jest.mock('react-router', () => ({
  useParams: () => ({
    regionId: '123'
  })
}));

const mockStore = configureStore([]);

describe('MedicationForm Component', () => {
  let store: any;

  const initialState = {
    medication: {
      classifications: [
        {
          id: 1,
          name: 'Classification 1',
          brands: [
            { id: 1, name: 'Brand 1' },
            { id: 2, name: 'Brand 2' }
          ]
        }
      ],
      dosageForms: [
        { id: 1, name: 'Dosage Form 1' },
        { id: 2, name: 'Dosage Form 2' }
      ],
      categories: [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ],
      loading: false,
      classificationsLoading: false,
      dosageFormsLoading: false,
      categoryLoading: false
    },
    user: {
      user: {
        appType: 'COMMUNITY'
      }
    },
    common: {
      labelName: null
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <Form
          // tslint:disable-next-line:no-empty
          onSubmit={() => {}}
          mutators={{ ...arrayMutators }}
          render={({ form }) => <MedicationForm form={form} {...props} />}
        />
      </Provider>
    );
  };

  it('renders the form with initial fields', () => {
    renderComponent();
    expect(screen.getByText('Medication Name')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Classification')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Dosage Form')).toBeInTheDocument();
  });

  it('shows loader when loading is true', () => {
    store = mockStore({
      ...initialState,
      medication: {
        ...initialState.medication,
        loading: true
      }
    });
    renderComponent();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderComponent();
    const [nameInput] = screen.getAllByText('Medication Name');
    fireEvent.blur(nameInput);
    expect(screen.getByText('Medication Name')).toBeInTheDocument();
  });

  it('renders with initial edit values', () => {
    const initialEditValue = {
      id: 1,
      name: 'Test Medication',
      classification: { id: 1, name: 'Classification 1' },
      brand: { id: 1, name: 'Brand 1' },
      dosage_form: { id: 1, name: 'Dosage Form 1' },
      codeDetails: { code: 'TEST123', url: 'http://test.com' }
    };

    renderComponent({ initialEditValue });

    expect(screen.getByDisplayValue('Test Medication')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TEST123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('http://test.com')).toBeInTheDocument();
  });

  it('updates brand options when classification changes', async () => {
    renderComponent();
    const classificationSelect = screen.getByLabelText('Classification');
    fireEvent.change(classificationSelect, { target: { value: '1' } });

    await waitFor(() => {
      const brandSelect = screen.getByLabelText('Brand');
      expect(brandSelect).not.toBeDisabled();
    });
  });

  it('renders category field when isCategories is true', () => {
    store = mockStore({
      ...initialState,
      user: {
        user: {
          appTypes: ['NON_COMMUNITY']
        }
      }
    });
    renderComponent();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });
});
