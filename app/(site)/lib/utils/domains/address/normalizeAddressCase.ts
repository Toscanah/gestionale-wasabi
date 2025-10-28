/**
 * Normalizes the casing of an Italian-style address string.
 *
 * Handles:
 *  ✅ Street abbreviations (v.le → Viale, p.za → Piazza, etc.)
 *  ✅ Articles & prepositions (di, del, della, sul, etc.)
 *  ✅ Apostrophes & elisions (d'Italia → d'Italia, Sant'Anastasio)
 *  ✅ Roman numerals (XX Settembre)
 *  ✅ Ordinals (1o → 1°, 2a → 2ª)
 *  ✅ Acronyms (XXX, SNC)
 *  ✅ Hyphenated names (San-Giovanni)
 *  ✅ Street types (Via, Viale, Galleria, Molo, Riva, Pendice, etc.)
 *  ✅ Local fixes (Torri d'Europa, Sant'Anastasio, Ospedale, etc.)
 *  ✅ Parentheses/lowercasing inside them
 *  ✅ Normalized spacing & punctuation
 */

export default function normalizeAddressCase(input: string): string {
  if (!input) return "";

  let trimmed = input.trim();
  if (!trimmed) return "";

  // --- STEP 1: Preprocess ---
  trimmed = trimmed.replace(/\s{2,}/g, " ").replace(/\s+([,;:])/g, "$1");

  // --- Common abbreviations ---
  const abbreviations: Record<string, string> = {
    "v.": "Via",
    vle: "Viale",
    "v.le": "Viale",
    "p.za": "Piazza",
    "p.zza": "Piazza",
    "c.so": "Corso",
    "l.go": "Largo",
    lgo: "Largo",
    "p.le": "Piazzale",
    "ctr.": "Contrada",
    "loc.": "Località",
    "str.": "Strada",
    "b.go": "Borgo",
  };

  // --- Articles / prepositions ---
  const lowercaseWords = new Set([
    "di",
    "dei",
    "degli",
    "del",
    "della",
    "dello",
    "delle",
    "da",
    "dal",
    "dai",
    "dallo",
    "dalla",
    "dalle",
    "su",
    "sul",
    "sulla",
    "sullo",
    "sulle",
    "a",
    "al",
    "allo",
    "alla",
    "ai",
    "agli",
    "alle",
    "in",
    "nel",
    "nella",
    "nello",
    "nelle",
    "nei",
    "con",
    "per",
    "tra",
    "fra",
    "verso",
    "sotto",
    "sopra",
    "oltre",
    "fuori",
    "d", // for cases like d'europa
  ]);

  // --- Force-capitalize (religious / title / street type keywords) ---
  const forceCapitalize = new Set([
    "san",
    "santo",
    "santa",
    "sant'",
    "don",
    "madonna",
    "papa",
    "via",
    "viale",
    "vicolo",
    "piazza",
    "piazzale",
    "largo",
    "riva",
    "pendice",
    "androna",
    "salita",
    "galleria",
    "foro",
    "fontana",
    "ospedale",
    "strada",
    "molo",
    "bar",
    "rotonda",
    "torri",
  ]);

  const tokens = trimmed.split(/\s+/);

  const normalizedTokens = tokens.map((raw, index) => {
    const word = raw.trim();
    if (!word) return "";

    // Parentheses
    if (/^\(.*\)$/.test(word)) {
      return word[0] + word.slice(1, -1).toLowerCase() + word[word.length - 1];
    }

    // Ordinals & civic numbers
    if (/\d/.test(word)) {
      return word.replace(/(\d+)([oa])\b/gi, (_, n, letter) =>
        letter.toLowerCase() === "o" ? `${n}°` : `${n}ª`
      );
    }

    const lower = word.toLowerCase();

    // Expand abbreviations
    if (abbreviations[lower]) return abbreviations[lower];

    // Apostrophes (d'Italia, l'Aquila)
    if (lower.includes("'")) {
      const [prefix, rest] = lower.split("'");
      if (rest) return prefix.toLowerCase() + "'" + (rest[0].toUpperCase() + rest.slice(1));
      return lower;
    }

    // Hyphenated (San-Giovanni)
    if (lower.includes("-")) {
      return lower
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("-");
    }

    // Acronyms / Roman numerals
    const letters = word.replace(/[^a-zA-Z]/g, "");
    const upperCount = (letters.match(/[A-Z]/g) || []).length;
    const upperRatio = letters.length > 0 ? upperCount / letters.length : 0;
    const isRoman = /^[MDCLXVI]+$/i.test(letters);
    if ((upperRatio > 0.7 && letters.length > 1) || isRoman) return word.toUpperCase();

    // Lowercase small prepositions/articles
    if (lowercaseWords.has(lower)) return lower;

    // Force capitalization for known keywords
    if (forceCapitalize.has(lower)) return lower.charAt(0).toUpperCase() + lower.slice(1);

    // Special case: Sant ANASTASIO → Sant'Anastasio
    if (lower === "anastasio" && index > 0 && tokens[index - 1].toLowerCase() === "sant") {
      return "'Anastasio";
    }

    // Special case: Torri d europa → Torri d'Europa
    if (lower === "europa" && index > 1 && tokens[index - 1].toLowerCase() === "d") {
      return "'Europa";
    }

    // snc (senza numero civico)
    if (lower === "snc") return "snc";

    // Default capitalization
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });

  // Merge tokens back together with post-processing
  let result = normalizedTokens.join(" ");

  // --- POST PROCESSING CLEANUP RULES ---
  result = result
    // Normalize Sant + vowel-start words → Sant'
    .replace(/\bSant ([AEIOUÀÈÉÌÍÒÓÙÚaeiouàèéìíòóùú])/g, "Sant'$1")
    // Fix D ' → d'
    .replace(/\bD '\b/gi, "d'")
    // Fix SANT ' (extra space) → Sant'
    .replace(/\bSANT '\b/gi, "Sant'")
    // Collapse double spaces
    .replace(/\s{2,}/g, " ")
    .trim();

  return result;
}
