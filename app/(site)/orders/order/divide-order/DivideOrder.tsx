import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";
import getTable from "@/app/(site)/util/functions/getTable";
import { Dispatch, SetStateAction, useState } from "react";
import Table from "@/app/(site)/components/table/Table";
import getColumns from "./getColumns";
import { OrderType } from "@/app/(site)/types/OrderType";
import { Button } from "@/components/ui/button";

export default function DivideOrder({
  products,
  order,
  setDivide,
}: {
  products: ProductInOrderType[];
  order: AnyOrder;
  setDivide: Dispatch<SetStateAction<boolean>>;
}) {
  //const [currentProducts, setCurrentProducts] = useState<ProductInOrderType[]>(products);
  const [leftProducts, setLeftProducts] = useState<ProductInOrderType[]>(products);
  const [rightProducts, setRightProducts] = useState<ProductInOrderType[]>([]);

  const columns = getColumns(order.type as OrderType);
  const leftTable = getTable({ data: leftProducts, columns });
  const rightTable = getTable({ data: rightProducts, columns });

  const handleRowClick = (
    product: ProductInOrderType,
    source: ProductInOrderType[],
    setSource: Dispatch<SetStateAction<ProductInOrderType[]>>,
    target: ProductInOrderType[],
    setTarget: Dispatch<SetStateAction<ProductInOrderType[]>>
  ) => {
    // Create deep copies of the source and target arrays
    const sourceCopy = source.map((p) => ({ ...p }));
    const targetCopy = target.map((p) => ({ ...p }));

    // Find the product in the source copy
    const sourceProduct = sourceCopy.find((p) => p.id === product.id);
    if (sourceProduct) {
      if (sourceProduct.quantity > 1) {
        // Decrement quantity for the source product
        sourceProduct.quantity -= 1;
      } else {
        // Remove the product if its quantity is 1
        const index = sourceCopy.findIndex((p) => p.id === product.id);
        sourceCopy.splice(index, 1);
      }

      // Find the product in the target copy
      const targetProduct = targetCopy.find((p) => p.id === product.id);
      if (targetProduct) {
        // Increment quantity for the existing target product
        targetProduct.quantity += 1;
      } else {
        // Add a new product to the target array
        targetCopy.push({ ...product, quantity: 1 });
      }

      // Update the state with the modified arrays
      setSource(sourceCopy);
      setTarget(targetCopy);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-full flex gap-8">
        <Table
          tableClassName="max-w-[50%] overflow-x-scroll select-none"
          table={leftTable}
          onRowClick={(product) =>
            handleRowClick(product, leftProducts, setLeftProducts, rightProducts, setRightProducts)
          }
        />
        <Table
          tableClassName="max-w-[50%] overflow-x-scroll select-none"
          table={rightTable}
          onRowClick={(product) =>
            handleRowClick(product, rightProducts, setRightProducts, leftProducts, setLeftProducts)
          }
        />
      </div>
      <div className="flex gap-8 *:h-14 *:text-lg">
        <Button onClick={() => setDivide(false)}>Indietro</Button>
        <Button className="grow" disabled={rightProducts.length <= 0}>
          Paga
        </Button>
      </div>
    </div>
  );
}
