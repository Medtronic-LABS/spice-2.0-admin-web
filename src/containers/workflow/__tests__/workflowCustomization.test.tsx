import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import WorkflowCustomization from '../WorkflowCustomization';
import rootReducer from '../../../store/rootReducer';

jest.mock('../../../store/workflow/actions', () => ({
  fetchClinicalWorkflow: jest.fn(),
  createWorkflowModule: jest.fn(),
  updateWorkflowModule: jest.fn(),
  deleteWorkflowModule: jest.fn(),
  resetClinicalWorkflow: jest.fn()
}));

// Mock SVG icons
jest.mock('../../../assets/images/plus.svg', () => ({
  ReactComponent: () => <svg data-testid='plus-icon' />
}));

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <WorkflowCustomization />
      </MemoryRouter>
    </Provider>
  );

describe('WorkflowCustomization', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        user: {
          user: {
            country: { id: 1, appTypes: [] },
            appTypes: []
          }
        },
        common: {
          labelName: null
        }
      }
    });
    jest.clearAllMocks();
  });

  it('renders without crashing and displays key elements', () => {
    renderComponent(store);

    expect(screen.getByText(/Workflow Customization/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Workflow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Workflow/i })).toBeInTheDocument();
  });

  it('opens the modal when "Add Workflow" is clicked', () => {
    renderComponent(store);

    const addWorkflowButtons = screen.getAllByRole('button', { name: /Add Workflow/i });
    fireEvent.click(addWorkflowButtons[0]);

    // Check for modal title specifically
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Add Workflow');
  });

  it('closes the modal when "Cancel" is clicked', () => {
    renderComponent(store);

    const addWorkflowButtons = screen.getAllByRole('button', { name: /Add Workflow/i });
    fireEvent.click(addWorkflowButtons[0]);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // Check that modal title is no longer in document (button text will still be there)
    const modalTitle = screen.queryByTestId('modal-title');
    expect(modalTitle).not.toBeInTheDocument();
  });
});
