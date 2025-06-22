import splitIntoLines from "../splitIntoLines";

export default function splitOptionsInLines(
  text: string,
  maxChars: number,
  padding: number
): string[] {
  const items = text.split(", ");
  return splitIntoLines(
    items,
    maxChars - padding - 3,
    ", ",
    (line) => " ".repeat(padding) + line.trim()
  );
}
