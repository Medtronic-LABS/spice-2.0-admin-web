import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import configureStore from 'redux-mock-store';
import ProgramList from '../ProgramList';

// Mock the toast center and getErrorToastArgs
jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn()
  },
  getErrorToastArgs: jest.fn().mockImplementation((error, title, message) => [title, message])
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    regionId: '123',
    tenantId: '456'
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const mockStore = configureStore([]);

describe('ProgramList Component', () => {
  let store: any;
  let history: History;

  const mockPrograms = [
    {
      id: 1,
      name: 'Diabetes Care Program',
      createdAt: '2024-01-01T00:00:00.000Z',
      active: true,
      healthFacilities: [
        { id: 'hf1', name: 'City Hospital' },
        { id: 'hf2', name: 'Community Clinic' }
      ],
      deletedHealthFacilities: [],
      tenantId: '456',
      country: '123'
    },
    {
      id: 2,
      name: 'Maternal Health Program',
      createdAt: '2024-01-02T00:00:00.000Z',
      active: true,
      healthFacilities: [
        { id: 'hf3', name: `Women's Health Center` },
        { id: 'hf4', name: 'Rural Clinic' }
      ],
      deletedHealthFacilities: [],
      tenantId: '456',
      country: '123'
    },
    {
      id: 3,
      name: 'Vaccination Program',
      createdAt: '2024-01-03T00:00:00.000Z',
      active: false,
      healthFacilities: [
        { id: 'hf5', name: `Children's Hospital` },
        { id: 'hf6', name: 'Public Health Center' }
      ],
      deletedHealthFacilities: ['hf7'],
      tenantId: '456',
      country: '123'
    }
  ];

  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      program: {
        programs: mockPrograms,
        loading: false,
        total: mockPrograms.length,
        error: null,
        programDetails: null,
        programDetailsLoading: false,
        programDetailsError: null
      }
    });

    render(
      <Provider store={store}>
        <Router history={history}>
          <ProgramList />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders program list component', () => {
    expect(screen.getByText('Program')).toBeInTheDocument();
    expect(screen.getByText('Add Program')).toBeInTheDocument();
  });

  it('displays loader when loading is true', () => {
    store = mockStore({
      program: {
        programs: [],
        loading: true,
        total: 0
      }
    });

    render(
      <Provider store={store}>
        <Router history={history}>
          <ProgramList />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      const actions = store.getActions();
      const fetchProgramListActionType = actions.find(
        (action: { type: string }) => action.type === 'FETCH_PROGRAM_LIST_REQUEST'
      );
      expect(fetchProgramListActionType).toBeTruthy();
      expect(fetchProgramListActionType.failureCb).toBeDefined();
    });
  });
});
