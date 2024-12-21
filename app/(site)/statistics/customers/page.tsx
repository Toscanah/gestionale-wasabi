"use client";

import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { CustomerWithDetails } from "../../models";
import fetchRequest from "../../util/functions/fetchRequest";
import getTable from "../../util/functions/getTable";
import Table from "../../components/table/Table";
import columns from "./columns";

export default function CustomersStats() {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [topSpender, setTopSpender] = useState<CustomerWithDetails | null>(null);

  const fetchCustomers = () =>
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers", "getCustomersWithDetails").then(
      (customers) => {
        setCustomers(customers);
        calculateTopSpender(customers);
      }
    );

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Utility function to calculate frequency
  const calculateFrequency = (ordersCount: number, weeks: number) => {
    return weeks > 0 ? ordersCount / weeks : 0;
  };

  // Simulated date range to calculate weeks for each customer's orders
  const WEEKS_IN_PERIOD = 4;

  // Filtering logic based on customer frequency
  const filterByFrequency = (minCallsPerWeek: number, maxCallsPerWeek?: number) => {
    return customers.filter((customer) => {
      const totalOrders = customer.home_orders.length + customer.pickup_orders.length;
      const frequency = calculateFrequency(totalOrders, WEEKS_IN_PERIOD);
      return (
        frequency >= minCallsPerWeek &&
        (maxCallsPerWeek === undefined || frequency <= maxCallsPerWeek)
      );
    });
  };

  const tables = [
    {
      label: "Chi chiama 1 volta alla settimana", // Customers calling once per week
      table: getTable({ data: filterByFrequency(1, 1), columns }),
    },
    {
      label: "Chi chiama 2 volte alla settimana", // Customers calling twice per week
      table: getTable({ data: filterByFrequency(2, 2), columns }),
    },
    {
      label: "Chi chiama 3 volte alla settimana", // Customers calling three times per week
      table: getTable({ data: filterByFrequency(3, 3), columns }),
    },
    {
      label: "Chi chiama più volte alla settimana", // Customers calling more than three times per week
      table: getTable({ data: filterByFrequency(4), columns }),
    },
    {
      label: "Chi chiama 1 volta ogni 2 settimane", // Customers calling once every 2 weeks
      table: getTable({ data: filterByFrequency(0.5, 0.5), columns }),
    },
    {
      label: "Chi chiama 1 volta ogni 3 settimane", // Customers calling once every 3 weeks
      table: getTable({ data: filterByFrequency(1 / 3, 1 / 3), columns }),
    },
    {
      label: "Chi chiama 1 volta al mese", // Customers calling once per month
      table: getTable({ data: filterByFrequency(1 / 4, 1 / 4), columns }),
    },
  ];

  const calculateTopSpender = (customers: CustomerWithDetails[]) => {
    const top = customers.reduce((maxCustomer, currentCustomer) => {
      const currentTotal = [
        ...currentCustomer.home_orders,
        ...currentCustomer.pickup_orders,
      ].reduce((sum, order) => sum + order.order.total, 0);

      const maxTotal = [...maxCustomer.home_orders, ...maxCustomer.pickup_orders].reduce(
        (sum, order) => sum + order.order.total,
        0
      );

      return currentTotal > maxTotal ? currentCustomer : maxCustomer;
    }, customers[0]);

    setTopSpender(top);
  };

  return (
    <div className="w-full flex flex-col gap-4 h-screen">
      <div className="w-full flex items-center justify-center text-2xl h-[20%]">
        {topSpender ? (
          <div>
            <strong>Cliente con spesa maggiore:</strong> {topSpender.name} - €{" "}
            {[...topSpender.home_orders, ...topSpender.pickup_orders]
              .reduce((sum, order) => sum + order.order.total, 0)
              .toFixed(2)}
          </div>
        ) : (
          "Caricamento..."
        )}
      </div>

      {/* First 4 tables */}
      <div className="w-full flex gap-4 h-[40%]">
        {tables.slice(0, 4).map((entry, index) => (
          <StatCard key={index} label={entry.label}>
            <Table table={entry.table} tableClassName="border-none" />
          </StatCard>
        ))}
      </div>

      {/* Remaining tables */}
      <div className="w-full flex gap-4 h-[40%]">
        {tables.slice(4).map((entry, index) => (
          <StatCard key={index + 4} label={entry.label}>
            <Table table={entry.table} tableClassName="border-none" />
          </StatCard>
        ))}
      </div>
    </div>
  );
}
