import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { ComponentType, useCallback } from "react";
import { ActionProps, FormFieldsProps } from "../Manager";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@phosphor-icons/react";
import { BaseEntity } from "@/app/(site)/hooks/backend/useManager";

export default function EditAction<TDomain extends BaseEntity>({
  handleUpdate,
  FormFields,
  title,
}: {
  handleUpdate: (object: TDomain, values: Partial<TDomain>) => void;
  FormFields: ComponentType<FormFieldsProps<TDomain>>;
  title: string;
}) {
  return useCallback(
    ({ object }: ActionProps<TDomain>) => (
      <WasabiDialog
        putSeparator
        putUpperBorder
        size="medium"
        title={`Modifica ${title}`}
        trigger={
          <Button variant="outline">
            <PencilIcon size={20} />
          </Button>
        }
      >
        <FormFields
          object={object}
          handleSubmit={(values) => handleUpdate(object, values)}
          submitLabel="Modifica"
        />
      </WasabiDialog>
    ),
    [handleUpdate]
  );
}
