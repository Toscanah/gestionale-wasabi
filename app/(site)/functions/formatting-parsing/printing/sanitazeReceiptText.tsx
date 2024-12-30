export default function sanitazeReceiptText(input: string | undefined): string {
  const replacements: Record<string, string> = {
    À: "A'",
    È: "E'",
    Ì: "I'",
    Ò: "O'",
    Ù: "U'",
    à: "a'",
    è: "e'",
    ì: "i'",
    ò: "o'",
    ù: "u'",
  };

  return !input
    ? ""
    : input.replace(/[ÀÈÌÒÙàèìòù]/g, (char) => replacements[char] || char).toLocaleUpperCase();
}
