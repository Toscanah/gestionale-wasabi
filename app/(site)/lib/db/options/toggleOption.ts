import { OptionContracts } from "../../shared";
import prisma from "../prisma";

export default async function toggleOption({
  id,
}: OptionContracts.Toggle.Input): Promise<OptionContracts.Toggle.Output> {
  const optionId = id;
  const option = await prisma.option.findUnique({ where: { id: optionId } });

  if (!option) {
    throw new Error("Option not found");
  }

  return prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      active: !option.active,
    },
    select: { id: true, active: true },
  });
}
