import { SidebarMenuButton } from "@/components/ui/sidebar";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { useEffect, useState } from "react";
import { MarketingTemplate } from "@prisma/client";
import fetchRequest from "../../functions/api/fetchRequest";
import getTable from "../../functions/util/getTable";
import columns from "./columns";
import Table from "../../components/table/Table";
import { Button } from "@/components/ui/button";

export default function MarketingActionsDialog() {
  const [marketingTemplates, setMarketingTemplates] = useState<MarketingTemplate[]>([]);

  const fetchMarketingTemplates = () =>
    fetchRequest<MarketingTemplate[]>("GET", "/api/marketing", "getMarketingTemplates").then(
      setMarketingTemplates
    );

  const addMarketigTemplate = (marketing: MarketingTemplate) => {
    // fetchRequest<MarketingTemplate[]>("POST", "/api/marketing", "addMarketingTemplate", {
    //   marketing,
    // });
  };

  useEffect(() => {
    fetchMarketingTemplates();
  }, []);

  const table = getTable({
    data: marketingTemplates,
    columns,
  });

  const AddMarketing = () => (
    <DialogWrapper trigger={<Button>Aggiungi nuova azione</Button>}></DialogWrapper>
  );

  return (
    <>
      <DialogWrapper
        size="large"
        trigger={<SidebarMenuButton>Azioni marketing</SidebarMenuButton>}
        title={
          <div className="w-full flex justify-between">
            Azioni marketing <AddMarketing />
          </div>
        }
        putSeparator
      >
        <Table table={table} tableClassName="max-h-[60vh] h-[60vh]" />
      </DialogWrapper>
    </>
  );
}
