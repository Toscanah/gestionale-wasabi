export type Gender = "m" | "f";

const FEM_SUFFIXES = ["zione", "sione", "gione", "trice", "tudine", "udine", "tà", "tù", "si"];
const MASC_SUFFIXES = ["mento", "aggio", "ame", "ume", "ore"];

/**
 * Infer the grammatical gender ("m" or "f") of an Italian noun-like title.
 *
 * This function extracts the first word of the provided `title` (trimming
 * whitespace and splitting on runs of whitespace) and applies a sequence of
 * heuristics to determine gender:
 * 1. If the first word is empty, returns "m".
 * 2. If the word ends with any suffix listed in `FEM_SUFFIXES`, returns "f".
 * 3. If the word ends with any suffix listed in `MASC_SUFFIXES`, returns "m".
 * 4. If the word ends with "a", returns "f".
 * 5. If the word ends with "o", returns "m".
 * 6. Otherwise, defaults to "m".
 *
 * The checks are case-insensitive.
 *
 * @param title - The input title or noun phrase from which to infer gender.
 *                Only the first whitespace-separated token is considered.
 * @returns The inferred gender as a `Gender` literal: `"m"` for masculine or
 *          `"f"` for feminine. An empty or unrecognized word defaults to `"m"`.
 *
 * @remarks
 * - The function is pure and has no side effects.
 * - It relies on the module-level arrays `FEM_SUFFIXES` and `MASC_SUFFIXES`
 *   for explicit suffix-based determinations; ensure those arrays are kept
 *   up-to-date for desired behavior.
 *
 * @example
 * inferItalianGender("Ragazza moderna"); // -> "f"
 * inferItalianGender("Cameriere");       // -> "m"
 * inferItalianGender("  orecchio  ");    // -> "m"
 * inferItalianGender("");                // -> "m"
 */
export function inferItalianGender(title: string): Gender {
  const word = title.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (!word) return "m";
  if (FEM_SUFFIXES.some((s) => word.endsWith(s))) return "f";
  if (MASC_SUFFIXES.some((s) => word.endsWith(s))) return "m";
  if (word.endsWith("a")) return "f";
  if (word.endsWith("o")) return "m";
  return "m";
}
