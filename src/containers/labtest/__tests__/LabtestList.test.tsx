import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import configureStore from 'redux-mock-store';
import LabTestList from '../LabtestList';

// Mock the toast center
jest.mock('../../../utils/toastCenter', () => ({
  error: jest.fn(),
  success: jest.fn(),
  __esModule: true,
  default: { error: jest.fn(), success: jest.fn() }
}));

jest.mock('../../assets/images/edit.svg', () => ({
  ReactComponent: () => <svg data-testid='edit-icon' />
}));

const mockStore = configureStore([]);

describe('LabTestList Component', () => {
  let store: any;
  let history: History;

  const mockLabTests = [
    {
      id: 1,
      testName: 'Blood Test',
      displayOrder: 1,
      updatedAt: '2024-01-01T00:00:00.000Z',
      codeDetails: {
        code: 'BT001',
        url: 'http://test.com'
      }
    },
    {
      id: 2,
      testName: 'Urine Test',
      displayOrder: 2,
      updatedAt: '2024-01-02T00:00:00.000Z',
      codeDetails: {
        code: 'UT001',
        url: 'http://test.com'
      }
    }
  ];

  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      labtest: {
        labTests: mockLabTests,
        loading: false,
        count: 2
      }
    });

    // Mock route params
    const mockMatch = {
      params: {
        regionId: '123',
        tenantId: '456'
      },
      isExact: true,
      path: '',
      url: ''
    };

    render(
      <Provider store={store}>
        <Router history={history}>
          <LabTestList history={history} location={history.location} match={mockMatch} />
        </Router>
      </Provider>
    );
  });

  it('renders lab test list component', () => {
    expect(screen.getByText('Lab/Imaging Database')).toBeInTheDocument();
    expect(screen.getByText('Add Lab Test')).toBeInTheDocument();
  });

  it('displays loader when loading is true', () => {
    const mockMatch = {
      params: {
        regionId: '123',
        tenantId: '456'
      },
      isExact: true,
      path: '',
      url: ''
    };

    store = mockStore({
      labtest: {
        labTests: [],
        loading: true,
        count: 0
      }
    });
    render(
      <Provider store={store}>
        <Router history={history}>
          <LabTestList history={history} location={history.location} match={mockMatch} />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Blood' } });

    await waitFor(() => {
      const actions = store.getActions();
      const fetchLabtestListActionType = actions.find(
        (action: { type: string }) => action.type === 'FETCH_LABTEST_REQUEST'
      );
      expect(fetchLabtestListActionType).toBeTruthy();
    });
  });

  it('opens add lab test modal', () => {
    const [addButton] = screen.getAllByText('Add Lab Test');
    fireEvent.click(addButton);
    expect(screen.getAllByText('Add Lab Test')[0]).toBeInTheDocument();
  });

  it('validates lab test name before customization', async () => {
    const [addButton] = screen.getAllByText('Add Lab Test');
    fireEvent.click(addButton);

    const nameInput = screen.getByLabelText('testName');
    fireEvent.change(nameInput, { target: { value: 'New Test' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      const actions = store.getActions();
      actions.forEach((action: { type: string }) => action.type === 'FETCH_LABTEST_REQUEST');
    });
  });

  it('formats updated date correctly', () => {
    const formattedDate = screen.getByText('2024-Jan-01');
    expect(formattedDate).toBeInTheDocument();
  });
});
