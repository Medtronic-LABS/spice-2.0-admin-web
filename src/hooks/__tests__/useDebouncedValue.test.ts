import { renderHook, act } from '@testing-library/react';
import useDebouncedValue from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(({ value }) => useDebouncedValue(value), {
      initialProps: { value: 'initial' }
    });

    expect(result.current).toBe('initial');
  });

  it('updates the debounced value after the default delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value), {
      initialProps: { value: 'first' }
    });

    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('second');
  });

  it('updates the debounced value after a custom delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
      initialProps: { value: [1] }
    });

    rerender({ value: [2] });
    expect(result.current).toEqual([1]);

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toEqual([1]);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toEqual([2]);
  });

  it('cancels pending updates when the value changes again before the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' }
    });

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'c' });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('c');
  });
});
