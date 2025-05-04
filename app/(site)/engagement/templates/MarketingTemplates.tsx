import { EngagementTemplate } from "@prisma/client";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import useMarketingTemplates from "../../hooks/engagement/templates/useMarketingTemplates";
import { Accordion } from "@/components/ui/accordion";
import CreateTemplate from "./components/CreateTemplate";
import TemplatePayload from "./components/TemplatePayload";

export default function MarketingTemplates() {
  const { templates } = useMarketingTemplates();

  return (
    <DialogWrapper
      title={"Modelli marketing"}
      size="medium"
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">Modelli</SidebarMenuSubButton>
      }
    >
      <Accordion type="multiple" className="w-full">
        <CreateTemplate />

        {templates.map((template, index) => (
          <TemplatePayload key={template.id} template={template} index={index} />
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
