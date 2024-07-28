import { ProductWithInfo } from "../../types/ProductWithInfo";
import prisma from "../db";

export default async function editProduct(product: ProductWithInfo) {
  return await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      category_id: product.category_id,
      name: product.name,
      code: product.code,
      desc: product.desc,
      site_price: product.site_price,
      home_price: product.home_price,
      rice: product.rice,
      // TODO:
      // options: {
      //   set: product.options.map((option) => ({
      //     id: option.id,
      //   })),
      // },
    },
    include: {
      category: true,
      options: true,
    },
  });
}
