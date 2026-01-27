export default function splitIntoLines<T>(
  items: T[],
  maxChars: number,
  joiner: string,
  buildLine: (line: string) => string = (line) => line
): string[] {
  const lines: string[] = [];
  let currentLine = "";

  items.forEach((item) => {
    const itemStr = String(item);
    const nextLine = currentLine ? `${currentLine}${joiner}${itemStr}` : itemStr;

    if (nextLine.length > maxChars) {
      if (currentLine) lines.push(buildLine(currentLine));
      currentLine = itemStr;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(buildLine(currentLine));
  }

  return lines;
}
