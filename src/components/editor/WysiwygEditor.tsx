import JoditEditor from 'jodit-react';
import { TOOLBAR_BUTTONS } from './ToolBarButtons';

interface IExtraButton {
  name: string;
  exec: (editor: any) => void;
  icon?: string;
  tooltip?: string;
}

interface ITextEditorConfigs {
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  extraButtons?: IExtraButton[];
  height?: number;
  buttons?: string;
  toolbarButtonSize?: 'small' | 'tiny' | 'xsmall' | 'middle' | 'large';
}

interface ITextEditorProps {
  editorContent: any;
  setEditorContent?: any;
  editorConfig?: ITextEditorConfigs;
  basicConfig?: any;
  removeCustomHeight?: boolean;
}

/**
 * TextEditor component for rendering a WYSIWYG editor using Jodit.
 *
 * @param {ITextEditorProps} props - The props for the TextEditor component
 * @param {any} props.editorContent - The current content of the editor
 * @param {function} props.setEditorContent - Function to update the editor content
 * @param {ITextEditorConfigs} props.editorConfig - Optional configuration for the editor
 */
const TextEditor = ({
  editorContent,
  setEditorContent,
  editorConfig,
  basicConfig,
  removeCustomHeight
}: ITextEditorProps) => {
  const basicEditorConfig = {
    toolbarSticky: true,
    spellcheck: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    autoHeight: false,
    allowResizeY: false,
    allowResizeX: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    showTooltip: true,
    showTooltipDelay: 0,
    iframe: true,
    editHTMLDocumentMode: true,
    iframeStyle: '',
    style: {
      background: 'white'
    },
    dataEnableGrammarly: 'false',
    minHeight: (editorConfig?.height && editorConfig?.height - 40) || 400,
    ...basicConfig
  };

  const initialEditorConfig: ITextEditorConfigs = {
    disabled: editorConfig?.disabled || false,
    readonly: editorConfig?.readonly || false,
    placeholder: editorConfig?.placeholder || '',
    toolbarButtonSize: editorConfig?.toolbarButtonSize || 'small',
    height: editorConfig?.height || 400,
    buttons: editorConfig?.buttons || TOOLBAR_BUTTONS.toString()
  };

  if (removeCustomHeight) {
    delete initialEditorConfig.height;
  }
  return (
    <div>
      <JoditEditor
        value={editorContent}
        config={{ ...basicEditorConfig, ...initialEditorConfig }}
        onBlur={(newContent) => setEditorContent(newContent)}
      />
    </div>
  );
};

export default TextEditor;
