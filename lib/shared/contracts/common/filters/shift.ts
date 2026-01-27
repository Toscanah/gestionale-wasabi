import z from "zod";
import { ShiftFilterValue } from "../../../enums/Shift";

export const ShiftFilterSchema = z.object({
  shift: z.enum(ShiftFilterValue),
})