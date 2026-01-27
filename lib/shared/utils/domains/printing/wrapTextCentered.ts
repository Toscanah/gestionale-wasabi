import splitIntoLines from "../../global/string/splitIntoLines";

export default function wrapTextCentered(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  return splitIntoLines(words, maxChars, " ", (line) => centerLine(line, maxChars));
}

function centerLine(line: string, maxChars: number): string {
  const totalPadding = maxChars - line.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return " ".repeat(leftPadding) + line + " ".repeat(rightPadding);
}
