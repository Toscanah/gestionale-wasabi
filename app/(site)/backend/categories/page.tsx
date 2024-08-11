"use client";

import { useEffect, useState } from "react";
import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import fetchRequest from "../../util/functions/fetchRequest";
import columns from "./columns";

export default function CategoryDashboard() {
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);

  useEffect(() => {
    fetchRequest<CategoryWithOptions[]>("GET", "/api/categories/", "getCategories").then(
      (categories) => setCategories(categories)
    );
  }, []);

  const onCategoryDelete = (objectToDelete: ProductWithInfo) => {
    // TODO:
  };

  const onCategoryUpdate = async (newValues: FormValues, productToUpdate: ProductWithInfo) => {
    return await fetchRequest<ProductWithInfo>("POST", "/api/categories/", "editCategory", {
      id: productToUpdate.id,
      ...newValues,
    });
  };

  const onCategoryAdd = async (values: FormValues) => {
    return await fetchRequest<ProductWithInfo>(
      "POST",
      "/api/products/",
      "createNewProduct",
      values
    );
  };
}
