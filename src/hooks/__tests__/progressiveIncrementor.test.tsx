import { renderHook } from '@testing-library/react-hooks';
import { useProgressiveIncrementorHook } from '../progressiveIncrementor';

jest.useFakeTimers();

describe('useProgressiveIncrementorHook', () => {
  const mockCallBack = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should start the timer and increment timerVal until stopAt is reached', () => {
    const { result } = renderHook(() =>
      useProgressiveIncrementorHook({
        displayProgress: true,
        callBack: mockCallBack
      })
    );

    expect(result.current).toBe(0);

    jest.runAllTimers();

    expect(result.current).toBe(0);

    jest.runAllTimers();

    expect(result.current).toBe(0);

    jest.runAllTimers();

    expect(result.current).toBe(0);

    jest.runAllTimers();

    expect(result.current).toBe(0);
  });

  test('should not start the timer when displayProgress is false without env variables', () => {
    const { result } = renderHook(() =>
      useProgressiveIncrementorHook({
        displayProgress: false,
        callBack: mockCallBack
      })
    );

    expect(result.current).toBe(0);
  });

  test('should not start the timer when displayProgress is false with env variables', () => {
    process.env.REACT_APP_ORG_SUCCESS_DELAY_TIME = '1000';
    const { result } = renderHook(() =>
      useProgressiveIncrementorHook({
        displayProgress: false,
        callBack: mockCallBack
      })
    );

    expect(result.current).toBe(0);
  });

  test('should clean up timers when unmounted', () => {
    const { unmount } = renderHook(() =>
      useProgressiveIncrementorHook({
        displayProgress: true,
        callBack: mockCallBack
      })
    );

    unmount();
  });

  test('should start the timer and increment timerVal until stopAt is reached', () => {
    const { result } = renderHook(() =>
      useProgressiveIncrementorHook({
        displayProgress: true,
        callBack: mockCallBack
      })
    );

    expect(result.current).toBe(0);
    expect(mockCallBack).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(mockCallBack).toHaveBeenCalledWith(true);
    expect(mockCallBack).toHaveBeenCalledTimes(1);
  });
});
