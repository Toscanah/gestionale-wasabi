import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { useCallback } from "react";
import { ActionProps } from "../Manager";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import { BaseEntity } from "@/hooks/backend/useManager";
import { MANAGER_LABELS } from "@/lib/shared/constants/manager-labels";

export default function DeleteAction<TDomain extends BaseEntity>({
  handleDelete,
}: {
  handleDelete?: (object: TDomain) => void;
}) {
  return useCallback(
    ({ object }: ActionProps<TDomain>) =>
      handleDelete ? (
        <WasabiDialog
          size="small"
          variant="delete"
          title={MANAGER_LABELS.confirmDeleteTitle}
          trigger={
            <Button type="button" variant="destructive">
              <TrashIcon size={20} />
            </Button>
          }
          onDelete={() => handleDelete(object)}
        >
          {MANAGER_LABELS.confirmDeleteMsg}
        </WasabiDialog>
      ) : null,
    [handleDelete]
  );
}
