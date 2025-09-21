import { z } from "zod";

export default function getZodField(
  type: "number" | "string" | "any" | "array" | "boolean",
  required: boolean = true
) {
  const requiredMsg = "Questo campo è richiesto";

  switch (type) {
    case "number":
      return required
        ? z.coerce
            .number({ error: (issue) => (issue.expected ? requiredMsg : undefined) })
            .gt(0, { message: "Questo campo non può essere 0" })
        : z.coerce.number().optional();
    case "string":
      return required
        ? z
            .string({ error: (issue) => (issue.expected ? requiredMsg : undefined) })
            .min(1, { message: requiredMsg })
        : z.string().optional();
    case "array":
      return required
        ? z.any().array().min(1, { message: requiredMsg })
        : z.any().array().optional();
    case "boolean":
      return z.coerce.boolean();
    case "any":
      return required
        ? z.custom((val) => val !== undefined && val !== null, { message: requiredMsg })
        : z.any().optional();
  }
}
// error: (issue) => (issue.expected ? requiredMsg : undefined)
