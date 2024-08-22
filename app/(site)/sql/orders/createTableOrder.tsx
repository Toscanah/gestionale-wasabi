import prisma from "../db";

export default async function createTableOrder(content: {
  table: string;
  people: number;
  res_name?: string;
}) {
  const { table, people, res_name } = content;

  const existingTable = await prisma.table.findFirst({
    where: {
      number: table,
    },
  });

  if (!existingTable) {
    return null;
  }

  const createdOrder = await prisma.order.create({
    data: {
      type: "TABLE",
      total: 0,
      table_order: {
        create: {
          table_id: existingTable.id,
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

  return createdOrder;
}
