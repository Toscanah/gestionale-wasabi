import { useState, useEffect } from "react";
import { MarketingTemplate } from "@/prisma/generated/zod";
import { CustomerWithMarketing } from "../../models";

export enum WeekFilterEnum {
  THIS_WEEK = "THIS_WEEK",
  LAST_WEEK = "LAST_WEEK",
  TWO_WEEKS_AGO = "TWO_WEEKS_AGO",
  THREE_WEEKS_AGO = "THREE_WEEKS_AGO",
  FOUR_WEEKS_AGO = "FOUR_WEEKS_AGO",
}

interface MarketingFiltersParams {
  marketingTemplates: MarketingTemplate[];
  selectedCustomers: CustomerWithMarketing[];
}

export function useMarketingFilters({
  marketingTemplates,
  selectedCustomers,
}: MarketingFiltersParams) {
  const [weekFilter, setWeekFilter] = useState<WeekFilterEnum>(WeekFilterEnum.THIS_WEEK);
  const [filteredLeftCustomers, setFilteredLeftCustomers] = useState<CustomerWithMarketing[]>([]);

  const [activeTemplates, setActiveTemplates] = useState<MarketingTemplate[]>(marketingTemplates);
  const [filteredRightCustomers, setFilteredRightCustomers] = useState<CustomerWithMarketing[]>([]);

  const toggleTemplate = (template: MarketingTemplate) =>
    setActiveTemplates((prev) =>
      prev.some((t) => t.label === template.label)
        ? prev.filter((t) => t.label !== template.label)
        : [...prev, template]
    );

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
    

  const applyWeekFilter = (allCustomers: CustomerWithMarketing[], newFilter: WeekFilterEnum) => {
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
          c.marketings.length === 0
            ? activeTemplates.length > 0
            : c.marketings.some((marketing) =>
                activeTemplates.some((active) => active.label === marketing.marketing.label)
              )
        )
      ),
    [activeTemplates]
  );

  return {
    weekFilter,
    setWeekFilter,
    filteredLeftCustomers,
    applyWeekFilter,
    activeTemplates,
    setActiveTemplates,
    toggleTemplate,
    filteredRightCustomers,
    setFilteredLeftCustomers,
    setFilteredRightCustomers,
  };
}
