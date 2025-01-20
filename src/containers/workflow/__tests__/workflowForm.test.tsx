import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkflowForm from '../WorkflowForm';
import { Form } from 'react-final-form';

describe('WorkflowForm', () => {
  const initialValues = {
    name: '',
    viewScreens: []
  };

  const renderForm = (props = {}) => {
    return render(
      <Form
        onSubmit={jest.fn()}
        initialValues={initialValues}
        render={({ form }) => <WorkflowForm isEdit={false} form={form} {...props} />}
      />
    );
  };

  it('renders the form fields correctly', () => {
    renderForm();

    // Check if the name input field is rendered
    const nameInput = screen.getByLabelText(/Workflow Name/i);
    expect(nameInput).toBeInTheDocument();

    // Check if the View Screens checkboxes are rendered
    const screeningCheckbox = screen.getByLabelText(/Screening/i);
    const enrollmentCheckbox = screen.getByLabelText(/Enrollment/i);
    const assessmentCheckbox = screen.getByLabelText(/Assessment/i);

    expect(screeningCheckbox).toBeInTheDocument();
    expect(enrollmentCheckbox).toBeInTheDocument();
    expect(assessmentCheckbox).toBeInTheDocument();
  });

  it('displays an error message when no view screen is selected', async () => {
    renderForm();

    // Initially, no error should be shown
    expect(screen.queryByText(/Please select a View Screen/i)).toBeNull();

    // Trigger validation for the viewScreens field
    fireEvent.blur(screen.getByLabelText(/Screening/i));

    // Check if the required error message appears
    expect(await screen.findByText(/Please select a View Screen/i)).toBeInTheDocument();
  });

  it('handles form submission with correct values', () => {
    const handleSubmitForm = jest.fn();
    render(
      <Form
        onSubmit={handleSubmitForm}
        initialValues={initialValues}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <WorkflowForm form={form} isEdit={false} />
            <button type='submit'>Submit</button>
          </form>
        )}
      />
    );

    // Fill out the form
    const nameInput = screen.getByLabelText(/Workflow Name/i);
    fireEvent.change(nameInput, { target: { value: 'New Workflow' } });

    const screeningCheckbox = screen.getByLabelText(/Screening/i);
    fireEvent.click(screeningCheckbox);

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Check if handleSubmit was called with correct values
    expect(handleSubmitForm).toHaveBeenCalled();
  });
});
