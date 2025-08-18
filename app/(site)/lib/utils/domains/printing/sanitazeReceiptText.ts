const replacements = new Map<string, string>([
  // Accented characters (Italian & common European accents)
  ["À", "A'"],
  ["Á", "A'"],
  ["Â", "A'"],
  ["Ä", "A'"],
  ["Ã", "A'"],
  ["Å", "A'"],
  ["Æ", "AE"],
  ["È", "E'"],
  ["É", "E'"],
  ["Ê", "E'"],
  ["Ë", "E'"],
  ["Ì", "I'"],
  ["Í", "I'"],
  ["Î", "I'"],
  ["Ï", "I'"],
  ["Ò", "O'"],
  ["Ó", "O'"],
  ["Ô", "O'"],
  ["Ö", "O'"],
  ["Õ", "O'"],
  ["Ù", "U'"],
  ["Ú", "U'"],
  ["Û", "U'"],
  ["Ü", "U'"],
  ["Ç", "C"],
  ["Ñ", "N"],

  ["à", "a'"],
  ["á", "a'"],
  ["â", "a'"],
  ["ä", "a'"],
  ["ã", "a'"],
  ["å", "a'"],
  ["æ", "ae"],
  ["è", "e'"],
  ["é", "e'"],
  ["ê", "e'"],
  ["ë", "e'"],
  ["ì", "i'"],
  ["í", "i'"],
  ["î", "i'"],
  ["ï", "i'"],
  ["ò", "o'"],
  ["ó", "o'"],
  ["ô", "o'"],
  ["ö", "o'"],
  ["õ", "o'"],
  ["ù", "u'"],
  ["ú", "u'"],
  ["û", "u'"],
  ["ü", "u'"],
  ["ç", "c"],
  ["ñ", "n"],

  // Common special symbols that might not print well
  ["©", "(C)"],
  ["®", "(R)"],
  ["™", "(TM)"],
  ["°", "grd"],
  ["µ", "u"],
  ["²", "^2"],
  ["³", "^3"],

  // Uncommon punctuation that might cause issues
  ["“", '"'],
  ["”", '"'],
  ["‘", "'"],
  ["’", "'"],
  ["•", "-"],
  ["–", "-"],
  ["—", "-"],
  ["…", "..."],
]);

export default function sanitizeReceiptText(input: string | undefined): string {
  return !input
    ? ""
    : input
        .replace(
          /[\u00C0-\u00FF\u20AC\u00A3\u00A5\u20BD\u00B0\u00B5\u00B2\u00B3\u201C\u201D\u2018\u2019\u2022\u2013\u2014\u2026]/g,
          (char) => replacements.get(char) || char
        )
        .toLocaleUpperCase();
}
