import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { useZodForm } from "@/app/(site)/hooks/useZodForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "@phosphor-icons/react";
import { PromotionType } from "@/prisma/generated/client/enums";
import CreatePromotionTab from "./CreatePromotionTab";
import {
  FixedDiscountFields,
  GiftCardFields,
  PercentageDiscountFields,
} from "./fields/SpecificFields";
import { CreatePromotionFormSchema, CreatePromotionFormSchemaType } from "./CreatePromotionForm";
import usePromotionsCreation, {
  createEmptyPromotion,
} from "@/app/(site)/hooks/promotions/usePromotionsCreation";

interface CreatePromotionDialogProps {
  disabled?: boolean;
}

export default function CreatePromotionDialog({ disabled }: CreatePromotionDialogProps) {
  const { handleTypeChange, selectedType, handlePromotionCreation } = usePromotionsCreation();

  const form = useZodForm({
    schema: CreatePromotionFormSchema,
    defaultValues: createEmptyPromotion(selectedType),
  });

  const handleTabChange = (type: PromotionType) => {
    const defaults = handleTypeChange(type);
    form.reset(defaults);
  };

  const handleFormSubmit = (data: CreatePromotionFormSchemaType) => {
    handlePromotionCreation(data);
    form.reset(createEmptyPromotion(selectedType));
  };

  return (
    <WasabiDialog
      title="Crea una nuova promozione"
      putSeparator
      putUpperBorder
      trigger={
        <Button disabled={disabled} className="flex items-center gap-2">
          <PlusIcon size={20} />
        </Button>
      }
    >
      <Tabs
        value={selectedType}
        onValueChange={(value) => handleTabChange(value as PromotionType)}
        className="gap-4"
      >
        <TabsList className="w-full">
          <TabsTrigger value={PromotionType.FIXED_DISCOUNT}>Sconto fisso</TabsTrigger>
          <TabsTrigger value={PromotionType.GIFT_CARD}>Gift card</TabsTrigger>
          <TabsTrigger value={PromotionType.PERCENTAGE_DISCOUNT}>Sconto percentuale</TabsTrigger>
        </TabsList>

        <CreatePromotionTab
          form={form}
          onSubmit={handleFormSubmit}
          selectedType={selectedType}
          type={PromotionType.FIXED_DISCOUNT}
        >
          <FixedDiscountFields form={form} />
        </CreatePromotionTab>

        <CreatePromotionTab
          form={form}
          onSubmit={handleFormSubmit}
          selectedType={selectedType}
          type={PromotionType.GIFT_CARD}
        >
          <GiftCardFields form={form} />
        </CreatePromotionTab>

        <CreatePromotionTab
          form={form}
          onSubmit={handleFormSubmit}
          selectedType={selectedType}
          type={PromotionType.PERCENTAGE_DISCOUNT}
        >
          <PercentageDiscountFields form={form} />
        </CreatePromotionTab>
      </Tabs>
    </WasabiDialog>
  );
}
