import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import RangesConfig from '../RangesConfig';

const mockChildComponent = jest.fn();
jest.mock('../SelectFieldWrapper', () => (props: any) => {
  mockChildComponent(props);
  return <div data-testid='select-field-wrapper' />;
});

describe('RangesConfig', () => {
  const mockProps = {
    name: 'ranges',
    obj: {
      fieldName: 'testField',
      ranges: [],
      unitList: [
        { id: 'mg/dL', name: 'mg/dL' },
        { id: 'mmol/mol', name: 'mmol/mol' }
      ],
      family: 'testFamily',
      id: '123'
    },
    field: 'ranges',
    form: {
      mutators: {
        setValue: jest.fn()
      }
    }
  };

  const renderComponent = (props = mockProps) => {
    return render(
      <Form
        /* tslint:disable:no-empty */
        onSubmit={() => {}}
        mutators={{ ...arrayMutators, setValue: (args: any) => args }}
        render={({ form }) => <RangesConfig {...props} form={form} />}
      />
    );
  };

  it('renders without ranges initially', () => {
    renderComponent();
    expect(screen.getByTestId('ranges-config-wrapper')).toBeInTheDocument();
    expect(screen.getByText('Ranges')).toBeInTheDocument();
  });

  it('shows add button when fieldName is present and no ranges exist', () => {
    renderComponent();
    const plusIcon = screen.getByAltText('plus-icon');
    expect(plusIcon).toBeVisible();
  });

  it('renders range fields when ranges exist', () => {
    const propsWithRanges: any = {
      ...mockProps,
      obj: {
        ...mockProps.obj,
        ranges: [
          {
            unitType: 'mg/dL',
            gender: 'Male',
            minRange: '0',
            maxRange: '100',
            displayRange: '0-100',
            fieldName: 'testField'
          }
        ]
      }
    };

    renderComponent(propsWithRanges);
    expect(screen.getAllByTestId('select-field-wrapper')).toHaveLength(2);

    expect(screen.getByText('Min Value')).toBeInTheDocument();
    expect(screen.getByText('Max Value')).toBeInTheDocument();
    expect(screen.getByText('Display Range')).toBeInTheDocument();
  });

  it('disables add button when fieldName is not present', () => {
    const propsWithoutFieldName = {
      ...mockProps,
      obj: {
        ...mockProps.obj,
        fieldName: ''
      }
    };

    renderComponent(propsWithoutFieldName);
    const rangesText = screen.getByText('Ranges');
    expect(rangesText.parentElement?.parentElement).toHaveClass('not-allowed');
  });

  it('adds initial range when clicking add button', () => {
    renderComponent();
    const plusIcon = screen.getByAltText('plus-icon');
    fireEvent.click(plusIcon);
  });

  it('disables unit options that are already selected in other ranges', async () => {
    const propsWithMultipleRanges: any = {
      ...mockProps,
      obj: {
        ...mockProps.obj,
        ranges: [
          {
            unitType: 'mmol/mol',
            gender: 'Male',
            minRange: 2,
            maxRange: 4,
            displayRange: '2'
          },
          {
            unitType: 'mmol/mol',
            gender: 'Female',
            minRange: 1,
            maxRange: 2,
            displayRange: '3'
          }
        ]
      }
    };

    renderComponent(propsWithMultipleRanges);
    const mockTagInput: any = mockChildComponent.mock.calls[0][0];
    mockTagInput.isOptionDisabled({
      name: 'mmol/mol',
      id: 'mmol/mol'
    });

    mockTagInput.onChange(
      {
        name: 'Female',
        id: 'Female'
      },
      {
        onChange: jest.fn()
      }
    );
  });

  it('should show error when min range is greater than or equal to max range', () => {
    const mockForm = {
      mutators: {
        setValue: jest.fn()
      }
    };

    const mockLocalProps: any = {
      name: 'ranges',
      obj: {
        fieldName: 'test',
        ranges: [
          {
            unitType: 'mg/dL',
            gender: 'Male',
            minRange: '100',
            maxRange: '50',
            displayRange: '50-100'
          }
        ]
      },
      field: 'ranges',
      form: mockForm
    };

    renderComponent(mockLocalProps);

    fireEvent.input(screen.getByLabelText('ranges[0].maxRange'), { target: { value: '50' } });
    fireEvent.input(screen.getByLabelText('ranges[0].minRange'), { target: { value: '100' } });
    expect(screen.getByText('Max value should be greater than min value')).toBeInTheDocument();
  });

  it('should delete range when clicking delete icon', () => {
    const propsWithMultipleRanges: any = {
      ...mockProps,
      obj: {
        ...mockProps.obj,
        ranges: [
          {
            unitType: 'mmol/mol',
            gender: 'Male',
            minRange: 2,
            maxRange: 4,
            displayRange: '2'
          },
          {
            unitType: 'mmol/mol',
            gender: 'Female',
            minRange: 1,
            maxRange: 2,
            displayRange: '3'
          }
        ]
      }
    };
    renderComponent(propsWithMultipleRanges);
    const deleteIcon = screen.getAllByAltText('delete-icon');
    fireEvent.click(deleteIcon[0]);
  });
});
