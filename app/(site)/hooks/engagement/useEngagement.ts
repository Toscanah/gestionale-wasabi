import { useState } from "react";
import { ComprehensiveCustomer } from "../../lib/shared";
import { useEngagementFilters, WeekFilterEnum } from "./useEngagementFilters";
import { ENGAGEMENT_TYPES } from "../../(domains)/engagement/templates/types/EngagementTypes";
import { EngagementType } from "@prisma/client";
import { trpc } from "@/lib/server/client";

function getFilteredRightCustomers(
  customers: ComprehensiveCustomer[],
  activeTypes: EngagementType[]
) {
  return customers.filter((c) =>
    c.engagements.length === 0
      ? activeTypes.length === ENGAGEMENT_TYPES.length
      : c.engagements.some((e) => activeTypes.includes(e.template.type))
  );
}

export default function useEngagement() {
  const [selectedCustomers, setSelectedCustomers] = useState<ComprehensiveCustomer[]>([]);

  const {
    weekFilter,
    setWeekFilter,
    filteredLeftCustomers,
    applyWeekFilter,
    filteredRightCustomers,
    setFilteredRightCustomers,
    activeTypes,
    setActiveTypes,
  } = useEngagementFilters({
    selectedCustomers,
  });

  const { data: allCustomers = [], isLoading } = trpc.customers.getAllWithDetails.useQuery();

  const onWeekFilterChange = (newFilter: WeekFilterEnum) => {
    setWeekFilter(newFilter);
    applyWeekFilter(allCustomers, newFilter);
  };

  const onLeftTableRowClick = (customer: ComprehensiveCustomer) => {
    const newCustomers = selectedCustomers.some((c) => c.id === customer.id)
      ? selectedCustomers
      : [...selectedCustomers, customer];

    setSelectedCustomers(newCustomers);
    setFilteredRightCustomers(getFilteredRightCustomers(newCustomers, activeTypes));
  };

  const onRightTableRowClick = (customer: ComprehensiveCustomer) => {
    const newCustomers = selectedCustomers.filter((c) => c.id !== customer.id);

    setSelectedCustomers(newCustomers);
    setFilteredRightCustomers(getFilteredRightCustomers(newCustomers, activeTypes));
  };

  return {
    filteredRightCustomers,
    filteredLeftCustomers,
    weekFilter,
    onWeekFilterChange,
    activeTypes,
    setActiveTypes,
    onLeftTableRowClick,
    onRightTableRowClick,
    isLoading,
    setFilteredRightCustomers,
  };
}
