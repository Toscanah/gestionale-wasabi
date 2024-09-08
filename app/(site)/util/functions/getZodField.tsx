import { z } from "zod";

const getZodField = (
  type: "number" | "string" | "any" | "array" | "boolean",
  required: boolean = true
) => {
  const requiredMsg = "Questo campo è richiesto";

  switch (type) {
    case "number":
      return required
        ? z.coerce
            .number({ required_error: requiredMsg })
            .gt(0, { message: "Questo campo non può essere 0" })
        : z.coerce.number().optional();
    case "string":
      return required
        ? z.string({ required_error: requiredMsg }).min(1, { message: requiredMsg })
        : z.string().optional();
    case "array":
      return required
        ? z.any().array().min(1, { message: requiredMsg })
        : z.any().array().optional();
    case "boolean":
      return z.coerce.boolean();
    case "any":
      return required ? z.any({ required_error: requiredMsg }) : z.any().optional();
  }
};

export default getZodField;
