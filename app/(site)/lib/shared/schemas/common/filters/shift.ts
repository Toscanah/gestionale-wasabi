import z from "zod";
import { ShiftFilterValue } from "../../../enums/shift";

export const ShiftFilterSchema = z.object({
  shift: z.enum(ShiftFilterValue),
})