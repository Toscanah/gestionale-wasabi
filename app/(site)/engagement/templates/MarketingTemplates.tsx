import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import useMarketingTemplates from "../../hooks/engagement/templates/useMarketingTemplates";
import { Accordion } from "@/components/ui/accordion";
import TemplatePayload from "./components/TemplatePayload";

export default function MarketingTemplates() {
  const {
    templates,
    setTemplates,
    selectedType,
    setSelectedType,
    draftPayload,
    setDraftPayload,
    updateTemplate,
    createTemplate,
  } = useMarketingTemplates();

  return (
    <DialogWrapper
      title={"Modelli marketing"}
      size="medium"
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">Modelli</SidebarMenuSubButton>
      }
    >
      <Accordion type="multiple" className="w-full">
        <TemplatePayload
          mode="create"
          index={templates.length + 1}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          draftPayload={draftPayload}
          onChange={(newPayload) => setDraftPayload((prev) => ({ ...prev, ...newPayload }))}
          onCreate={(newTemplate) => createTemplate(newTemplate)}
        />

        {templates.map((template, index) => (
          <TemplatePayload
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
