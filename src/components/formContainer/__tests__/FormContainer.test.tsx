import FormContainer from '../FormContainer';
import { render, screen } from '@testing-library/react';

describe('FormContainer', () => {
  beforeEach(() => {
    render(
      <FormContainer label='Form Label' icon='test-icon.png'>
        <div data-testid='test-child' />
      </FormContainer>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the header tag with the correct text', () => {
    const header = screen.getByRole('banner');
    expect(header).toHaveTextContent('Form Label');
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders an icon when provided', () => {
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(img.src).toContain('test-icon.png');
  });

  it('renders a label when provided', () => {
    const label = 'Form Label';
    const bTag = screen.getByText(label);
    expect(bTag).toHaveTextContent(label);
  });

  it('renders a className when provided', () => {
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders required label witout image icon', () => {
    render(
      <FormContainer label='Form Label' required={true}>
        <div data-testid='test-child' />
      </FormContainer>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
