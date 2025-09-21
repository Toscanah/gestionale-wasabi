import { useState, useEffect } from "react";
import { ComprehensiveCustomer } from "../../lib/shared";
import { EngagementType } from "@prisma/client";

export enum WeekFilterEnum {
  THIS_WEEK = "THIS_WEEK",
  LAST_WEEK = "LAST_WEEK",
  TWO_WEEKS_AGO = "TWO_WEEKS_AGO",
  THREE_WEEKS_AGO = "THREE_WEEKS_AGO",
  FOUR_WEEKS_AGO = "FOUR_WEEKS_AGO",
}

interface EngagementFiltersParams {
  selectedCustomers: ComprehensiveCustomer[];
}

export function useEngagementFilters({ selectedCustomers }: EngagementFiltersParams) {
  const [weekFilter, setWeekFilter] = useState<WeekFilterEnum>(WeekFilterEnum.THIS_WEEK);
  const [activeTypes, setActiveTypes] = useState<EngagementType[]>(Object.values(EngagementType));
  const [filteredLeftCustomers, setFilteredLeftCustomers] = useState<ComprehensiveCustomer[]>([]);
  const [filteredRightCustomers, setFilteredRightCustomers] = useState<ComprehensiveCustomer[]>([]);

  const calculateStartAndEndOfWeek = (filter: WeekFilterEnum) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - today.getDay() + 1);

    let startOfWeek = new Date(currentMonday);
    let endOfWeek = new Date(currentMonday);
    endOfWeek.setDate(currentMonday.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (filter !== WeekFilterEnum.THIS_WEEK) {
      const weeksAgo = Object.values(WeekFilterEnum).indexOf(filter);
      startOfWeek.setDate(currentMonday.getDate() - 7 * weeksAgo);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
    }

    return { startOfWeek, endOfWeek };
  };

  const applyWeekFilter = (allCustomers: ComprehensiveCustomer[], newFilter: WeekFilterEnum) => {
    setWeekFilter(newFilter);

    const { startOfWeek, endOfWeek } = calculateStartAndEndOfWeek(newFilter);

    const filtered = allCustomers.filter(
      (customer) =>
        customer.home_orders.some((order) => {
          const orderDate = new Date(order.order.created_at);
          return orderDate >= startOfWeek && orderDate <= endOfWeek;
        }) ||
        customer.pickup_orders.some((order) => {
          const orderDate = new Date(order.order.created_at);
          return orderDate >= startOfWeek && orderDate <= endOfWeek;
        })
    );

    setFilteredLeftCustomers(filtered);
  };

  useEffect(
    () =>
      setFilteredRightCustomers(
        selectedCustomers.filter((c) =>
          c.engagements.length === 0
            ? activeTypes.length > 0
            : c.engagements.some((e) => activeTypes.some((t) => t === e.template.type))
        )
      ),
    [activeTypes]
  );

  return {
    weekFilter,
    setWeekFilter,
    filteredLeftCustomers,
    applyWeekFilter,
    filteredRightCustomers,
    setFilteredLeftCustomers,
    setFilteredRightCustomers,
    activeTypes,
    setActiveTypes,
  };
}
