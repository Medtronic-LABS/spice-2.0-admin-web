import { render, screen } from '@testing-library/react';
import RenderFieldGroups from '../RenderFieldGroups';
import { getConfigByViewType } from '../../utils/FieldUtils';
import { getConfigByViewType as getCustomizationConfigViewType } from '../../utils/CustomizationFieldUtils';

jest.mock('../../utils/FieldUtils');
jest.mock('../../utils/CustomizationFieldUtils');
jest.mock('../RenderFields', () => () => <div data-testid='mock-render-fields'>Rendered Field</div>);

describe('RenderFieldGroups', () => {
  const mockProps = {
    obj: {
      viewType: 'text',
      field1: 'value1',
      field2: 'value2'
    },
    name: 'testForm',
    form: {},
    unAddedFields: [],
    targetIds: [],
    isNew: false,
    newlyAddedIds: [],
    handleUpdateFieldName: jest.fn(),
    isFieldNameChangable: false,
    addNewFieldDisabled: false,
    hashFieldIdsWithTitle: {},
    hashFieldIdsWithFieldName: {}
  };

  const mockComponentConfig = {
    customizableFieldMeta: {
      field1: { type: 'text' },
      field2: { type: 'text' }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getConfigByViewType as jest.Mock).mockReturnValue(mockComponentConfig);
    (getCustomizationConfigViewType as jest.Mock).mockReturnValue(mockComponentConfig);
  });

  it('renders fields for regular form', () => {
    render(<RenderFieldGroups {...mockProps} />);

    const renderedFields = screen.getAllByTestId('mock-render-fields');
    expect(renderedFields).toHaveLength(2);
  });

  it('renders fields for customization form', () => {
    render(<RenderFieldGroups {...mockProps} isCustomizationForm={true} />);

    const renderedFields = screen.getAllByTestId('mock-render-fields');
    expect(renderedFields).toHaveLength(2);
  });

  it('uses correct config getter based on isCustomizationForm prop', () => {
    render(<RenderFieldGroups {...mockProps} />);
    expect(getConfigByViewType).toHaveBeenCalledWith('text');
    expect(getCustomizationConfigViewType).not.toHaveBeenCalled();

    render(<RenderFieldGroups {...mockProps} isCustomizationForm={true} />);
    expect(getCustomizationConfigViewType).toHaveBeenCalledWith('text');
  });

  it('handles empty/invalid fields', () => {
    const propsWithInvalidField = {
      ...mockProps,
      obj: {
        viewType: 'text',
        invalidField: 'value'
      }
    };

    render(<RenderFieldGroups {...propsWithInvalidField} />);
    const renderedFields = screen.queryAllByTestId('mock-render-fields');
    expect(renderedFields).toHaveLength(0);
  });

  it('handles readOnly flag in customization form', () => {
    const propsWithReadOnly = {
      ...mockProps,
      obj: {
        ...mockProps.obj,
        readOnly: true
      }
    };

    render(<RenderFieldGroups {...propsWithReadOnly} isCustomizationForm={true} />);
    const renderedFields = screen.getAllByTestId('mock-render-fields');
    expect(renderedFields).toHaveLength(2);
  });
});
