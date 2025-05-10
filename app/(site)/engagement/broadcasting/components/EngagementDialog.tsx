import DialogWrapper, { DialogWrapperProps } from "../../../components/ui/dialog/DialogWrapper";
import useHandleEngagement, {
  UseHandleEngagementParams,
} from "../../../hooks/engagement/useHandleEngagement";
import { EngagementWithDetails } from "../../../shared";
import { toastSuccess } from "../../../lib/util/toast";
import MarketingTemplates from "../../templates/MarketingTemplates";
import { Button } from "@/components/ui/button";

import { OrderEngagementTabs } from "./EngagementTabs";

type EngagementDialogContext = "order" | "admin" | "templates";

type CreateEngagementDialogProps = {
  trigger: DialogWrapperProps["trigger"];
  onSuccess: (engagement: EngagementWithDetails[]) => void;
  context: EngagementDialogContext;
} & UseHandleEngagementParams;

export default function EngagementDialog({
  trigger,
  order,
  customerIds,
  onSuccess,
  context,
}: CreateEngagementDialogProps) {
  const params =
    order !== undefined
      ? { order, customerIds }
      : customerIds !== undefined
      ? { customerIds, order }
      : undefined;

  if (!params) {
    throw new Error("Either order or customerIds must be provided");
  }

  const { createEngagements, selectedTemplates, onSelectTemplate, deleteEngagement } =
    useHandleEngagement(params);

  const onCreateEngagement = async () => {
    if (!selectedTemplates.length) return;
    await createEngagements()
      .then(onSuccess)
      .finally(() => toastSuccess("Marketing creato con successo"));
  };

  return (
    <DialogWrapper title="Marketing" trigger={trigger}>
      <div className="space-y-4">
        {context === "templates" && <MarketingTemplates selection={false} />}

        {context === "admin" && (
          <>
            <MarketingTemplates
              selection
              selectedTemplateIds={selectedTemplates}
              onSelectTemplate={onSelectTemplate}
            />
            <Button
              className="w-full"
              onClick={onCreateEngagement}
              disabled={selectedTemplates.length === 0}
            >
              Vai
            </Button>
          </>
        )}

        {context === "order" && order && (
          <OrderEngagementTabs
            order={order}
            selectedTemplates={selectedTemplates}
            onSelectTemplate={onSelectTemplate}
            onCreateEngagement={onCreateEngagement}
            onDelete={async (engagementId) => {
              deleteEngagement(engagementId);
            }}
          />
        )}
      </div>
    </DialogWrapper>
  );
}
