import { SidebarMenuButton } from "@/components/ui/sidebar";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { useEffect, useState } from "react";
import { MarketingTemplate } from "@prisma/client";
import fetchRequest from "../../functions/api/fetchRequest";
import getTable from "../../functions/util/getTable";
import Table from "../../components/table/Table";
import columns from "./columns";
import AddMarketingTemplate from "./AddMarketingTemplate";
import { toastError, toastSuccess } from "../../functions/util/toast";

export default function MarketingTemplatesDialog() {
  const [marketingTemplates, setMarketingTemplates] = useState<MarketingTemplate[]>([]);

  const fetchMarketingTemplates = () =>
    fetchRequest<MarketingTemplate[]>("GET", "/api/marketing", "getMarketingTemplates").then(
      setMarketingTemplates
    );

  const onUpdatedMarketing = (updatedMarketing: MarketingTemplate | null) => {
    if (!updatedMarketing) {
      toastError("Azione di marketing non trovata");
    } else {
      toastSuccess("Azione di marketing aggiornata con successo");
      setMarketingTemplates((prev) =>
        prev.map((template) => (template.id === updatedMarketing.id ? updatedMarketing : template))
      );
    }
  };

  const onAddedMarketing = (newMarketing: MarketingTemplate | null) => {
    if (!newMarketing) {
      toastError("Azione di marketing già presente");
    } else {
      toastSuccess("Azione di marketing aggiunta con successo");
      setMarketingTemplates((prev) => [...prev, newMarketing]);
    }
  };

  useEffect(() => {
    fetchMarketingTemplates();
  }, []);

  const table = getTable<MarketingTemplate>({
    data: marketingTemplates,
    columns: columns(onUpdatedMarketing),
  });

  return (
    <>
      <DialogWrapper
        size="large"
        trigger={<SidebarMenuButton>Azioni marketing</SidebarMenuButton>}
        title={
          <div className="w-full flex justify-between">
            Azioni marketing <AddMarketingTemplate onAddedMarketing={onAddedMarketing} />
          </div>
        }
        putSeparator
      >
        <Table table={table} tableClassName="max-h-[60vh] h-[60vh]" />
      </DialogWrapper>
    </>
  );
}
