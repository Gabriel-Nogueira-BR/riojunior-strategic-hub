import { useState, useEffect, useCallback } from 'react';

// Simple global year state using a module-level variable
let globalYear = new Date().getFullYear();
let listeners: Set<() => void> = new Set();

export function useGlobalYear(): [number, (year: number) => void] {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  const setYear = useCallback((year: number) => {
    globalYear = year;
    listeners.forEach(l => l());
  }, []);
  
  return [globalYear, setYear];
}

export function getGlobalYear(): number {
  return globalYear;
}
