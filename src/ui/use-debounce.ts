import { useEffect, useState } from 'react';

export function useDebounce(value: string, delay = 300) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);
  return settled;
}
