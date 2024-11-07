import { render, screen } from '@testing-library/react';
import IconButton from '../IconButton';

const handleClick = jest.fn();
describe('IconButton', () => {
  it('should render with default props with no custom class and style', () => {
    const { unmount } = render(
      <IconButton label='Test Button' handleClick={handleClick} buttonCustomClass={null} buttonCustomStyle={null} />
    );
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    unmount();
  });

  it('should render with default props with custom class and style', () => {
    const { unmount } = render(
      <IconButton
        label='Test Button'
        handleClick={handleClick}
        buttonCustomClass='test-class'
        buttonCustomStyle={{ iconStyle: { color: 'red' }, textStyle: { color: 'blue' } }}
      />
    );
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    unmount();
  });

  it('should render with isEdit props with no custom class and style', () => {
    const { unmount } = render(
      <IconButton
        label='Test Button'
        handleClick={handleClick}
        isEdit={true}
        buttonCustomClass={null}
        buttonCustomStyle={null}
      />
    );
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    unmount();
  });

  it('should render with isEdit props with custom class and style', () => {
    const { unmount } = render(
      <IconButton
        label='Test Button'
        handleClick={handleClick}
        isEdit={true}
        buttonCustomClass='test-class'
        buttonCustomStyle={{ iconStyle: { color: 'red' }, textStyle: { color: 'blue' } }}
      />
    );
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    unmount();
  });

  it('should render with custom icon with custom class and style', () => {
    const { unmount } = render(
      <IconButton
        label='Test Button'
        customIcon='test.svg'
        handleClick={handleClick}
        buttonCustomClass='test-class'
        buttonCustomStyle={{ iconStyle: { color: 'red' }, textStyle: { color: 'blue' } }}
      />
    );
    expect(screen.getByAltText('custom-icon')).toBeInTheDocument();
    unmount();
  });

  it('should render with custom icon without custom class and style', () => {
    const { unmount } = render(
      <IconButton
        label='Test Button'
        customIcon='test.svg'
        handleClick={handleClick}
        buttonCustomClass={null}
        buttonCustomStyle={null}
      />
    );
    expect(screen.getByAltText('custom-icon')).toBeInTheDocument();
    unmount();
  });
});
