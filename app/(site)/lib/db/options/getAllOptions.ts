import prisma from "../prisma";
import { OptionContracts } from "../../shared";

export default async function getAllOptions(input: OptionContracts.GetAll.Input): Promise<OptionContracts.GetAll.Output> {
  return await prisma.option.findMany();
}
