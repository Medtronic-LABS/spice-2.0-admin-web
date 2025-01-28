import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import arrayMutators from 'final-form-arrays';
import OptionList from '../OptionList';

const mockChildComponent = jest.fn();
jest.mock('../TagInput', () => (props: any) => {
  mockChildComponent(props);
  return (
    <div data-testid='tag-input'>
      <input type='text' />
    </div>
  );
});

const baseProps = {
  name: 'testOptions',
  field: 'optionsList',
  inputProps: {
    label: 'Test Options',
    disabled: false
  }
};

const booleanProps = {
  ...baseProps,
  obj: {
    id: '1',
    viewType: 'RadioGroup',
    optionsList: [
      { id: true, name: '' },
      { id: false, name: '' }
    ],
    condition: [{ eq: 'oldValue' }]
  }
};

const stringProps = {
  ...baseProps,
  obj: {
    id: '1',
    viewType: 'RadioGroup',
    optionsList: [],
    condition: [{ eq: 'oldValue' }]
  }
};

const mockStore = configureStore([]);

describe('OptionList Component', () => {
  const mockOnSubmit = jest.fn();
  const renderWithForm = (props: any, store: any) => {
    return render(
      <Provider store={store}>
        <Form
          mutators={{ ...arrayMutators }}
          onSubmit={mockOnSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OptionList {...props} />
            </form>
          )}
        />
      </Provider>
    );
  };

  const booleanStore = mockStore({
    workflow: {
      formMeta: [
        {
          key: '1',
          type: 'checkbox'
        }
      ]
    }
  });
  const stringStore = mockStore({
    workflow: {
      formMeta: []
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders boolean options correctly', () => {
    renderWithForm(booleanProps, booleanStore);

    const booleanOptionsRender = screen.getByTestId('boolean-options-render');
    expect(booleanOptionsRender).toBeInTheDocument();

    expect(screen.getAllByTestId('boolean-options')).toHaveLength(2);
  });

  it('shows validation errors for empty boolean options', async () => {
    renderWithForm(booleanProps, booleanStore);

    const positiveInput = screen.getByText('Positive Label');
    const negativeInput = screen.getByText('Negative Label');

    fireEvent.blur(positiveInput);
    fireEvent.blur(negativeInput);

    expect(await screen.findByText('Please add the positive value')).toBeInTheDocument();
    expect(await screen.findByText('Please add the negative value')).toBeInTheDocument();
  });

  it('handles parseValue in BooleanOptionsRender correctly with condition', () => {
    const props = {
      ...booleanProps,
      obj: {
        ...booleanProps.obj,
        condition: [{ eq: 'oldValue' }, { eq: 'newValue' }, { ins: 'oldValue' }],
        optionsList: [
          { id: true, name: 'oldValue' },
          { id: false, name: 'oldValue' }
        ]
      }
    };

    renderWithForm(props, booleanStore);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    fireEvent.change(firstInput, { target: { value: 'newValue' } });
    fireEvent.blur(firstInput);

    expect(props.obj.condition[0].eq).toBe('');
  });

  it('handles parseValue in BooleanOptionsRender correctly without condition', () => {
    const props = {
      ...baseProps,
      obj: {
        id: '1',
        viewType: 'RadioGroup',
        optionsList: [
          { id: true, name: 'oldValue' },
          { id: false, name: 'oldValue' }
        ]
      }
    };

    renderWithForm(props, booleanStore);

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    fireEvent.change(firstInput, { target: { value: 'newValue' } });
    fireEvent.blur(firstInput);
  });

  it('renders string options correctly', () => {
    renderWithForm(stringProps, stringStore);

    const stringOptionsRender = screen.getByTestId('string-options-render');
    expect(stringOptionsRender).toBeInTheDocument();

    const tagInput = screen.getByTestId('tag-input');
    expect(tagInput).toBeInTheDocument();
  });

  it('handles startsWith field type correctly', () => {
    const startsWithProps = {
      ...stringProps,
      field: 'startsWith'
    };

    renderWithForm(startsWithProps, stringStore);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders BooleanOptionsRender for RadioGroup with checkbox type', () => {
    const props = {
      ...baseProps,
      obj: {
        id: '1',
        viewType: 'RadioGroup',
        optionsList: []
      }
    };

    renderWithForm(props, booleanStore);
    expect(screen.getByTestId('boolean-options-render')).toBeInTheDocument();
  });

  it('renders StringOptionsRender for non-RadioGroup types', () => {
    const props = {
      ...baseProps,
      obj: {
        id: 'test4',
        viewType: 'Select',
        optionsList: []
      }
    };

    renderWithForm(props, stringStore);
    expect(screen.getByTestId('string-options-render')).toBeInTheDocument();
  });

  it('handle parse function without default value and field as startsWith', () => {
    const props = {
      ...stringProps,
      obj: {
        ...stringProps.obj,
        condition: [{ eq: 'option1' }, { eq: 'option2' }, { someOtherProp: 'value' }],
        optionsList: [
          { id: '1', name: '1' },
          { id: '2', name: '2' }
        ]
      },
      field: 'startsWith'
    };
    renderWithForm(props, stringStore);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    const mockTagInput: any = mockChildComponent.mock.calls[0][0];
    mockTagInput.onChange(['9']);
  });

  it('handle parse function with default value and entered value is not inside obj default value', () => {
    const props = {
      ...stringProps,
      obj: {
        id: '1',
        viewType: 'RadioGroup',
        defaultValue: '3',
        optionsList: [
          { id: '1', name: '1' },
          { id: '2', name: '2' },
          { id: '3', name: '' }
        ]
      }
    };
    renderWithForm(props, stringStore);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    const mockTagInput: any = mockChildComponent.mock.calls[0][0];
    mockTagInput.onChange(['9']);
  });

  it('handle parse function with default value and entered value is inside obj default value', () => {
    const props = {
      ...stringProps,
      obj: {
        ...stringProps.obj,
        defaultValue: '9',
        condition: [{ eq: '1' }, { eq: '3' }, { someOtherProp: 'value' }],
        optionsList: [
          { id: '1', name: '1' },
          { id: '2', name: '2' }
        ]
      }
    };
    renderWithForm(props, stringStore);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    const mockTagInput: any = mockChildComponent.mock.calls[0][0];
    mockTagInput.onChange(['9']);
  });
});
