import { shallow } from 'enzyme';
import TextEditor from '../WysiwygEditor';
import { TOOLBAR_BUTTONS } from '../ToolBarButtons';

describe('TextEditor', () => {
  it('renders without errors', () => {
    const props = {
      editorContent: '',
      setEditorContent: jest.fn()
    };
    const wrapper = shallow(<TextEditor {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the editor content', () => {
    const props = {
      editorContent: 'Hello world',
      setEditorContent: jest.fn()
    };
    const wrapper = shallow(<TextEditor {...props} />);
    expect(wrapper.find('JoditEditor').prop('value')).toEqual('Hello world');
  });

  it('calls the setEditorContent function when onBlur event is triggered', () => {
    const setEditorContentMock = jest.fn();
    const props = {
      editorContent: '',
      setEditorContent: setEditorContentMock
    };
    const wrapper = shallow(<TextEditor {...props} />);
    wrapper.find('JoditEditor').simulate('blur', 'New content');
    expect(setEditorContentMock).toHaveBeenCalledWith('New content');
  });

  it('applies the default configuration properties', () => {
    const props = {
      editorContent: '',
      setEditorContent: jest.fn()
    };
    const wrapper = shallow(<TextEditor {...props} />);
    const config: any = wrapper.find('JoditEditor').prop('config');
    expect(config.disabled).toBe(false);
    expect(config.readonly).toBe(false);
    expect(config.placeholder).toBe('');
    expect(config.toolbarButtonSize).toBe('small');
    expect(config.height).toBe(400);
    expect(config.buttons).toBe(TOOLBAR_BUTTONS.toString());
    expect(config.extraButtons).toBeUndefined();
  });
});
