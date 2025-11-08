import { PromotionContracts } from "../../shared";
import prisma from "../prisma";

export default async function deletePromotionById(
  input: PromotionContracts.DeleteById.Input
): Promise<PromotionContracts.DeleteById.Output> {
  const { id } = input;

  await prisma.promotion.delete({
    where: { id },
  });

  return { id };
}
