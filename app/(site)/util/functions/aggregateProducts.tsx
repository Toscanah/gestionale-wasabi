import { ProductInOrderType } from "../../types/ProductInOrderType";

export default function aggregateProducts(products: ProductInOrderType[]): ProductInOrderType[] {
  const aggregated = {} as any;

  products.forEach((product) => {
    const optionsString = product.options
      .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
      .join(", ");
    const key = `${product.product.code} ${product.product.desc} ${optionsString}`;

    if (aggregated[key]) {
      aggregated[key].quantity += product.quantity;
    } else {
      aggregated[key] = {
        ...product,
        quantity: product.quantity,
      };
    }
  });

  return Object.values(aggregated);
}
