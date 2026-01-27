import WasabiDialog, { WasabiDialogProps } from "@/components/shared/wasabi/WasabiDialog";
import useHandleEngagement from "@/hooks/engagement/useHandleEngagement";
import { toastSuccess } from "@/lib/shared/utils/global/toast";
import { EngagementWithDetails } from "@/lib/shared";
import { Button } from "@/components/ui/button";
import MarketingTemplates from "../../templates/MarketingTemplates";
import { useState } from "react";

type AdminEngagementDialogProps = {
  trigger: WasabiDialogProps["trigger"];
  customerIds: number[];
  onSuccess: (engagements: EngagementWithDetails[]) => void;
};

export default function AdminEngagementDialog({
  trigger,
  customerIds,
  onSuccess,
}: AdminEngagementDialogProps) {
  const [open, setOpen] = useState(false);

  const { createEngagements, selectedTemplates, onSelectTemplate } = useHandleEngagement({
    customerIds,
  });

  const handleCreateEngagement = async () => {
    if (!selectedTemplates.length) return;
    await createEngagements()
      .then(onSuccess)
      .finally(() => {
        setOpen(false);
        toastSuccess("Marketing creato con successo");
      });
  };

  return (
    <WasabiDialog
      title="Marketing clienti"
      trigger={trigger}
      putUpperBorder
      open={open}
      onOpenChange={(open) => {
        selectedTemplates.map((id) => onSelectTemplate(id));
        setOpen(open);
      }}
    >
      <div className="space-y-4">
        <MarketingTemplates
          selection
          selectedTemplateIds={selectedTemplates}
          onSelectTemplate={onSelectTemplate}
        />
        <Button
          className="w-full"
          onClick={handleCreateEngagement}
          disabled={selectedTemplates.length === 0}
        >
          Crea marketing
        </Button>
      </div>
    </WasabiDialog>
  );
}
