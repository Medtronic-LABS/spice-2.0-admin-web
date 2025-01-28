import { render, screen } from '@testing-library/react';
import ReorderView from '../ReorderView';
import APPCONSTANTS from '../../../../../constants/appConstants';

const mockChildComponent = jest.fn();
jest.mock('../ReorderModel', () => ({
  ...jest.requireActual('../ReorderModel'), // Preserve other exports if they exist
  ReorderModel: (props: any) => {
    mockChildComponent(props);
    return <div data-testid='reorder-modal-container' />;
  }
}));

describe('ReorderView', () => {
  const mockSetFormMeta = jest.fn();
  const mockSetFamilyOrderModelOpen = jest.fn();
  const mockSetEditGroupedFieldsOrder = jest.fn();

  const defaultProps = {
    formRef: {
      current: {
        getState: () => ({
          values: {
            family1: {
              family1: { familyOrder: 1, id: 1 },
              field1: { orderId: 1, id: 1 },
              field2: { orderId: 2, id: 2 }
            }
          }
        })
      }
    },
    isFamilyOrderModelOpen: false,
    setFamilyOrderModelOpen: mockSetFamilyOrderModelOpen,
    setFormMeta: mockSetFormMeta,
    editGroupedFieldsOrder: {
      isOpen: false,
      familyName: ''
    },
    setEditGroupedFieldsOrder: mockSetEditGroupedFieldsOrder
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render ReorderModel when modals are closed', () => {
    render(<ReorderView {...defaultProps} />);
    expect(screen.queryByTestId('reorder-modal-container')).not.toBeInTheDocument();
  });

  it('should render family order ReorderModel when isFamilyOrderModelOpen is true', () => {
    render(<ReorderView {...defaultProps} isFamilyOrderModelOpen={true} />);
    expect(screen.getByTestId('reorder-modal-container')).toBeInTheDocument();
  });

  it('should render field order ReorderModel when editGroupedFieldsOrder is open', () => {
    render(
      <ReorderView
        {...defaultProps}
        editGroupedFieldsOrder={{
          isOpen: true,
          familyName: 'family1'
        }}
      />
    );

    expect(screen.getByTestId('reorder-modal-container')).toBeInTheDocument();
  });

  it('handle onSubmit for family order', () => {
    render(<ReorderView {...defaultProps} isFamilyOrderModelOpen={true} />);
    const mockFamilyReorder: any = mockChildComponent.mock.calls[0][0];
    mockFamilyReorder.onSubmit();
    expect(mockSetFamilyOrderModelOpen).toHaveBeenCalledWith(false);
  });

  it('handle onCancel for family order', () => {
    render(<ReorderView {...defaultProps} isFamilyOrderModelOpen={true} />);
    const mockFamilyReorder: any = mockChildComponent.mock.calls[0][0];
    mockFamilyReorder.onCancel();
    expect(mockSetFamilyOrderModelOpen).toHaveBeenCalledWith(false);
  });

  it('handle onSubmit for field order', () => {
    render(
      <ReorderView
        {...defaultProps}
        editGroupedFieldsOrder={{
          isOpen: true,
          familyName: 'family1'
        }}
      />
    );

    const mockFieldReorder: any = mockChildComponent.mock.calls[0][0];
    mockFieldReorder.onSubmit();
    expect(mockSetEditGroupedFieldsOrder).toHaveBeenCalledWith({
      isOpen: false,
      familyName: ''
    });
  });

  it('handle onCancel for field order', () => {
    render(
      <ReorderView
        {...defaultProps}
        editGroupedFieldsOrder={{
          isOpen: true,
          familyName: 'family1'
        }}
      />
    );

    const mockFieldReorder: any = mockChildComponent.mock.calls[0][0];
    mockFieldReorder.onCancel();
    expect(mockSetEditGroupedFieldsOrder).toHaveBeenCalledWith({
      isOpen: false,
      familyName: ''
    });
  });

  // branch coverage
  it('should handle family with no family name', () => {
    const noFamiltyFormRef = {
      formRef: {
        current: {
          getState: () => ({
            values: {
              [APPCONSTANTS.NO_FAMILY]: {
                family1: { familyOrder: 1, id: 1 },
                field1: { orderId: 1, id: 1 },
                field2: { orderId: 2, id: 2 }
              }
            }
          })
        }
      }
    };
    render(<ReorderView {...defaultProps} isFamilyOrderModelOpen={true} {...noFamiltyFormRef} />);
    screen.debug();
    const mockFamilyReorder: any = mockChildComponent.mock.calls[0][0];
    mockFamilyReorder.onSubmit();
    expect(mockSetFamilyOrderModelOpen).toHaveBeenCalledWith(false);
  });

  it('handle onSubmit for family order with different order', () => {
    render(<ReorderView {...defaultProps} isFamilyOrderModelOpen={true} />);
    const mockFamilyReorder: any = mockChildComponent.mock.calls[0][0];
    mockFamilyReorder.orderRef.current = { family1: 1 };
    mockFamilyReorder.onSubmit();
    expect(mockSetFamilyOrderModelOpen).toHaveBeenCalledWith(false);
  });

  it('handle onSubmit for field order with different order', () => {
    render(
      <ReorderView
        {...defaultProps}
        editGroupedFieldsOrder={{
          isOpen: true,
          familyName: 'family1'
        }}
      />
    );

    const mockFieldReorder: any = mockChildComponent.mock.calls[0][0];
    mockFieldReorder.orderRef.current = { field1: 2, field2: 1, family1: 1 };
    mockFieldReorder.onSubmit();
    expect(mockSetEditGroupedFieldsOrder).toHaveBeenCalledWith({
      isOpen: false,
      familyName: ''
    });
  });
});
