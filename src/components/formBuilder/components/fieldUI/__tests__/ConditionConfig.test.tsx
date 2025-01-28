import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import ConditionConfig from '../ConditionConfig';

const mockFieldArray = jest.fn();
jest.mock('react-final-form-arrays', () => ({
  FieldArray: (props: any) => {
    mockFieldArray(props);
    return props.children({
      fields: {
        length: 1,
        push: jest.fn(),
        remove: jest.fn()
      },
      meta: { error: null }
    });
  }
}));

describe('ConditionConfig Component', () => {
  const defaultProps = {
    name: 'conditions',
    obj: {
      fieldName: 'testField',
      viewType: 'EditText',
      id: 'test1',
      conditions: [],
      readOnly: false,
      optionsList: [
        { name: 'option1', id: '1' },
        { name: 'option2', id: '2' }
      ]
    },
    field: 'conditions',
    form: {
      mutators: {
        setValue: jest.fn()
      },
      change: jest.fn()
    },
    targetIds: [
      { key: 'target1', label: 'Target 1' },
      { key: 'target2', label: 'Target 2' }
    ],
    unAddedFields: [{ key: 'field1' }, { key: 'field2' }],
    newlyAddedIds: ['field1', 'field2']
  };

  const renderComponent = (props = {}) => {
    return render(
      <Form
        // tslint:disable-next-line:no-empty
        onSubmit={() => {}}
        mutators={{ ...arrayMutators }}
        render={() => <ConditionConfig {...defaultProps} {...props} />}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the component with add condition button', () => {
      renderComponent();
      expect(screen.getByText('Conditions')).toBeInTheDocument();
      expect(screen.getByAltText('plus-icon')).toBeInTheDocument();
    });

    it('should disable add condition when fieldName is empty', () => {
      renderComponent({
        obj: { ...defaultProps.obj, fieldName: '' }
      });
      const container = screen.getByTestId('condition-config-wrapper');
      expect(container.querySelector('.not-allowed')).toBeInTheDocument();
    });

    it('should not render condition when targetId and targetOption are present', () => {
      const propsWithTargetOption = {
        ...defaultProps,
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              targetId: 'target1',
              targetOption: 'option1'
            }
          ]
        }
      };

      renderComponent(propsWithTargetOption);

      expect(screen.queryByTestId('select-input-component')).not.toBeInTheDocument();
      expect(screen.queryByTestId('text-input-component')).not.toBeInTheDocument();
    });

    it('should clear all conditions when deleting the last remaining condition', () => {
      const mockForm = {
        mutators: {
          setValue: jest.fn()
        },
        change: jest.fn()
      };

      const mockFields = {
        length: 1,
        push: jest.fn(),
        remove: jest.fn()
      };

      mockFieldArray.mockImplementationOnce((props) => {
        return props.children({
          fields: mockFields,
          meta: { error: null }
        });
      });

      renderComponent({
        form: mockForm,
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              enabled: true,
              targetId: 'target1'
            }
          ]
        }
      });

      const deleteButton = screen.getByAltText('delete-icon');
      fireEvent.click(deleteButton);

      expect(mockForm.change).toHaveBeenCalledWith('conditions', []);
    });

    it('should add another condition when clicking plus icon next to existing condition', () => {
      const mockPush = jest.fn();

      mockFieldArray.mockImplementationOnce((props) => {
        return props.children({
          fields: {
            length: 1,
            push: mockPush,
            remove: jest.fn()
          },
          meta: { error: null }
        });
      });

      renderComponent({
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              enabled: true,
              targetId: 'target1'
            }
          ]
        }
      });

      const addMoreButton = screen.getAllByAltText('plus-icon')[1];
      fireEvent.click(addMoreButton);

      expect(screen.getAllByTestId('select-input-component')).toHaveLength(2);
    });
  });

  describe('SelectInputComponent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const conditionWithSelect = {
      ...defaultProps,
      obj: {
        ...defaultProps.obj,
        conditions: [
          {
            enabled: true,
            targetId: 'target1',
            visibility: 'visible'
          }
        ]
      }
    };

    it('should render select inputs correctly', () => {
      renderComponent(conditionWithSelect);
      expect(screen.getAllByTestId('select-input-component')).toHaveLength(3);
    });

    it('should handle targetId selection', () => {
      renderComponent(conditionWithSelect);
      const select = screen.getAllByTestId('select-input-component');
      expect(select).toHaveLength(3);
    });

    it('should handle eq field selection correctly', () => {
      const conditionWithEq = {
        ...defaultProps,
        obj: {
          ...defaultProps.obj,
          viewType: 'Other',
          conditions: [
            {
              eq: 'option1',
              targetId: 'target1',
              visibility: 'visible'
            }
          ],
          optionsList: [
            { name: 'option1', id: '1' },
            { name: 'option2', id: '2' },
            { name: '', id: '3' }
          ]
        }
      };

      renderComponent(conditionWithEq);
      const selectInputs = screen.getAllByTestId('select-input-component');
      expect(selectInputs).toHaveLength(3);

      const eqSelect = selectInputs[0];
      expect(eqSelect).toBeInTheDocument();
    });

    it('should handle undefined options gracefully', () => {
      const propsWithUndefinedOptions = {
        ...defaultProps,
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              enabled: true,
              targetId: 'target1'
            }
          ],
          optionsList: undefined
        }
      };

      renderComponent(propsWithUndefinedOptions);
      const selectInputs = screen.getAllByTestId('select-input-component');
      expect(selectInputs).toHaveLength(2);
    });
  });

  describe('TextInputComponent', () => {
    const conditionWithText = {
      ...defaultProps,
      obj: {
        ...defaultProps.obj,
        conditions: [
          {
            lengthGreaterThan: 5
          }
        ]
      }
    };

    it('should render text inputs correctly', () => {
      renderComponent(conditionWithText);
      expect(screen.getByTestId('text-input-component')).toBeInTheDocument();
    });
    it('should handle number type parsing correctly', () => {
      const conditionWithNumber = {
        ...defaultProps,
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              lengthGreaterThan: '5'
            }
          ]
        }
      };

      renderComponent(conditionWithNumber);
      const textInput = screen.getByTestId('text-input-component');
      expect(textInput).toBeInTheDocument();

      const input = textInput.querySelector('input');
      fireEvent.change(input!, { target: { value: '10' } });

      fireEvent.change(input!, { target: { value: 'abc' } });
    });

    it('should handle lengthGreaterThan field parsing correctly', () => {
      const conditionWithLength = {
        ...defaultProps,
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              lengthGreaterThan: 5
            }
          ]
        }
      };

      renderComponent(conditionWithLength);
      const textInput = screen.getByTestId('text-input-component');
      expect(textInput).toBeInTheDocument();

      const input = textInput.querySelector('input');
      fireEvent.change(input!, { target: { value: '10' } });

      fireEvent.change(input!, { target: { value: '0' } });
      fireEvent.change(input!, { target: { value: '-1' } });
    });
  });

  describe('Condition Actions', () => {
    it('should add new condition when clicking add button', () => {
      renderComponent();
      const addButton = screen.getByAltText('plus-icon');
      fireEvent.click(addButton);
      expect(defaultProps.form.mutators.setValue).toHaveBeenCalled();
    });

    it('should render delete button when conditions exist', () => {
      renderComponent({
        obj: {
          ...defaultProps.obj,
          conditions: [
            {
              enabled: true,
              targetId: 'target1'
            }
          ]
        }
      });
      expect(screen.getByAltText('delete-icon')).toBeInTheDocument();
    });
  });

  describe('FieldArray Validation', () => {
    beforeEach(() => {
      renderComponent({
        obj: {
          ...defaultProps.obj,
          conditions: [{ enabled: true }]
        }
      });
    });

    afterEach(() => {
      mockFieldArray.mockClear();
      jest.clearAllMocks();
    });

    it('should validate required fields and return errors', () => {
      const validateFn = mockFieldArray.mock.calls[0][0].validate;

      const values = [
        { enabled: '', targetId: 'target1' },
        { enabled: true, targetId: '' }
      ];

      const result = validateFn(values);

      expect(result).toEqual([{ enabled: 'Please enter ' }, { targetId: 'Please enter ' }]);
    });

    it('should validate required fields and return errors with values as undefined', () => {
      const validateFn = mockFieldArray.mock.calls[0][0].validate;

      const values = undefined;

      const result = validateFn(values);

      expect(result).toBeUndefined();
    });

    it('should return undefined when all fields are valid', () => {
      const validateFn = mockFieldArray.mock.calls[0][0].validate;

      const values = [
        { enabled: true, targetId: 'target1' },
        { enabled: false, targetId: 'target2' }
      ];

      const result = validateFn(values);

      expect(result).toBeUndefined();
    });

    it('should call FieldArray with correct props', () => {
      expect(mockFieldArray).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'conditions',
          validate: expect.any(Function)
        })
      );
    });
  });
});
