import { ProductWithInfo } from "../../types/ProductWithInfo";
import prisma from "../db";

export default async function editProduct(newProduct: ProductWithInfo) {
  return await prisma.product.update({
    where: {
      id: newProduct.id,
    },
    data: {
      category: {
        connect: {
          id: Number(newProduct.category)
        }
      },
      code: newProduct.code,
      desc: newProduct.desc,
      site_price: newProduct.site_price,
      home_price: newProduct.home_price,
      rice: newProduct.rice,
      // TODO:
      // options: {
      //   set: product.options.map((option) => ({
      //     id: option.id,
      //   })),
      // },
    },
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
  });
}
