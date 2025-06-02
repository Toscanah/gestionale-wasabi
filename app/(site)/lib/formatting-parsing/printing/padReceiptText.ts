export default function padReceiptText(
  text: string,
  maxChar: number,
  rightPadding: number = 0
): string {
  return (text.length > maxChar ? text.slice(0, maxChar) : text).padEnd(
    maxChar + rightPadding,
    " "
  );
}
