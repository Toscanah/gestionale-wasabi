import { z } from "zod";

function normalizeTime(input: string): string {
  // Trim + unify separator
  let clean = input.trim().replace(/[.\-]/g, ":");

  // Split into [hh, mm]
  let [hStr, mStr] = clean.split(":");

  // If minutes missing, assume "00"
  if (mStr === undefined) mStr = "00";

  // Parse ints (fallback to 0 if NaN)
  let hours = parseInt(hStr, 10);
  let minutes = parseInt(mStr, 10);

  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;

  // Clamp values
  if (hours > 23) hours = 23;
  if (hours < 0) hours = 0;
  if (minutes > 59) minutes = 59;
  if (minutes < 0) minutes = 0;

  // Return normalized HH:mm
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export const TimeWindowFilterSchema = z.object({
  timeWindow: z.object({
    from: z
      .string()
      .transform(normalizeTime)
      .refine((t) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t), {
        message: "Invalid time format",
      }),
    to: z
      .string()
      .transform(normalizeTime)
      .refine((t) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t), {
        message: "Invalid time format",
      }),
  }).refine(
    ({ from, to }) => {
      // Compare as minutes since midnight
      const [fh, fm] = from.split(":").map(Number);
      const [th, tm] = to.split(":").map(Number);
      return th * 60 + tm >= fh * 60 + fm;
    },
    {
      message: '"to" time must not be earlier than "from" time',
      path: ["to"],
    }
  ),
});

export type TimeWindowFilter = z.infer<typeof TimeWindowFilterSchema>;
