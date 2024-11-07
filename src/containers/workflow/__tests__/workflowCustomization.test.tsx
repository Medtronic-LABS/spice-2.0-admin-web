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
    store = configureStore({ reducer: rootReducer });
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

    const addWorkflowButton = screen.getByRole('button', { name: /Add Workflow/i });
    fireEvent.click(addWorkflowButton);

    expect(screen.getByText(/Add Account Workflow/i)).toBeInTheDocument();
  });

  it('closes the modal when "Cancel" is clicked', () => {
    renderComponent(store);

    const addWorkflowButton = screen.getByRole('button', { name: /Add Workflow/i });
    fireEvent.click(addWorkflowButton);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/Add Account Workflow/i)).not.toBeInTheDocument();
  });
});
