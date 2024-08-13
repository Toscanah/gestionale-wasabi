import prisma from "../db";

export default async function getAllOptions() {
  const options = await prisma.option.findMany();

  return options.map((opt) => ({ option: { id: opt.id, option_name: opt.option_name } }));
}
