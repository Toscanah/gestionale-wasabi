export default function splitOptionsInLines(
  text: string,
  maxChars: number,
  padding: number
): string[] {
  const items = text.split(", "); // Split by ', ' for individual options
  const lines: string[] = [];
  let currentLine = "";

  items.forEach((item, index) => {
    // Calculate length including ", " only if it's not the last item
    const itemLength =
      currentLine.length > 0
        ? currentLine.length + item.length + 2 // Add 2 for ", "
        : item.length;

    if (itemLength > maxChars - (padding + 3)) {
      // Push the current line and start a new one
      lines.push(`${" ".repeat(padding)}${currentLine.trim()}`);
      currentLine = item; // Start a new line with the current item
    } else {
      // Append the current item to the line
      currentLine += (currentLine ? ", " : "") + item;
    }
  });

  // Push the last line if it exists
  if (currentLine) {
    lines.push(`${" ".repeat(padding)}${currentLine.trim()}`);
  }

  return lines;
}
