import prisma from "../db";

export default async function getAllOptionsWithCategories() {
  const optionsWithCategories = await prisma.option.findMany({
    include: {
      categories: {
        select: {
          category: true,
        },
      },
    },
  });

  // return optionsWithCategories.map((option) => ({
  //   option: { id: option.id, option_name: option.option_name },
  //   categories: option.categories,
  // }));

  return optionsWithCategories
}
