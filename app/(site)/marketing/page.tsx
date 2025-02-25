"use client";

import getTable from "../functions/util/getTable";
import Table from "../components/table/Table";
import { ArrowRight } from "lucide-react";
import EmailSender from "./EmailSender";
import columns from "./columns";
import TemplateFilter from "./filters/TemplateFilter";
import WeekFilter from "./filters/WeekFilter";
import useMarketing from "../hooks/marketing/useMarketing";
import TemplateSelection from "./TemplateSelection";

export default function Marketing() {
  const {
    activeTemplates,
    marketingTemplates,
    toggleTemplate,
    filteredLeftCustomers,
    filteredRightCustomers,
    weekFilter,
    onWeekFilterChange,
    selectedTemplate,
    setSelectedTemplate,
    onLeftTableRowClick,
    onRightTableRowClick,
  } = useMarketing();

  const leftTable = getTable({ data: filteredLeftCustomers, columns: columns(false) });
  const rightTable = getTable({ data: filteredRightCustomers, columns: columns(true) });

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-full h-full p-4 flex flex-col gap-4">
        <WeekFilter onWeekFilterChange={onWeekFilterChange} weekFilter={weekFilter} />

        <Table
          table={leftTable}
          tableClassName="max-h-[70vh] h-[70vh]"
          onRowClick={onLeftTableRowClick}
        />
      </div>

      <div className="h-full flex flex-col items-center justify-center">
        <ArrowRight size={80} />
      </div>

      <div className="w-full h-full p-4 flex flex-col gap-4">
        <TemplateFilter
          activeTemplates={activeTemplates}
          marketingTemplates={marketingTemplates}
          toggleTemplate={toggleTemplate}
        />

        <Table
          table={rightTable}
          tableClassName="max-h-[70vh] h-[70vh]"
          onRowClick={onRightTableRowClick}
        />
        
        <div className="flex gap-4 w-full items-center justify-center">
          <TemplateSelection
            marketingTemplates={marketingTemplates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />

          <EmailSender
            body={selectedTemplate?.body || ""}
            subject={selectedTemplate?.subject || ""}
            isDisabled={filteredRightCustomers.length == 0}
          />
        </div>
      </div>
    </div>
  );
}
