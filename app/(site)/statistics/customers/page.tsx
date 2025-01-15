"use client";

import React, { useEffect, useState } from "react";
import { CustomerWithDetails } from "../../models";
import fetchRequest from "../../functions/api/fetchRequest";
import getTable from "../../functions/util/getTable";
import Table from "../../components/table/Table";
import columns from "./columns";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../components/hooks/useGlobalFilter";
import SelectWrapper from "../../components/select/SelectWrapper";
import { Button } from "@/components/ui/button";

export default function CustomersStats() {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithDetails[]>([]);
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const fetchCustomers = () =>
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersWithDetails").then(
      (customers) => {
        setCustomers(customers);
        setFilteredCustomers(customers);
      }
    );

  useEffect(() => {
    fetchCustomers();
  }, []);

  const applyFilter = (filter: string | null) => {
    if (!filter) {
      setFilteredCustomers(customers);
      return;
    }

    if (filter === "highest-spending") {
      if (customers.length === 0) {
        setFilteredCustomers([]);
        return;
      }

      const highestSpender = customers.reduce((topCustomer, currentCustomer) => {
        const currentSpent = [
          ...currentCustomer.home_orders,
          ...currentCustomer.pickup_orders,
        ].reduce((sum, order) => sum + (order.order?.total || 0), 0);

        const topSpent = [...topCustomer.home_orders, ...topCustomer.pickup_orders].reduce(
          (sum, order) => sum + (order.order?.total || 0),
          0
        );

        return currentSpent > topSpent ? currentCustomer : topCustomer;
      }, customers[0]);

      setFilteredCustomers([highestSpender]);
      return;
    }

    const filtered = customers.filter((customer) => {
      const orders = [...customer.home_orders, ...customer.pickup_orders];

      // Map orders to unique ISO week numbers
      const uniqueWeeks = new Set(
        orders.map((order) => {
          const date = new Date(order.order.created_at);

          const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          const daysToTuesday = (day + 6) % 7; // How far back to go to Tuesday
          date.setDate(date.getDate() - daysToTuesday);

          return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
        })
      ).size;

      switch (filter) {
        case "1-week":
          return uniqueWeeks === 1;
        case "2-week":
          return uniqueWeeks === 2;
        case "3-week":
          return uniqueWeeks === 3;
        case "more-week":
          return uniqueWeeks > 3;
        case "1-2-weeks":
          return uniqueWeeks >= 1 && uniqueWeeks <= 2;
        case "1-3-weeks":
          return uniqueWeeks >= 1 && uniqueWeeks <= 3;
        case "1-month":
          return uniqueWeeks <= 4;
        default:
          return true;
      }
    });

    setFilteredCustomers(filtered);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    applyFilter(value);
  };

  const table = getTable({ data: filteredCustomers, columns, globalFilter, setGlobalFilter });

  return (
    <div className="w-screen h-screen p-4 flex flex-col gap-4">
      <TableControls
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onReset={() => setSelectedFilter("all")}
      >
        <SelectWrapper
          className="h-10"
          onValueChange={handleFilterChange}
          value={selectedFilter ?? "all"}
          groups={[
            {
              items: [
                { name: "Tutti", value: "all" },
                { name: "Chi chiama 1 volta alla settimana", value: "1-week" },
                { name: "Chi chiama 2 volte alla settimana", value: "2-week" },
                { name: "Chi chiama 3 volte alla settimana", value: "3-week" },
                { name: "Chi chiama più volte alla settimana", value: "more-week" },
                { name: "Chi chiama 1 volta ogni 2 settimane", value: "1-2-weeks" },
                { name: "Chi chiama 1 volta ogni 3 settimane", value: "1-3-weeks" },
                { name: "Chi chiama 1 volta al mese", value: "1-month" },
                { name: "Cliente con spesa maggiore", value: "highest-spending" },
              ],
            },
          ]}
        />
      </TableControls>
      <Table table={table} tableClassName="max-h-max" />
    </div>
  );
}
