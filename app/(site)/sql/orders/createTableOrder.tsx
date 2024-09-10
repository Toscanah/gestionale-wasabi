import prisma from "../db";

export default async function createTableOrder(content: {
  table: string;
  people: number;
  res_name?: string;
}) {
  const { table, people, res_name } = content;

  return await prisma.order.create({
    data: {
      type: "TABLE",
      total: 0,
      table_order: {
        create: {
          table: table,
          res_name: res_name ?? "",
          people: Number(people),
        },
      },
    },
    include: {
      table_order: true,
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            include: {
              option: true,
            },
          },
        },
      },
    },
  });
}
