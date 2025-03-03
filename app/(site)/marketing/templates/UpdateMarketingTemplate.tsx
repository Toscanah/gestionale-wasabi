import { Button } from "@/components/ui/button";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import MarketingInputFields from "./components/MarketingInputFields";
import { MarketingTemplateInput } from "../../models";
import { Dispatch, SetStateAction, useState } from "react";
import fetchRequest from "../../functions/api/fetchRequest";
import { MarketingTemplate } from "@prisma/client";
import { toastSuccess } from "../../functions/util/toast";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface UpdateMarketingTemplateProps {
  marketingTemplate: MarketingTemplate;
  onUpdatedMarketing: (marketing: MarketingTemplate | null) => void;
}

export default function UpdateMarketingTemplate({
  marketingTemplate,
  onUpdatedMarketing,
}: UpdateMarketingTemplateProps) {
  const [updatedMarketingTemplate, setUpdatedMarketingTemplate] =
    useState<MarketingTemplate>(marketingTemplate);

  const updateMarketingTemplate = (marketing: MarketingTemplate) => {
    fetchRequest<MarketingTemplate | null>("POST", "/api/marketing", "updateMarketingTemplate", {
      marketing,
    }).then(onUpdatedMarketing);
  };

  return (
    <DialogWrapper
      trigger={<Button>Modifica</Button>}
      title="Modifica azione di marketing"
      putSeparator
      footer={
        <DialogClose className="flex w-full gap-2">
          <Button className="w-full" variant={"outline"}>
            Indietro
          </Button>
          <Button
            className="w-full"
            onClick={() => updateMarketingTemplate(updatedMarketingTemplate)}
          >
            Aggiungi
          </Button>
        </DialogClose>
      }
    >
      <MarketingInputFields
        marketingTemplate={updatedMarketingTemplate}
        setMarketingTemplate={setUpdatedMarketingTemplate as any}
      />
    </DialogWrapper>
  );
}
