import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from 'react-final-form';
import Deactivation from '../Deactivation';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, waitFor } from '@testing-library/react';

describe('Deactivation', () => {
  beforeEach(() => {
    const mockSubmit = jest.fn();
    render(
      <MemoryRouter>
        <Form onSubmit={mockSubmit}>{() => <Deactivation formName='testForm' />}</Form>
      </MemoryRouter>
    );
  });

  it('renders the Deactivation component', () => {
    expect(screen.getByTestId('deactivation-component')).toBeInTheDocument();
  });

  it('renders the SelectInput component with the correct props', () => {
    const selectInput = screen.getByLabelText('Reason');
    expect(selectInput).toBeInTheDocument();
  });

  it('renders the TextAreaInput component with the correct props', () => {
    const textAreaInput = screen.getByLabelText('Describe the reason in detail');
    expect(textAreaInput).toBeInTheDocument();
    expect(textAreaInput).toHaveAttribute('rows', '3');
  });

  it('renders the deactivation info message', () => {
    const deactivationInfo = screen.getByText(
      /Deactivating the testForm will no longer let the testForm admin and their subordinates access the testForm and its data but you can reactivate the testForm anytime back from the profile menu./
    );
    expect(deactivationInfo).toBeInTheDocument();
  });

  it('displays error messages for required fields', async () => {
    const handleFormSubmit = jest.fn();
    render(
      <MemoryRouter>
        <Form onSubmit={handleFormSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Deactivation formName='testForm' />
              <button type='submit'>Submit</button>
            </form>
          )}
        </Form>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Please enter reason')).toBeInTheDocument();
    });
  });
});
