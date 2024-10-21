import React from 'react';

import OopsImg from '../../assets/images/oops.png';

interface IErrorBoundaryProps {
  message?: string;
  children: string | React.ReactElement | React.ReactElement[];
  pathname?: string;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

/**
 * Derives state from an error that was caught.
 * @param {Error} error - The error that was thrown.
 * @return {IErrorBoundaryState} The new state indicating an error occurred.
 */
export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Logs error information when a child component throws an error.
   * @param {object} error - The error that was thrown.
   * @param {object} errorInfo - Additional information about the error.
   */
  componentDidCatch(error: object, errorInfo: object) {
    console.error(error, errorInfo);
  }

  /**
   * Resets the error state when the pathname prop changes.
   * @param {IErrorBoundaryProps} prevProps - The previous props object.
   */
  componentDidUpdate(prevProps: IErrorBoundaryProps) {
    if (prevProps.pathname !== this.props.pathname) {
      this.setState({ hasError: false });
    }
  }

  /**
   * Render the error UI or the child components.
   */
  render() {
    if (this.state.hasError) {
      return (
        <>
          <img src={OopsImg} alt='oopsImg' className='w-100' />
          <h2 className='text-center'>
            {this.props.message || `We're sorry, something went wrong. Please try after sometime.`}
          </h2>
        </>
      );
    }
    return this.props.children;
  }
}
