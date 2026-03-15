import React from "react";
import { Raw } from "react-thermal-printer";

interface InvertedTextProps {
  children: React.ReactNode;
  /** Raw bytes to send before the content (default: GS B 1) */
  startCommand?: Uint8Array | number[];
  /** Raw bytes to send after the content (default: GS B 0) */
  endCommand?: Uint8Array | number[];
}

/**
 * Component for rendering text with inverted colors (white text on black background)
 * by sending raw ESC/POS byte sequences through `Raw.data`.
 */
export default function InvertedText({
  children,
  startCommand = new Uint8Array([0x1d, 0x42, 0x01]), // GS B 1 (turn on white/black reverse mode)
  endCommand = new Uint8Array([0x1d, 0x42, 0x00]),   // GS B 0 (turn off white/black reverse mode)
}: InvertedTextProps) {
  return (
    <>
      <Raw data={startCommand} />
      {children}
      <Raw data={endCommand} />
    </>
  );
}