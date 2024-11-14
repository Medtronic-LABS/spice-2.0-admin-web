import { render, screen, fireEvent } from '@testing-library/react';
import Questionnaire from '../Questionnaire';

const mockChildComponent = jest.fn();
jest.mock('../TagInput', () => (props: any) => {
  mockChildComponent(props);
  return <div>child component</div>;
});

describe('Questionnaire Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    onChange: mockOnChange,
    label: 'Test Questions',
    required: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<Questionnaire {...defaultProps} />);

    expect(screen.getByTestId('questionnaire-wrapper')).toBeInTheDocument();
    expect(screen.getByText('Test Questions')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Add new Question')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(<Questionnaire onChange={mockOnChange} />);

    expect(screen.queryByText('Test Questions')).not.toBeInTheDocument();
  });

  it('renders without asterisk when required is false', () => {
    render(<Questionnaire {...defaultProps} required={false} />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('adds new question when clicking add button', () => {
    render(<Questionnaire {...defaultProps} />);
    screen.debug(undefined, Infinity);

    const addButton = screen.getByText('Add new Question');
    fireEvent.click(addButton);
  });

  it('handles question text input correctly', async () => {
    render(<Questionnaire {...defaultProps} defaultValue={[{ optionsList: [] }]} />);

    const questionInput: any = screen.getByTestId('question-item').querySelector('[contenteditable="true"]');
    expect(questionInput).toBeInTheDocument();

    if (questionInput) {
      fireEvent.input(questionInput, {
        target: {
          innerText: 'New Question'
        }
      });

      fireEvent.blur(questionInput);

      expect(mockOnChange).toHaveBeenCalledWith([
        {
          id: 'new_question',
          name: 'New Question',
          optionsList: []
        }
      ]);
    }
  });

  it('deletes question when clicking delete button', () => {
    const defaultValue = [{ name: 'Question 1', optionsList: [] }];
    render(<Questionnaire {...defaultProps} defaultValue={defaultValue} />);

    const deleteButton = screen.getByAltText('delete');
    fireEvent.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith(defaultValue);
  });

  it('handles sub-questions changes correctly', async () => {
    render(<Questionnaire {...defaultProps} defaultValue={[{ name: 'Question 1', optionsList: [] }]} />);

    const mockTagInput: any = mockChildComponent.mock.calls[0][0];
    mockTagInput.onChange(['Option 1']);

    expect(mockOnChange).toHaveBeenCalledWith([
      {
        name: 'Question 1',
        optionsList: ['Option 1']
      }
    ]);
  });

  it('does not show delete button when disabled', () => {
    render(
      <Questionnaire {...defaultProps} disabled={true} defaultValue={[{ name: 'Question 1', optionsList: [] }]} />
    );

    expect(screen.queryByAltText('delete')).not.toBeInTheDocument();
  });

  it('does not show add button when disabled', () => {
    render(<Questionnaire {...defaultProps} disabled={true} />);

    expect(screen.queryByText('Add new Question')).not.toBeInTheDocument();
  });
  it('handles question text input correctly with valid defaultValue', () => {
    render(<Questionnaire {...defaultProps} defaultValue={[{ optionsList: [], id: 1 }]} />);

    const questionInput: any = screen.getByTestId('question-item').querySelector('[contenteditable="true"]');
    expect(questionInput).toBeInTheDocument();

    if (questionInput) {
      fireEvent.input(questionInput, {
        target: {
          innerText: 'New Question'
        }
      });

      fireEvent.blur(questionInput);
    }
  });
});
