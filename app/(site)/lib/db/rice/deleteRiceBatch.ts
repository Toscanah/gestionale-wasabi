import { RiceContract } from "../../shared";
import prisma from "../db";

export default async function deleteRiceBatch({ id }: RiceContract["Requests"]["DeleteRiceBatch"]) {
  return prisma.riceBatch.delete({
    where: { id },
  });
}
