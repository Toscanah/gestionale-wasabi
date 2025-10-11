"use client";

import { SortDirection } from "@/app/(site)/lib/shared/schemas/common/sorting";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface SortDirectionSelectorProps {
  direction: SortDirection;
  fieldType?: "number" | "string" | "date" | "boolean" | "default";
  onDirectionChange: (updatedDirection: SortDirection) => void;
}

const DIRECTION_LABELS = {
  number: ["Piccolo", "Grande"],
  string: ["A", "Z"],
  date: ["Vecchio", "Nuovo"],
  boolean: ["Falsi", "Veri"],
  default: ["Ascendente", "Discendente"],
};

export default function SortDirectionSelector({
  direction,
  fieldType = "default",
  onDirectionChange,
}: SortDirectionSelectorProps) {
  const toggle = () => onDirectionChange(direction === "asc" ? "desc" : "asc");
  const labels = DIRECTION_LABELS[fieldType] ?? DIRECTION_LABELS.default;

  // Swap labels depending on current direction
  const [leftLabel, rightLabel] = direction === "asc" ? labels : ([labels[1], labels[0]] as const);

  return (
    <Button
      variant="outline"
      onClick={toggle}
      className="flex items-center gap-2 relative overflow-hidden px-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`left-${leftLabel}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className=" text-right"
        >
          {leftLabel}
        </motion.span>
      </AnimatePresence>

      <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`right-${rightLabel}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className=" text-left"
        >
          {rightLabel}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
