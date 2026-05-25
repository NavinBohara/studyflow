import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Sync state with localStorage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = getStorageItem(key);
    return item !== null ? item : initialValue;
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        setStorageItem(key, next);
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const item = getStorageItem(key);
    if (item !== null) setStoredValue(item);
  }, [key]);

  return [storedValue, setValue];
}
