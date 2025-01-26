import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfYear, startOfYear, subDays, startOfDay, endOfMonth, startOfMonth } from "date-fns";
import { CustomerWithStats } from "@/app/(site)/types/CustomerWithStats";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";

export enum DateFilters {
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST7 = "last7",
  LAST30 = "last30",
  THIS_MONTH = "thisMonth",
  THIS_YEAR = "thisYear",
}

const today = new Date();
const defaultDate: DateRange = {
  from: startOfYear(today),
  to: endOfYear(today),
};

export function useCustomerStats() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithStats[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(defaultDate);

  useEffect(() => {
    fetchInitialCustomers();
  }, []);

  useEffect(() => {
    if (dateFilter) {
      fetchCustomersWithFilter(dateFilter);
    }
  }, [dateFilter]);

  const fetchInitialCustomers = () =>
    fetchRequest<CustomerWithStats[]>("GET", "/api/customers", "getCustomersWithStats", {
      ...dateFilter,
    }).then((customers) => {
      setCustomers(customers);

      setDateFilter({
        from: customers
          .map((customer) => (customer?.firstOrder ? new Date(customer.firstOrder) : new Date()))
          .reduce((earliest, date) => (date < earliest ? date : earliest), new Date()),
        to: new Date(),
      });
    });

  const fetchCustomersWithFilter = (value: DateRange) =>
    fetchRequest<CustomerWithStats[]>("GET", "/api/customers", "getCustomersWithStats", {
      ...value,
    }).then((filteredCustomers) => {
      applyFilter(selectedFilter, filteredCustomers);
    });

  const applyFilter = (filter: string, customers: CustomerWithStats[]) => {
    setSelectedFilter(filter);

    if (!filter || filter === "all") {
      setFilteredCustomers(customers);
      return;
    }

    let filtered = [...customers];

    switch (filter) {
      case "1-week":
        filtered = filtered.filter(
          (customer) => customer.averageOrdersWeek >= 1 && customer.averageOrdersWeek < 2
        );
        break;
      case "2-week":
        filtered = filtered.filter(
          (customer) => customer.averageOrdersWeek >= 2 && customer.averageOrdersWeek < 3
        );
        break;
      case "3-week":
        filtered = filtered.filter(
          (customer) => customer.averageOrdersWeek >= 3 && customer.averageOrdersWeek < 4
        );
        break;
      case "more-week":
        filtered = filtered.filter((customer) => customer.averageOrdersWeek >= 4);
        break;
      case "1-2-weeks":
        filtered = filtered.filter((customer) => customer.averageOrdersWeek >= 0.5);
        break;
      case "1-3-weeks":
        filtered = filtered.filter((customer) => customer.averageOrdersWeek >= 0.33);
        break;
      case "1-month":
        filtered = filtered.filter((customer) => customer.averageOrdersMonth >= 1);
        break;
      case "highest-spending":
        const highestSpending = Math.max(...filtered.map((customer) => customer.totalSpending));
        filtered = filtered.filter((customer) => customer.totalSpending === highestSpending);
        break;
      default:
        break;
    }

    setFilteredCustomers(filtered);
  };

  const handlePresetSelect = (value: DateFilters) => {
    switch (value) {
      case DateFilters.TODAY:
        setDateFilter({ from: startOfDay(today), to: startOfDay(today) });
        break;
      case DateFilters.YESTERDAY:
        const yesterday = subDays(today, 1);
        setDateFilter({
          from: startOfDay(yesterday),
          to: startOfDay(yesterday),
        });
        break;
      case DateFilters.LAST7:
        const last7 = subDays(today, 6);
        setDateFilter({ from: startOfDay(last7), to: startOfDay(today) });
        break;
      case DateFilters.LAST30:
        const last30 = subDays(today, 29);
        setDateFilter({ from: startOfDay(last30), to: startOfDay(today) });
        break;
      case DateFilters.THIS_MONTH:
        setDateFilter({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case DateFilters.THIS_YEAR:
        setDateFilter({
          from: startOfYear(today),
          to: endOfYear(today),
        });
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setSelectedFilter("all");
    fetchInitialCustomers();
  };

  return {
    customers,
    filteredCustomers,
    dateFilter,
    selectedFilter,
    setDateFilter,
    handlePresetSelect,
    applyFilter,
    handleReset
  };
}
