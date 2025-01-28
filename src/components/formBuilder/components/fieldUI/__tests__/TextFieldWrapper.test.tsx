import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import TextFieldWrapper from '../TextFieldWrapper';
import { InputTypes } from '../../../labTestConfig/BaseFieldConfig';
import { Field } from 'react-final-form';

const mockChildComponent = jest.fn();
jest.mock('../../../../../components/formFields/TextInput', () => (props: any) => {
  mockChildComponent(props);
  return (
    <div data-testid='text-input'>
      <input />
    </div>
  );
});

describe('TextFieldWrapper', () => {
  const renderComponent = (props = {}) => {
    // tslint:disable-next-line:no-empty
    return render(<Form onSubmit={() => {}}>{() => <TextFieldWrapper {...props} />}</Form>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderComponent();
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Label',
        isShowLabel: undefined,
        required: undefined
      })
    );
  });

  it('handles number input type correctly', () => {
    renderComponent({
      inputProps: { type: 'number', label: 'Number Field' }
    });

    const input = screen.getByTestId('text-input').querySelector('input');
    fireEvent.keyDown(input!, { key: '.' });
    fireEvent.keyDown(input!, { key: 'e' });

    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'number',
        label: 'Number Field'
      })
    );
  });

  it('handles decimal input type correctly', () => {
    renderComponent({
      inputProps: { type: 'decimal' },
      obj: { inputType: InputTypes.DECIMAL }
    });

    const input = screen.getByTestId('text-input').querySelector('input');
    fireEvent.keyDown(input!, { key: '.' });
    fireEvent.keyDown(input!, { key: 'e' });

    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'number'
      })
    );
  });

  it('handles custom error messages', () => {
    const customError = 'Custom error message';
    renderComponent({
      customError,
      isCustomErrorWithMeta: true,
      inputProps: { label: 'Test Field' }
    });

    expect(mockChildComponent).toHaveBeenCalled();
  });

  it('calls custom handlers when provided', async () => {
    const customOnBlurFn = jest.fn();
    const customOnChangeFn = jest.fn();

    renderComponent({
      customOnBlurFn,
      customOnChangeFn
    });

    const input = screen.getByTestId('text-input').querySelector('input');
    fireEvent.change(input!, { target: { value: 'test' } });
    await waitFor(() => {
      fireEvent.blur(input!);
    });
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('should handle keydown event with e key', () => {
    renderComponent({
      inputProps: { type: 'number' }
    });
    const keyDownMock = mockChildComponent.mock.calls[0][0];
    keyDownMock.onKeyDown({ key: 'e', preventDefault: jest.fn() });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('should handle keydown event with . key', () => {
    renderComponent({
      inputProps: { type: 'number' }
    });
    const keyDownMock = mockChildComponent.mock.calls[0][0];
    keyDownMock.onKeyDown({ key: '.', preventDefault: jest.fn() });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('should handle keydown event with onj inputType as decimal key', () => {
    renderComponent({
      inputProps: { type: 'number' },
      obj: { inputType: InputTypes.DECIMAL }
    });
    const keyDownMock = mockChildComponent.mock.calls[0][0];
    keyDownMock.onKeyDown({ key: 'e', preventDefault: jest.fn() });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('should handle keydown event with other type in inputProps', () => {
    renderComponent({
      inputProps: { type: 'text' }
    });
    const keyDownMock = mockChildComponent.mock.calls[0][0];
    keyDownMock.onKeyDown({ key: 'e' });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('should handle default parseFn', async () => {
    renderComponent({
      inputProps: { type: 'number' }
    });
    const input = screen.getByTestId('text-input').querySelector('input');
    fireEvent.change(input!, { target: { value: '123' } });
    await waitFor(() => {
      fireEvent.blur(input!);
    });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('handle input without cusomParseFn', async () => {
    renderComponent({
      name: 'testField',
      inputProps: { type: 'number' }
    });
    const input = screen.getByTestId('text-input').querySelector('input');
    const testValue = '123';

    fireEvent.change(input!, { target: { value: testValue } });
    await waitFor(() => {
      fireEvent.blur(input!);
    });

    const mockOnBlurFn = mockChildComponent.mock.calls[0][0];
    mockOnBlurFn.onBlurCapture(testValue);

    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
  });

  describe('handle meta error', () => {
    const renderErrorComponent = (props: any = {}) => {
      return render(
        <Form
          // tslint:disable-next-line:no-empty
          onSubmit={() => {}}
          validate={(values: Record<string, any>) => {
            const errors: Record<string, string> = {};
            if (!values.testField) {
              errors.testField = 'Required';
            }
            return errors;
          }}
          render={() => (
            <Field
              name='testField'
              render={() => {
                return <TextFieldWrapper {...props} />;
              }}
            />
          )}
        />
      );
    };
    it('should handle mock meta error with error in inputProps', async () => {
      renderErrorComponent({
        name: 'testField',
        inputProps: { type: 'number', label: 'Test Field', error: 'Invalid' }
      });
      const input = screen.getByTestId('text-input').querySelector('input');
      fireEvent.change(input!, { target: { value: '123' } });
      await waitFor(() => {
        fireEvent.blur(input!);
      });
      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('should handle mock meta error without error in inputProps', async () => {
      renderErrorComponent({
        name: 'testField',
        inputProps: { type: 'number', label: 'Test Field' }
      });
      const input = screen.getByTestId('text-input').querySelector('input');
      fireEvent.change(input!, { target: { value: '123' } });
      await waitFor(() => {
        fireEvent.blur(input!);
      });
      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });

    it('should handle mock meta error without error in inputProps and without type in inputProps', async () => {
      renderErrorComponent({
        name: 'testField',
        inputProps: { label: 'Test Field' },
        fieldName: 'interval'
      });
      const input = screen.getByTestId('text-input').querySelector('input');
      fireEvent.change(input!, { target: { value: '123' } });
      await waitFor(() => {
        fireEvent.blur(input!);
      });
      expect(screen.getByTestId('text-input')).toBeInTheDocument();
    });
  });
});
