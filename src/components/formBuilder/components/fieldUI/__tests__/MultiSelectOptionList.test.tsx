import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import MultiSelectOptionList from '../MultiSelectOptionList';
import userEvent from '@testing-library/user-event';

describe('MultiSelectOptionList', () => {
  const mockProps = {
    field: 'testField',
    name: 'testName',
    obj: { testField: [] },
    form: {
      mutators: {
        setValue: jest.fn()
      }
    },
    inputProps: {},
    targetIds: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' }
    ],
    label: 'Test Label'
  };

  const renderComponent = (props = mockProps) => {
    // tslint:disable-next-line:no-empty
    return render(<Form onSubmit={() => {}} render={() => <MultiSelectOptionList {...props} />} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label and required asterisk', () => {
    renderComponent();

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays validation error when no option is selected', async () => {
    renderComponent();

    const select = screen.getByText('Select Fields to add to Collapsible');
    await userEvent.click(select);

    fireEvent.blur(select);

    expect(screen.getByText('Please select at least one option.')).toBeInTheDocument();
  });

  it('renders all options from targetIds', () => {
    renderComponent();

    const select = screen.getByText('Select Fields to add to Collapsible');
    fireEvent.mouseDown(select);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls form.mutators.setValue when an option is selected', async () => {
    renderComponent();

    const select = screen.getByText('Select Fields to add to Collapsible');
    await userEvent.click(select);
    await userEvent.click(screen.getByText('Option 1'));

    expect(mockProps.form.mutators.setValue).toHaveBeenCalled();
  });

  it('updates selectedValues when targetIds change', () => {
    const { rerender } = renderComponent();

    const updatedProps = {
      ...mockProps,
      targetIds: [
        { key: '1', label: 'Option 1' },
        { key: '2', label: 'Option 2' }
      ]
    };

    // tslint:disable-next-line:no-empty
    rerender(<Form onSubmit={() => {}} render={() => <MultiSelectOptionList {...updatedProps} />} />);

    const select = screen.getByText('Select Fields to add to Collapsible');
    fireEvent.mouseDown(select);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
  });

  it('renders without targetId', () => {
    const localProps = {
      field: 'testField',
      name: 'testName',
      obj: { testField: [] },
      form: {
        mutators: {
          setValue: jest.fn()
        }
      },
      inputProps: {},
      label: 'Test Label'
    };
    // tslint:disable-next-line:no-empty
    render(<Form onSubmit={() => {}} render={() => <MultiSelectOptionList {...localProps} />} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('filters selectedValues when targetIds change', () => {
    const initialProps: any = {
      ...mockProps,
      obj: {
        testField: [
          { value: '1', label: 'Option 1' },
          { value: '3', label: 'Option 3' }
        ]
      }
    };

    const { rerender } = renderComponent(initialProps);

    const updatedProps = {
      ...initialProps,
      targetIds: [
        { key: '1', label: 'Option 1' },
        { key: '2', label: 'Option 2' }
      ]
    };

    // tslint:disable-next-line:no-empty
    rerender(<Form onSubmit={() => {}} render={() => <MultiSelectOptionList {...updatedProps} />} />);

    expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });
});
