import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RegionForm from '../RegionForm';

const mockStore = configureStore([]);

describe('RegionForm', () => {
  const store = mockStore({
    healthFacility: {
      countryList: []
    },
    user: {
      user: {
        country: { id: 1, appTypes: [] },
        appTypes: []
      }
    },
    common: {
      labelName: null
    }
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        {/* tslint:disable-next-line:no-empty */}
        <Form onSubmit={() => {}}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RegionForm />
              <button type='submit'>Submit</button>
            </form>
          )}
        </Form>
      </Provider>
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
    expect(container.querySelector(`input[name="region.phoneNumberCode"]`)).toBeInTheDocument();
  });
});
