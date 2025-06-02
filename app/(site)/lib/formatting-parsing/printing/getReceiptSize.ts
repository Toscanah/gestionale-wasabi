import { TextSize } from "react-thermal-printer";

export default function getReceiptSize(
  width: TextSize,
  height: TextSize
): { width: TextSize; height: TextSize } {
  return { width, height };
}
