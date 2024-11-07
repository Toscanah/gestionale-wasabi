export default function formatReceiptText(text: string, maxChar: number, leftPadding: number = 0) {
  const truncatedText = text.length > maxChar ? text.slice(0, maxChar) : text;
  return truncatedText.padEnd(maxChar + leftPadding, " ");
}
