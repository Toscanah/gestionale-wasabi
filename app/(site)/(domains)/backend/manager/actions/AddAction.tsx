import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { ComponentType, useMemo } from "react";
import { FormFieldsProps } from "../Manager";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { BaseEntity } from "@/app/(site)/hooks/backend/useManager";
import { MANAGER_LABELS } from "@/app/(site)/lib/shared/constants/manager-labels";
import { inferItalianGender } from "@/app/(site)/lib/utils/global/string/itGender";

export default function AddAction<TDomain extends BaseEntity>({
  handleAdd,
  FormFields,
  title,
  disabled,
}: {
  handleAdd: (values: Partial<TDomain>) => void;
  FormFields: ComponentType<FormFieldsProps<TDomain>>;
  title: string;
  disabled?: boolean;
}) {
  const addWord = useMemo(() => (inferItalianGender(title) === "f" ? "Nuova" : "Nuovo"), [title]);

  return useMemo(
    () => (
      <WasabiDialog
        putSeparator
        putUpperBorder
        size="medium"
        title={`${addWord} ${title}`}
        trigger={
          <Button disabled={disabled} className="ml-auto flex items-center gap-2">
            <PlusIcon size={20} />
            {/* {addWord} {title} */}
          </Button>
        }
      >
        <FormFields handleSubmit={handleAdd} submitLabel={"Crea"} />
      </WasabiDialog>
    ),
    [handleAdd, title]
  );
}
