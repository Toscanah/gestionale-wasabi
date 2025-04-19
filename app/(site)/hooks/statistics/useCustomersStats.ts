import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfYear, startOfYear, subDays, startOfDay, endOfMonth, startOfMonth } from "date-fns";
import { CustomerWithStats } from "@/app/(site)/shared/types/CustomerWithStats";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { DatePreset } from "../../enums/DatePreset";

const today = new Date();
const defaultDate: DateRange = {
  from: startOfYear(today),
  to: endOfYear(today),
};

export function useCustomersStats() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithStats[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(defaultDate);

  useEffect(() => {
    fetchInitialCustomers();
  }, []);

  useEffect(() => {
    if (dateFilter && dateFilter.from && dateFilter.to) {
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
      setFilteredCustomers(filteredCustomers);
      applyFilter(selectedFilter, filteredCustomers);
    });

  const sortByMetric = (customers: CustomerWithStats[], metric: keyof CustomerWithStats) =>
    [...customers].sort((a, b) => (b[metric] as number) - (a[metric] as number));

  const applyFilter = (filter: string, customersOverride?: CustomerWithStats[]) => {
    setSelectedFilter(filter);

    const sourceCustomers = customersOverride || filteredCustomers;

    if (!filter || filter === "all") {
      setFilteredCustomers(sourceCustomers);
      return;
    }

    let filtered = [...sourceCustomers];

    switch (filter) {
      case "1-week":
        filtered = sortByMetric(
          filtered.filter(
            (customer) => customer.averageOrdersWeek >= 1 && customer.averageOrdersWeek < 2
          ),
          "averageOrdersWeek"
        );
        break;
      case "2-week":
        filtered = sortByMetric(
          filtered.filter(
            (customer) => customer.averageOrdersWeek >= 2 && customer.averageOrdersWeek < 3
          ),
          "averageOrdersWeek"
        );
        break;
      case "3-week":
        filtered = sortByMetric(
          filtered.filter(
            (customer) => customer.averageOrdersWeek >= 3 && customer.averageOrdersWeek < 4
          ),
          "averageOrdersWeek"
        );
        break;
      case "more-week":
        filtered = sortByMetric(
          filtered.filter((customer) => customer.averageOrdersWeek >= 4),
          "averageOrdersWeek"
        );
        break;
      case "1-2-weeks":
        filtered = sortByMetric(
          filtered.filter((customer) => customer.averageOrdersWeek >= 0.5),
          "averageOrdersWeek"
        );
        break;
      case "1-3-weeks":
        filtered = sortByMetric(
          filtered.filter((customer) => customer.averageOrdersWeek >= 0.33),
          "averageOrdersWeek"
        );
        break;
      case "1-month":
        filtered = sortByMetric(
          filtered.filter((customer) => customer.averageOrdersMonth >= 1),
          "averageOrdersMonth"
        );
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

  const handlePresetSelect = (value: DatePreset) => {
    switch (value) {
      case DatePreset.TODAY:
        setDateFilter({ from: startOfDay(today), to: startOfDay(today) });
        break;
      case DatePreset.YESTERDAY:
        const yesterday = subDays(today, 1);
        setDateFilter({
          from: startOfDay(yesterday),
          to: startOfDay(yesterday),
        });
        break;
      case DatePreset.LAST7:
        const last7 = subDays(today, 6);
        setDateFilter({ from: startOfDay(last7), to: startOfDay(today) });
        break;
      case DatePreset.LAST30:
        const last30 = subDays(today, 29);
        setDateFilter({ from: startOfDay(last30), to: startOfDay(today) });
        break;
      case DatePreset.THIS_MONTH:
        setDateFilter({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case DatePreset.THIS_YEAR:
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
    handleReset,
  };
}
