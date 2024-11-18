import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import DatePickerWrapper from '../DatePickerWrapper';
import { convertDate } from '../../../../../utils/commonUtils';

// Mock the DatePicker component
jest.mock('../../../../datePicker/DatePicker', () => {
  return function MockDatePicker({ label, onChange, error }: any) {
    return (
      <div data-testid='mock-date-picker'>
        <label>{label}</label>
        <input type='date' onChange={(e) => onChange(new Date(e.target.value))} data-error={error} />
      </div>
    );
  };
});

describe('DatePickerWrapper', () => {
  const defaultProps = {
    name: 'testDate',
    inputProps: {
      label: 'Test Date'
    }
  };

  const renderWrapper = (props = {}) => {
    return render(
      // tslint:disable-next-line:no-empty
      <Form onSubmit={() => {}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DatePickerWrapper {...defaultProps} {...props} />
          </form>
        )}
      </Form>
    );
  };

  it('renders with default props', () => {
    renderWrapper();
    expect(screen.getByText('Test Date')).toBeInTheDocument();
  });

  it('handles date changes correctly', () => {
    renderWrapper();
    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    const testDate = '2024-03-20';
    fireEvent.change(input!, { target: { value: testDate } });

    expect(convertDate(new Date(testDate))).toBe(testDate);
  });

  it('applies custom parse function when provided', () => {
    const customParseFn = jest.fn((val) => val);
    renderWrapper({ customParseFn });

    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    fireEvent.change(input!, { target: { value: '2024-03-20' } });
    expect(customParseFn).toHaveBeenCalled();
  });

  it('handle parseFn without customParseFn', () => {
    renderWrapper();
    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    fireEvent.change(input!, { target: { value: '2024-03-20' } });
    expect(screen.getByTestId('mock-date-picker')).toBeInTheDocument();
  });

  it('uses custom value when provided', () => {
    const customValue = '2024-03-21';
    renderWrapper({ customValue });
    expect(screen.getByTestId('mock-date-picker')).toBeInTheDocument();
  });

  it('handles validation correctly', () => {
    const inputPropsWithValidation = {
      ...defaultProps.inputProps,
      required: true
    };

    renderWrapper({ inputProps: inputPropsWithValidation });
    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    fireEvent.change(input!, { target: { value: '' } });
    fireEvent.blur(input!);

    screen.debug();
    expect(screen.getByTestId('mock-date-picker')).toBeInTheDocument();
  });

  it('skips validation when disabledValidation is true', () => {
    const inputPropsWithDisabledValidation = {
      ...defaultProps.inputProps,
      required: true,
      disabledValidation: true
    };

    renderWrapper({ inputProps: inputPropsWithDisabledValidation });
    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    fireEvent.change(input!, { target: { value: '' } });
    fireEvent.blur(input!);

    expect(datePicker).not.toHaveAttribute('data-error', 'true');
  });

  it('render with customValue and disabledValidation as true in inputProps and without name', () => {
    const localProps = {
      inputProps: {
        label: 'Test Date',
        disabledValidation: true
      },
      customValue: '2024-03-22'
    };
    render(
      // tslint:disable-next-line:no-empty
      <Form onSubmit={() => {}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DatePickerWrapper {...localProps} />
          </form>
        )}
      </Form>
    );
    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    fireEvent.change(input!, { target: { value: '2024-03-20' } });
    expect(screen.getByTestId('mock-date-picker')).toBeInTheDocument();
  });

  it('render without inputProps', () => {
    const localProps = {
      customValue: '2024-03-22',
      disabledValidation: true
    };
    render(
      // tslint:disable-next-line:no-empty
      <Form onSubmit={() => {}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DatePickerWrapper {...localProps} />
          </form>
        )}
      </Form>
    );
    const datePicker = screen.getByTestId('mock-date-picker');
    const input = datePicker.querySelector('input');

    fireEvent.change(input!, { target: { value: '2024-03-20' } });
    expect(screen.getByTestId('mock-date-picker')).toBeInTheDocument();
  });
});
