import { useEffect, useState, useCallback } from 'react';

const useFetch = (apiFunction, params = null, options = {}) => {
  const { maxRetries = 3, retryDelay = 2000 } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (retries = maxRetries) => {

    try {
      setLoading(true);
      const result = await apiFunction(params);
      setData(result);
      setError(null);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), retryDelay);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params, maxRetries, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData }
};

export default useFetch;
