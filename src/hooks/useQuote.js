import { useState, useEffect } from 'react';
import { FALLBACK_QUOTES } from '../utils/constants';

/**
 * Fetch motivational quote from quotable.io API with fallback
 */
export function useQuote() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.quotable.io/random?tags=motivational|success|wisdom');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setQuote({ content: data.content, author: data.author });
    } catch {
      const fallback =
        FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return { quote, loading, refreshQuote: fetchQuote };
}
