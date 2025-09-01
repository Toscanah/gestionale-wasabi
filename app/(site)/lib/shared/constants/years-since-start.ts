export const STARTING_YEAR = 2025;
export const YEARS_SINCE_START = Array.from(
  { length: new Date().getFullYear() - STARTING_YEAR + 2 },
  (_, i) => STARTING_YEAR + i
).sort((a, b) => a - b);
