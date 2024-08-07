import { z } from "zod";

const getZodField = (
  type: "number" | "string" | "any",
  required: boolean = true
) => {
  const requiredMsg = "Questo campo è richiesto";

  switch (type) {
    case "number":
      return required
        ? z.coerce.number({ required_error: requiredMsg })
        : z.coerce.number().optional();
    case "string":
      return required
        ? z
            .string({ required_error: requiredMsg })
            .min(1, { message: requiredMsg })
        : z.string().optional();
    case "any":
      return required
        ? z.any({ required_error: requiredMsg })
        : z.any().optional();
  }
};

export default getZodField;
