import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const FailingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary>
        <FailingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(`We're sorry, something went wrong. Please try after sometime.`)).toBeInTheDocument();
  });

  it('renders custom error message when provided', () => {
    const FailingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary message='Oops!'>
        <FailingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops!')).toBeInTheDocument();
  });

  it('resets state when pathname changes', () => {
    const { rerender } = render(
      <ErrorBoundary pathname='/old'>
        <div>Initial Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Initial Content')).toBeInTheDocument();

    const FailingComponent = () => {
      throw new Error('Test Error');
    };

    rerender(
      <ErrorBoundary pathname='/old'>
        <FailingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(`We're sorry, something went wrong. Please try after sometime.`)).toBeInTheDocument();

    rerender(
      <ErrorBoundary pathname='/new'>
        <div>New Content</div>
      </ErrorBoundary>
    );

    expect(screen.queryByText(`We're sorry, something went wrong. Please try after sometime.`)).not.toBeInTheDocument();
    expect(screen.getByText('New Content')).toBeInTheDocument();
  });
});
