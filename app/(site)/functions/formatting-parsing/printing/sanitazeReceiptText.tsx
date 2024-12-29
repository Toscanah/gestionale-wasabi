export default function sanitazeReceiptText(input: string | undefined): string {
  if (!input) return "";

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

  return input.replace(/[ÀÈÌÒÙàèìòù]/g, (char) => replacements[char] || char).toLocaleUpperCase();
}
