export default function splitOptionsInLines(
  text: string,
  maxChars: number,
  padding: number
): string[] {
  const items = text.split(", ");
  const lines: string[] = [];
  let currentLine = "";

  items.forEach((item, index) => {
    const itemLength = currentLine.length > 0 ? currentLine.length + item.length + 2 : item.length;

    if (itemLength > maxChars - (padding + 3)) {
      lines.push(`${" ".repeat(padding)}${currentLine.trim()}`);
      currentLine = item;
    } else {
      currentLine += (currentLine ? ", " : "") + item;
    }
  });

  if (currentLine) {
    lines.push(`${" ".repeat(padding)}${currentLine.trim()}`);
  }

  return lines;
}
