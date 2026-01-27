import { useState } from "react";
import { z } from "zod";

const RiceSchema = z.object({
  total: z.number(),
  threshold: z.number(),
  remainingLunch: z.number(),
  remainingDinner: z.number(),
});

export type Rice = z.infer<typeof RiceSchema>;

const DEFAULT_RICE: Rice = {
  total: 0,
  threshold: 0,
  remainingLunch: 0,
  remainingDinner: 0,
};

export default function useRiceState() {
  const [rice, setRice] = useState<Rice>(DEFAULT_RICE);

  const save = (updater: (prev: Rice) => Rice) => {
    setRice((prev) => {
      const next = updater(prev);
      localStorage.setItem("rice", JSON.stringify(next));
      return next;
    });
  };

  const load = (): Rice => {
    const raw = localStorage.getItem("rice");

    try {
      const parsed = raw ? JSON.parse(raw) : null;
      if (RiceSchema.safeParse(parsed).success) return parsed;
    } catch {}

    localStorage.setItem("rice", JSON.stringify(DEFAULT_RICE));
    return DEFAULT_RICE;
  };

  return { rice, save, load };
}
