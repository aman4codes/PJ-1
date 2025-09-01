import { useState, useEffect } from 'react';

export function useRealTimeUpdates() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { updateTrigger, triggerUpdate };
}