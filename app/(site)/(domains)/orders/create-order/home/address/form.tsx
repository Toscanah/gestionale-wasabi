import getZodField from "@/app/(site)/lib/utils/getZodField";
import { z } from "zod";

const formSchema = z.object({
  street: getZodField("string"),
  doorbell: getZodField("string"),
  name: getZodField("string", false),
  surname: getZodField("string", false),
  email: getZodField("string", false),
  floor: getZodField("string", false),
  stair: getZodField("string", false),
  street_info: getZodField("string", false),
  notes: getZodField("string", false),
  contact_phone: getZodField("string", false),
  preferences: getZodField("string", false),
});

export default formSchema;

export type FormValues = z.infer<typeof formSchema>;
