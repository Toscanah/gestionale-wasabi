import { useState, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";

export default function useQueryFilter(delay: number = 500) {
  const [inputQuery, setInputQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const debouncedUpdate = useMemo(
    () => debounce((val: string) => setDebouncedQuery(val), delay),
    [delay]
  );

  useEffect(() => {
    debouncedUpdate(inputQuery);
    return () => debouncedUpdate.cancel();
  }, [inputQuery, debouncedUpdate]);

  return {
    debouncedQuery,
    inputQuery,
    setInputQuery,
  };
}
