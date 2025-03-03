import { Button } from "@/components/ui/button";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import MarketingInputFields from "./components/MarketingInputFields";
import { MarketingTemplateInput } from "../../models";
import { useState } from "react";
import fetchRequest from "../../functions/api/fetchRequest";
import { MarketingTemplate } from "@prisma/client";
import { DialogClose } from "@/components/ui/dialog";

const DEFAULT_NEW_TEMPLATE: MarketingTemplateInput = {
  subject: "",
  label: "",
  body: null,
};

interface AddMarketingTemplateProps {
  onAddedMarketing: (newMarketing: MarketingTemplate | null) => void;
}

export default function AddMarketingTemplate({ onAddedMarketing }: AddMarketingTemplateProps) {
  const [newMarketingTemplate, setNewMarketingTemplate] =
    useState<MarketingTemplateInput>(DEFAULT_NEW_TEMPLATE);

  const addMarketigTemplate = (marketing: MarketingTemplateInput) => {
    fetchRequest<MarketingTemplate | null>("POST", "/api/marketing", "addMarketingTemplate", {
      marketing,
    }).then(onAddedMarketing);
  };

  return (
    <DialogWrapper
      onOpenChange={() => {}}
      title="Aggiungi azione di marketing"
      trigger={<Button>Aggiungi nuova azione</Button>}
      footer={
        <DialogClose className="flex w-full gap-2">
          <Button className="w-full" variant={"outline"}>
            Indietro
          </Button>
          <Button className="w-full" onClick={() => addMarketigTemplate(newMarketingTemplate)}>
            Aggiungi
          </Button>
        </DialogClose>
      }
      putSeparator
    >
      <MarketingInputFields
        marketingTemplate={newMarketingTemplate}
        setMarketingTemplate={setNewMarketingTemplate}
      />
    </DialogWrapper>
  );
}
