import { render } from '@testing-library/react';
import Loader from '../Loader';

jest.mock('../../../hooks/progressiveIncrementor', () => ({
  useProgressiveIncrementorHook: ({ callBack }: { callBack: (x: boolean) => void }) => {
    callBack(true);
    return 50; // Mock return value for count
  }
}));

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader callBack={jest.fn()} />);
  });

  it('renders the progress bar', () => {
    const { getByText } = render(<Loader isProgressVisible={true} />);
    expect(getByText(/%$/)).toBeInTheDocument();
  });

  it('calls the callback function when progress updates', () => {
    const mockCallback = jest.fn();
    render(<Loader isProgressVisible={true} callBack={mockCallback} />);

    expect(mockCallback).toHaveBeenCalledWith(true);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
