import { Button } from "@/components/ui/button";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import MetaTemplatePreview from "./MetaTemplatePreview";
import useMetaTemplates from "../../../../hooks/meta/useMetaTemplates";
import { useTemplatesParams } from "../../../../hooks/meta/useTemplatesParams";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MetaTemplate, TemplateStatus } from "@/lib/shared";
import { ORDER_CONFIRMATION_TEMPLATE_NAME } from "@/lib/integrations/meta/constants";

export default function SendMessagesDialog() {
  const [open, setOpen] = useState(false);
  const { paramsMap, setParam, getParams } = useTemplatesParams();
  const { templates, selectedTemplates, toggleTemplate, sendMessages, canSend, selectedOrders } =
    useMetaTemplates({ open, paramsMap });

  const handleSend = async () =>
    await sendMessages().then((success) => {
      if (success) {
        setOpen(false);
      }
    });

  const isApproved = (template: MetaTemplate) =>
    template.status.toUpperCase() === TemplateStatus.APPROVED;
  const isOrderConfm = (template: MetaTemplate) =>
    template.name === ORDER_CONFIRMATION_TEMPLATE_NAME;

  // const filteredTemplates = templates.filter((template) => template.name !== "conferma_ordine");

  return (
    <WasabiDialog trigger={<Button>Manda messaggi</Button>} open={open} onOpenChange={setOpen}>
      <Accordion type="single" collapsible className="w-full">
        {templates.map((template, index) => (
          <div key={template.id} className="flex gap-6 w-full items-center">
            <Checkbox
              disabled={!isApproved(template) || isOrderConfm(template)}
              checked={selectedTemplates.includes(template.name)}
              onCheckedChange={(checked) => toggleTemplate(template.name, !!checked)}
            />

            <AccordionItem value={template.id} className="w-full">
              <AccordionTrigger
                disabled={!isApproved(template) || isOrderConfm(template)}
                className={cn(
                  (!isApproved(template) || isOrderConfm(template)) && "hover:no-underline"
                )}
              >
                <div
                  className={cn(
                    "w-full flex justify-start gap-2",
                    !isApproved(template) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span>
                    #{index + 1} - {template.name}{" "}
                  </span>
                  <Badge
                    className={cn(
                      "pointer-events-none hover:text-inherit hover:bg-inherit",
                      isApproved(template) ? "bg-green-400 text-foreground" : "bg-destructive"
                    )}
                  >
                    {isApproved(template) ? "Approvato" : "Non approvato - Altro"}
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4">
                <MetaTemplatePreview
                  template={template}
                  getParams={getParams}
                  setParam={setParam}
                />
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>

      <Button onClick={handleSend} disabled={!canSend}>
        {canSend
          ? selectedTemplates.length > 1 || selectedOrders.length > 1
            ? "Manda messaggi"
            : "Manda messaggio"
          : "Seleziona almeno un template"}
      </Button>
    </WasabiDialog>
  );
}
