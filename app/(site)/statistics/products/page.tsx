"use client";

import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { Product } from "../../models";
import getTable from "../../util/functions/getTable";
import columns from "./columns";
import fetchRequest from "../../util/functions/fetchRequest";

export default function ProductsStats() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const table = getTable({ data: filteredProducts, columns });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () =>
    fetchRequest<Product[]>("GET", "/api/products", "getProducts").then((products) => {
      setProducts(products);
      setFilteredProducts(products);
    });

  return (
    <div className="w-screen h-screen p-4 flex flex-col gap-4">
      <Table table={table} tableClassName="max-h-max"/>
    </div>
  );
}
