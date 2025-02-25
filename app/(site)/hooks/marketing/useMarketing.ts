import { useEffect, useState } from "react";
import { CustomerWithMarketing } from "../../models";
import { MarketingTemplate } from "@/prisma/generated/zod";
import fetchRequest from "../../functions/api/fetchRequest";
import { useMarketingFilters, WeekFilterEnum } from "./useMarketingFilters";

export default function useMarketing() {
  const [allCustomers, setAllCustomers] = useState<CustomerWithMarketing[]>([]);
  /** selected = quelli selezionati che vanno a destra, non filtrati però */
  const [selectedCustomers, setSelectedCustomers] = useState<CustomerWithMarketing[]>([]);
  const [marketingTemplates, setMarketingTemplates] = useState<MarketingTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | undefined>(
    undefined
  );

  const {
    weekFilter,
    setWeekFilter,
    filteredLeftCustomers,
    applyWeekFilter,
    activeTemplates,
    toggleTemplate,
    filteredRightCustomers,
    setFilteredLeftCustomers,
    setFilteredRightCustomers,
    setActiveTemplates,
  } = useMarketingFilters({ allCustomers, marketingTemplates, selectedCustomers });

  const fetchInitialCustomers = () => {
    fetchRequest<CustomerWithMarketing[]>(
      "GET",
      "/api/customers",
      "getCustomersWithMarketing"
    ).then((customers) => {
      setAllCustomers(customers);
      applyWeekFilter(customers, WeekFilterEnum.LAST_WEEK);
    });
  };

  useEffect(() => {
    fetchInitialCustomers();
    fetchMarketingTemplates();
  }, []);

  const onWeekFilterChange = (newFilter: WeekFilterEnum) => {
    setWeekFilter(newFilter);
    applyWeekFilter(allCustomers, newFilter);
  };

  const fetchMarketingTemplates = () => {
    fetchRequest<MarketingTemplate[]>(
      "GET",
      "/api/marketing-templates",
      "getMarketingTemplates"
    ).then((templates) => {
      setMarketingTemplates(templates);
      setActiveTemplates(templates);
      setSelectedTemplate(templates[0]);
    });
  };

  const onLeftTableRowClick = (customer: CustomerWithMarketing) => {
    const newCustomers = selectedCustomers.some((c) => c.id === customer.id)
      ? selectedCustomers
      : [...selectedCustomers, customer];

    setSelectedCustomers(newCustomers);

    const newFilteredRight = newCustomers.filter((c) =>
      c.marketings.length === 0
        ? activeTemplates.length === marketingTemplates.length
        : c.marketings.some((marketing) =>
            activeTemplates.some((active) => active.label === marketing.marketing.label)
          )
    );

    setFilteredRightCustomers(newFilteredRight);
  };

  const onRightTableRowClick = (customer: CustomerWithMarketing) => {
    const newCustomers = selectedCustomers.filter((c) => c.id !== customer.id);

    const newFilteredRight = newCustomers.filter((c) =>
      c.marketings.length === 0
        ? activeTemplates.length === marketingTemplates.length
        : c.marketings.some((marketing) =>
            activeTemplates.some((active) => active.label === marketing.marketing.label)
          )
    );

    setSelectedCustomers(newCustomers);
    setFilteredRightCustomers(newFilteredRight);
  };

  return {
    marketingTemplates,
    filteredRightCustomers,
    filteredLeftCustomers,
    weekFilter,
    onWeekFilterChange,
    activeTemplates,
    selectedTemplate,
    setSelectedTemplate,
    toggleTemplate,
    onLeftTableRowClick,
    onRightTableRowClick,
  };
}
