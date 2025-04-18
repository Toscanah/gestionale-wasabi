import { useCallback, useEffect, useState } from "react";
import { OrderWithPayments } from "../models";
import fetchRequest from "../functions/api/fetchRequest";
import { isSameDay } from "date-fns";
import { ShiftFilter } from "../components/filters/shift/ShiftFilterSelector";
import { orderMatchesShift } from "../functions/order-management/shift/orderMatchesShift";

export default function usePaymentsHistory() {
  const [allOrders, setAllOrders] = useState<OrderWithPayments[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithPayments[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>(ShiftFilter.BOTH);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInitialOrders = () => {
    setIsLoading(true);
    console.log("yo");
    fetchRequest<OrderWithPayments[]>("GET", "/api/payments", "getOrdersWithPayments")
      .then((orders) => {
        setAllOrders(orders);
        filterOrders();
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInitialOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [date, typeFilter]);

  const filterOrders = useCallback(() => {
    const filtered = allOrders.filter((order) => {
      const matchesDate = date ? isSameDay(new Date(order.created_at), date) : true;
      const matchesType = typeFilter === "all" || order.type === typeFilter;

      return matchesDate && matchesType && orderMatchesShift(order, shiftFilter);
    });

    setFilteredOrders(filtered);
  }, [allOrders, date, typeFilter, shiftFilter]);

  const resetFilters = () => {
    setDate(new Date());
    setTypeFilter("all");
    setShiftFilter(ShiftFilter.BOTH);
    filterOrders();
  };

  return {
    filteredOrders,
    isLoading,
    typeFilter,
    setTypeFilter,
    resetFilters,
    date,
    setDate,
    shiftFilter,
    setShiftFilter,
    allOrders,
  };
}
