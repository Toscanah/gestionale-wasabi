export default function extractVariableIndexes(text: string): number[] {
  const matches = [...text.matchAll(/\{\{(\d+)\}\}/g)];
  const indexes = matches.map((match) => parseInt(match[1], 10));
  return Array.from(new Set(indexes)).sort((a, b) => a - b);
}
