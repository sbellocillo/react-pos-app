import { useState, useCallback } from 'react';

/**
 * Custom hook for counter functionality
 * @param {number} initialValue - Initial counter value
 * @returns {object} - Counter state and methods
 */
export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback((value) => setCount(value), []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
};