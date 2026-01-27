import React from "react";

/**
 * Renders a message string, wrapping {{number}} variables in a red span.
 * @param text The input string with variables like {{0}}, {{1}}, etc.
 */
export default function renderTextWithVariables(text: string): React.ReactNode[] {
  const parts = text.split(/(\{\{\d+\}\})/g); // use literal here to keep placeholders

  return parts.map((part, index) => {
    if (/^\{\{\d+\}\}$/.test(part)) {
      return (
        <span key={index} className="text-red-500 font-mono font-semibold">
          {part}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
