import { useEffect, useRef } from 'react';
import { saveFormProgress } from '../services/api';

export default function useAutoSave(formData, delay = 2000) {
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveFormProgress(formData.sessionId, formData).catch(console.warn);
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [formData, delay]);
}