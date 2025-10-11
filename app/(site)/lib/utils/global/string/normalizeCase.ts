import capitalizeFirstLetter from "./capitalizeFirstLetter";

/**
 * Normalizes the casing of a given string using heuristic rules:
 * - If the string is all uppercase, returns it as-is (e.g. "NASA").
 * - If the string is mostly uppercase (over 70%), converts it to all uppercase.
 * - Otherwise, capitalizes the first word and lowercases the rest.
 *
 * Non-letter characters are ignored for casing heuristics.
 *
 * @param input - The string to normalize.
 * @returns The normalized string with adjusted casing.
 */
export default function normalizeCase(input: string): string {
  if (!input) return "";

  const trimmed = input.trim();
  if (!trimmed) return "";

  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  const upperCount = (letters.match(/[A-Z]/g) || []).length;
  const lowerCount = (letters.match(/[a-z]/g) || []).length;
  const total = upperCount + lowerCount;
  const upperRatio = total > 0 ? upperCount / total : 0;

  // 🧠 Heuristic rules
  if (upperRatio === 1) {
    // All uppercase → keep as-is (e.g. "NASA")
    return trimmed;
  } else if (upperRatio > 0.7) {
    // Mostly uppercase → likely meant to be uppercase
    return trimmed.toUpperCase();
  } else {
    // Otherwise → capitalize first, rest lower
    const words = trimmed.split(/\s+/);
    const normalized = words.map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? capitalizeFirstLetter(lower) : lower;
    });
    return normalized.join(" ");
  }
}
