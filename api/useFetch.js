
import { useEffect, useState } from 'react';

const useFetch = (apiFunction, params = null, options = {}) => {
  const { maxRetries = 3, retryDelay = 2000 } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (retries = maxRetries) => {
    try {
      const result = await apiFunction(params);
      setData(result);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), retryDelay);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiFunction, params]);

  return { data, loading, error };
};

export default useFetch;
