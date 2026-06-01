import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConsentForm, { IProps } from '../ConsentForm';

jest.mock('../../../components/formFields/SelectInput', () => ({
  __esModule: true,
  default: ({ input }: any) =>
    require('react').createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'select-input',
        onClick: () => input.onChange({ name: 'Screening', id: 0 })
      },
      'Select form type'
    )
}));

jest.mock('../../../components/editor/WysiwygEditor.tsx', () => ({
  __esModule: true,
  default: () => null
}));

describe('ConsentForm', () => {
  const mockSubmitConsentForm = jest.fn();
  const mockHandleClose = jest.fn();
  const mockHandleDeactivate = jest.fn();
  const mockSetSelectedFormType = jest.fn();

  const props: IProps = {
    title: 'Test Title',
    handleClose: mockHandleClose,
    submitConsentForm: mockSubmitConsentForm,
    handleDeactivate: mockHandleDeactivate,
    setSelectedFormType: mockSetSelectedFormType,
    editorContent: '',
    setEditorContent: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a SelectInput component when isDistrict prop is true', () => {
    render(<ConsentForm {...props} isDistrict={true} />);

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('should not render a SelectInput component when isDistrict prop is false', () => {
    render(<ConsentForm {...props} isDistrict={false} />);

    expect(screen.queryByTestId('select-input')).not.toBeInTheDocument();
  });

  it('should disable the delete consent button when disableDeleteConsentBtn prop is true', () => {
    render(<ConsentForm {...props} disableDeleteConsentBtn={true} />);

    expect(screen.getByRole('button', { name: 'Delete Consent' })).toBeDisabled();
  });

  it('should keep the delete consent button disabled when form selection is incomplete', () => {
    render(<ConsentForm {...props} disableDeleteConsentBtn={false} />);

    expect(screen.getByRole('button', { name: 'Delete Consent' })).toBeDisabled();
  });

  it('should enable the submit button when isDistrict is false', () => {
    render(<ConsentForm {...props} isDistrict={false} />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('should enable the submit button when isDistrict is false and editor content exists', () => {
    render(<ConsentForm {...props} isDistrict={false} editorContent='test' />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('should disable the submit button when isDistrict is true and form type is not selected', () => {
    render(<ConsentForm {...props} isDistrict={true} />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('should enable the submit button when isDistrict is true and form type is selected', async () => {
    const user = userEvent.setup();

    render(<ConsentForm {...props} isDistrict={true} />);

    await user.click(screen.getByTestId('select-input'));

    expect(mockSetSelectedFormType).toHaveBeenCalledWith({ name: 'Screening', id: 0 });
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('handle onClick handleSubmit', async () => {
    const user = userEvent.setup();

    render(<ConsentForm {...props} isDistrict={true} editorContent='test content' />);

    await user.click(screen.getByTestId('select-input'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mockSubmitConsentForm).toHaveBeenCalledWith('test content');
  });
});
