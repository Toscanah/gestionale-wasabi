import { Option } from "@/prisma/generated/zod";
import prisma from "../db";
import { OptionOption } from "../../backend/categories/CategoryOptions";

export default async function getAllOptions(): Promise<OptionOption[]> {
  const options = await prisma.option.findMany();

  return options.map((option) => ({
    option: {
      ...option,
    },
  }));
}
