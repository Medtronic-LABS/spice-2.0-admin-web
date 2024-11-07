import { render, screen } from '@testing-library/react';
import TextEditor from '../WysiwygEditor';

const mockChildComponent = jest.fn();
jest.mock('jodit-react', () => (props: any) => {
  mockChildComponent(props);
  return <div data-testid='jodit-editor'>Mock Editor</div>;
});

describe('TextEditor', () => {
  it('Should render with test id', () => {
    const props = {
      editorContent: '',
      setEditorContent: jest.fn()
    };
    render(<TextEditor {...props} />);
    expect(screen.getByTestId('jodit-editor')).toBeInTheDocument();
  });

  it('calls setEditorContent when onBlur is triggered', () => {
    const setEditorContentMock = jest.fn();
    const props = {
      editorContent: 'initial content',
      setEditorContent: setEditorContentMock
    };

    render(<TextEditor {...props} />);

    const lastCall = mockChildComponent.mock.calls[mockChildComponent.mock.calls.length - 1][0];

    lastCall.onBlur('new content');

    expect(setEditorContentMock).toHaveBeenCalledWith('new content');
  });

  it('Should render with test id and editorConfig', () => {
    const props = {
      editorContent: '',
      setEditorContent: jest.fn(),
      editorConfig: {
        toolbarSticky: true,
        spellcheck: false,
        height: 500
      }
    };
    render(<TextEditor {...props} />);
    expect(screen.getByTestId('jodit-editor')).toBeInTheDocument();
  });
});
