import { DEFAULT_WHEN_LABEL, DEFAULT_WHEN_VALUE } from "../../../shared";

export default function formatWhenLabel(when?: string): string | undefined {
  if (when === undefined) {
    return when;
  }

  if (when === DEFAULT_WHEN_VALUE) {
    return DEFAULT_WHEN_LABEL;
  }

  return when;
}
