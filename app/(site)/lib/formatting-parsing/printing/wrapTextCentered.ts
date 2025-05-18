export default function wrapTextCentered(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;

    if (testLine.length > maxChars) {
      // Push the current line centered
      lines.push(centerLine(currentLine, maxChars));
      currentLine = word; // Start a new line with this word
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(centerLine(currentLine, maxChars));
  }

  return lines;
}

function centerLine(line: string, maxChars: number): string {
  const totalPadding = maxChars - line.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return " ".repeat(leftPadding) + line + " ".repeat(rightPadding);
}
