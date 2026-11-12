import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function useApiResource(path, version = 0) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const key = JSON.stringify([path, version, attempt]);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api(path, { signal: controller.signal }).then(
      (data) => { if (!controller.signal.aborted) setResult({ key, data, error: null }); },
      (error) => { if (!controller.signal.aborted) setResult({ key, data: null, error }); },
    );
    return () => controller.abort();
  }, [path, key]);

  const current = result?.key === key ? result : null;
  return { data: current?.data ?? null, error: current?.error ?? null, loading: Boolean(path && !current), retry };
}
