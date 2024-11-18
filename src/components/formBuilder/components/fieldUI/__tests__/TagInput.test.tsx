import { render, screen, fireEvent } from '@testing-library/react';
import TagInput, { ITagInputProps } from '../TagInput';

describe('TagInput Component', () => {
  const props: ITagInputProps = {
    defaultValue: ['tag1', 'tag2'],
    onChange: jest.fn(),
    label: 'Tags',
    required: true,
    disabled: false,
    error: '',
    classChange: ''
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it('should render the component with default props', () => {
    render(<TagInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render the component with all props', () => {
    render(<TagInput {...props} />);

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should add a new tag when Enter key is pressed', () => {
    render(<TagInput {...props} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'newTag' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(props.onChange).toHaveBeenCalledTimes(0);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(input).toHaveValue('newTag');
  });

  it('should not add a tag when Enter key is pressed and input value is empty', () => {
    render(<TagInput {...props} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(props.onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should not add a tag when Enter key is pressed and input value already exists in the tags', () => {
    render(<TagInput {...props} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'tag1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(props.onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should remove a tag when Remove button is clicked', () => {
    render(<TagInput {...props} />);
    const removeButton = screen.getAllByTestId('remove-tag')[0];

    fireEvent.click(removeButton);
    jest.runAllTimers();

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('should remove the last tag when Backspace key is pressed and input value is empty', () => {
    render(<TagInput {...props} />);
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace', keyCode: 8 });
    jest.runAllTimers();

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('should add a tag when Enter key is pressed and input value is a number', () => {
    render(<TagInput {...props} allowOnlyNumbers={true} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });
    jest.runAllTimers();

    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  it('should handle onChange from fromChiefDom props', () => {
    render(<TagInput {...props} fromChiefDom={true} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'newTag' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    expect(input).toHaveValue('');
  });

  it('should render with disabled as true and empty defaultValue', () => {
    render(<TagInput {...props} disabled={true} defaultValue={[]} allowOnlyNumbers={true} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'xyz' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });
    jest.runAllTimers();

    expect(input).toHaveValue('');
  });
});
