import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import useMarketingTemplates from "../../hooks/engagement/templates/useMarketingTemplates";
import { Accordion } from "@/components/ui/accordion";
import TemplateContent from "./components/TemplateContent";

export default function MarketingTemplates() {
  const {
    templates,
    setTemplates,
    draftTemplate,
    setDraftTemplate,
    updateTemplate,
    createTemplate,
  } = useMarketingTemplates();

  return (
    <DialogWrapper
      title="Modelli marketing"
      size="medium"
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">Modelli</SidebarMenuSubButton>
      }
    >
      <Accordion type="multiple" className="w-full">
        <TemplateContent
          mode="create"
          index={templates.length + 1}
          draftTemplate={draftTemplate}
          onChange={(updatedDraft) => setDraftTemplate((prev) => ({ ...prev, ...updatedDraft }))}
          onCreate={(newTemplate) => createTemplate(newTemplate)}
        />

        {templates.map((template, index) => (
          <TemplateContent
            key={template.id}
            index={index}
            mode="edit"
            template={template}
            onChange={(newPayload) =>
              setTemplates((prev) =>
                prev.map((t) => (t.id === template.id ? { ...t, payload: newPayload as any } : t))
              )
            }
            onSave={(updatedTemplate) => updateTemplate(updatedTemplate)}
          />
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
