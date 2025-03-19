import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { DateRange } from "react-day-picker";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { TimeFilter } from "@/app/(site)/sql/products/getProductsWithStats";
import { ProductWithStats } from "@/app/(site)/types/ProductWithStats";

const defaultStartDate = new Date(new Date().setHours(0, 0, 0, 0));
const defaultEndDate = new Date(new Date().setHours(23, 59, 59, 999));
const defaultDate: DateRange = {
  from: defaultStartDate,
  to: defaultEndDate,
};

export const allCategories = {
  id: -1,
  category: "all",
  active: true,
};

export default function useProductsStats() {
  const [products, setProducts] = useState<ProductWithStats[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithStats[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(allCategories);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.ALL);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(defaultDate);

  useEffect(() => {
    fetchInitialProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (timeFilter === TimeFilter.CUSTOM) {
      if (dateFilter?.from && dateFilter?.to) {
        fetchProductsWithFilter(timeFilter, dateFilter);
      } else {
        setFilteredProducts([]);
      }
    } else {
      fetchInitialProducts();
    }
  }, [timeFilter, dateFilter]);

  useEffect(() => {
    if (timeFilter === TimeFilter.CUSTOM && dateFilter?.from && dateFilter?.to) {
      fetchProductsWithFilter(timeFilter, { ...dateFilter });
    } else {
      setFilteredProducts(
        selectedCategory.id === -1
          ? products
          : products.filter((product) => product.category_id === selectedCategory.id)
      );
    }
  }, [selectedCategory]);

  const fetchCategories = () =>
    fetchRequest<Category[]>("GET", "/api/categories/", "getCategories").then((fetchedCategories) =>
      setCategories(fetchedCategories.filter((c) => c.active))
    );

  const fetchInitialProducts = () =>
    fetchRequest<ProductWithStats[]>("GET", "/api/products", "getProductsWithStats", {
      timeFilter: TimeFilter.ALL,
      from: undefined,
      to: undefined,
    }).then((initialProducts) => {
      const sortedProducts = initialProducts.sort((a, b) => b.quantity - a.quantity);

      setProducts(sortedProducts);
      setFilteredProducts(
        selectedCategory.id === -1
          ? sortedProducts
          : sortedProducts.filter((product) => product.category_id === selectedCategory.id)
      );
    });

  const fetchProductsWithFilter = (timeFilter: TimeFilter, value: DateRange) =>
    fetchRequest<ProductWithStats[]>("GET", "/api/products", "getProductsWithStats", {
      timeFilter,
      ...value,
    }).then((products) =>
      setFilteredProducts(
        selectedCategory.id === -1
          ? products
          : products.filter((product) => product.category_id === selectedCategory.id)
      )
    );

  const handleReset = () => {
    setTimeFilter(TimeFilter.ALL);
    setDateFilter(defaultDate);
    setSelectedCategory(allCategories);
    fetchInitialProducts();
  };

  return {
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    timeFilter,
    setTimeFilter,
    dateFilter,
    setDateFilter,
    handleReset,
  };
}
