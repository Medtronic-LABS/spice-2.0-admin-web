import { render, screen, fireEvent } from '@testing-library/react';
import { ReorderModel } from '../ReorderModel';
import '@testing-library/jest-dom';
import APPCONSTANTS from '../../../../../constants/appConstants';

const mockChildComponent = jest.fn();
jest.mock('../../../../../components/reorder/ReorderContainer', () => (props: any) => {
  mockChildComponent(props);
  return <div data-testid='reorder-container' />;
});

describe('ReorderModel Component', () => {
  const mockProps = {
    initialValue: {
      values: {
        family1: {
          family1: {
            familyOrder: 1,
            title: 'Family 1'
          },
          field1: {
            id: '1',
            title: 'Field 1',
            orderId: 1
          },
          field2: {
            id: '2',
            title: 'Field 2',
            orderId: 2
          }
        }
      }
    },
    orderRef: { current: {} },
    formName: 'testForm',
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    familyName: 'family1'
  };

  it('renders the component with correct title', () => {
    render(<ReorderModel {...mockProps} />);
    screen.debug();
    expect(screen.getByText('Edit Order')).toBeInTheDocument();
  });

  it('renders with custom reorder title', () => {
    render(<ReorderModel {...mockProps} reorderTitle='Custom Order' />);
    expect(screen.getByText('Custom Order')).toBeInTheDocument();
  });

  it('displays field titles correctly', () => {
    render(<ReorderModel {...mockProps} />);
    expect(screen.getByTestId('reorder-container')).toBeInTheDocument();
  });

  it('handles cancel button click', () => {
    render(<ReorderModel {...mockProps} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('handles confirm button click', () => {
    render(<ReorderModel {...mockProps} />);
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('renders without family name', () => {
    const propsWithoutFamily = {
      ...mockProps,
      familyName: undefined,
      initialValue: {
        values: {
          family1: {
            family1: {
              id: 1,
              familyOrder: 1
            }
          },
          family2: {
            family2: {
              id: 2,
              familyOrder: 2
            }
          }
        }
      }
    };
    render(<ReorderModel {...propsWithoutFamily} />);
    expect(screen.getByText('Edit Order')).toBeInTheDocument();
  });

  it('renders ReorderContainer with items', () => {
    render(<ReorderModel {...mockProps} />);
    const reorderItems = screen.getAllByRole('button');
    expect(reorderItems.length).toBeGreaterThan(0);
  });

  it('handles onReorder', () => {
    render(<ReorderModel {...mockProps} />);
    const mockReorder: any = mockChildComponent.mock.calls[0][0];
    mockReorder.onReorder({ 1: 1, 2: 2 });
  });

  it('initializes idRefs when values are not present', () => {
    const dynamicProps = {
      ...mockProps,
      initialValue: {
        values: {
          family1: {
            family1: {
              familyOrder: 1,
              title: 'Family 1'
            },
            field1: {
              id: '1',
              title: 'Field 1',
              orderId: 1
            }
          }
        }
      }
    };

    const { rerender } = render(<ReorderModel {...dynamicProps} />);

    const updatedProps = {
      ...dynamicProps,
      initialValue: {
        values: {
          family1: {
            family1: {
              familyOrder: 1,
              title: 'Family 1'
            },
            field1: {
              id: '1',
              title: 'Field 1',
              orderId: 1
            },
            field2: {
              id: '2',
              title: 'New Field',
              orderId: 2
            }
          }
        }
      }
    };

    rerender(<ReorderModel {...updatedProps} />);
  });

  it('handles confirm button click', () => {
    render(<ReorderModel {...mockProps} />);
    const confirmButton = screen.getByTestId('confirm-btn');
    fireEvent.click(confirmButton);
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('initializes idRefs with empty array when formattedValue is null', () => {
    const propsWithNullValue = {
      ...mockProps,
      initialValue: {
        values: {
          family1: {
            family1: {}
          }
        }
      }
    };

    render(<ReorderModel {...propsWithNullValue} />);
    expect(screen.getByText('Edit Order')).toBeInTheDocument();
  });

  it('renders with family name as no family', () => {
    const propsWithoutFamily = {
      ...mockProps,
      familyName: undefined,
      initialValue: {
        values: {
          [APPCONSTANTS.NO_FAMILY]: {
            family1: {
              id: 1
            }
          },
          family2: {
            family2: {
              id: 2
            }
          }
        }
      }
    };
    render(<ReorderModel {...propsWithoutFamily} />);
    expect(screen.getByText('Edit Order')).toBeInTheDocument();
  });
});
