import { useEffect, useState } from "react";
import { CustomerWithDetails } from "../../shared";
import fetchRequest from "../../lib/api/fetchRequest";
import { useEngagementFilters, WeekFilterEnum } from "./useEngagementFilters";
import { ENGAGEMENT_TYPES } from "../../engagement/types/EngagementTypes";
import { EngagementType } from "@prisma/client";

function getFilteredRightCustomers(
  customers: CustomerWithDetails[],
  activeTypes: EngagementType[]
) {
  return customers.filter((c) =>
    c.engagement.length === 0
      ? activeTypes.length === ENGAGEMENT_TYPES.length
      : c.engagement.some((e) => activeTypes.includes(e.type))
  );
}

export default function useEngagement() {
  const [allCustomers, setAllCustomers] = useState<CustomerWithDetails[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<CustomerWithDetails[]>([]);

  const {
    weekFilter,
    setWeekFilter,
    filteredLeftCustomers,
    applyWeekFilter,
    filteredRightCustomers,
    setFilteredRightCustomers,
    activeTypes,
    setActiveTypes
  } = useEngagementFilters({
    selectedCustomers,
  });

  const fetchInitialCustomers = () => {
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersWithDetails").then(
      (customers) => {
        setAllCustomers(customers);
        applyWeekFilter(customers, WeekFilterEnum.THIS_WEEK);
      }
    );
  };

  useEffect(() => {
    fetchInitialCustomers();
  }, []);

  const onWeekFilterChange = (newFilter: WeekFilterEnum) => {
    setWeekFilter(newFilter);
    applyWeekFilter(allCustomers, newFilter);
  };

  const onLeftTableRowClick = (customer: CustomerWithDetails) => {
    const newCustomers = selectedCustomers.some((c) => c.id === customer.id)
      ? selectedCustomers
      : [...selectedCustomers, customer];

    setSelectedCustomers(newCustomers);
    setFilteredRightCustomers(getFilteredRightCustomers(newCustomers, activeTypes));
  };

  const onRightTableRowClick = (customer: CustomerWithDetails) => {
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
  };
}
