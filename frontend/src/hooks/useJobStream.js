import { useState, useEffect, useCallback } from 'react';

export const useJobStream = () => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    let eventSource;

    const connect = () => {
      setStatus('connecting');
      eventSource = new EventSource('/api/jobs/stream');

      eventSource.onopen = () => {
        setStatus('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setJobs(data);
        } catch (err) {
          console.error('Failed to parse SSE data:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        setStatus('error');
        eventSource.close();
        // Reconnect after 3 seconds
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const addJobs = useCallback(async (count) => {
    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
    } catch (err) {
      console.error('Failed to add jobs:', err);
    }
  }, []);

  const clearJobs = useCallback(async () => {
    try {
      await fetch('/api/jobs', { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear jobs:', err);
    }
  }, []);

  return { jobs, status, addJobs, clearJobs };
};
