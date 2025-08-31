import WasabiDialog, { WasabiDialogProps } from "@/app/(site)/components/ui/dialog/WasabiDialog";
import useHandleEngagement from "@/app/(site)/hooks/engagement/useHandleEngagement";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { EngagementWithDetails } from "@/app/(site)/lib/shared";
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
      onOpenChange={setOpen}
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
