import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import RegionForm from '../RegionForm';

describe('RegionForm', () => {
  const renderComponent = () => {
    return render(
      /* tslint:disable-next-line:no-empty */
      <Form onSubmit={() => {}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <RegionForm />
            <button type='submit'>Submit</button>
          </form>
        )}
      </Form>
    );
  };

  it('renders region all input fields', () => {
    renderComponent();
    const nameInput = screen.getAllByRole('textbox');
    expect(nameInput).toHaveLength(2);
  });

  it('renders region name input field', () => {
    const { container } = renderComponent();
    expect(container.querySelector(`input[name="region.name"]`)).toBeInTheDocument();
  });

  it('renders country code input field', () => {
    const { container } = renderComponent();
    expect(container.querySelector(`input[name="region.countryCode"]`)).toBeInTheDocument();
  });
});
