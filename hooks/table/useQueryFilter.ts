import { useState, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";

export default function useQueryFilter(delay: number = 500, initialQuery: string = "") {
  const [inputQuery, setInputQuery] = useState<string>(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);

  const debouncedUpdate = useMemo(
    () => debounce((val: string) => setDebouncedQuery(val), delay),
    [delay]
  );

  useEffect(() => {
    debouncedUpdate(inputQuery);
    return () => debouncedUpdate.cancel();
  }, [inputQuery, debouncedUpdate]);

  const resetQuery = () => {
    setInputQuery("");
    setDebouncedQuery(""); // ← instantly clears both states
  };

  return {
    debouncedQuery,
    inputQuery,
    setInputQuery,
    resetQuery,
  };
}
