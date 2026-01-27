import { PromotionType } from "@/prisma/generated/client/enums";
import { useState } from "react";
import { PromotionContracts } from "@/lib/shared";
import { addMonths } from "date-fns";
import { CreatePromotionFormSchemaType } from "@/domains/promotions/create/CreatePromotionForm";
import { promotionsAPI } from "@/lib/trpc/api";
import { trpc } from "@/lib/trpc/client";

type PromotionCreateSchema = PromotionContracts.Common.PromotionCreateSchema;
const {
  FixedDiscountPromotionCreateSchema,
  GiftCardPromotionCreateSchema,
  PercentageDiscountPromotionCreateSchema,
} = PromotionContracts.Common;

export function createEmptyPromotion(type: PromotionType): PromotionCreateSchema {
  const base = {
    id: -1,
    code: "",
    label: "",
    expires_at: addMonths(new Date(), 3),
    never_expires: false,
    usages: [],
  };

  switch (type) {
    case PromotionType.FIXED_DISCOUNT:
      return FixedDiscountPromotionCreateSchema.parse({
        ...base,
        type,
        fixed_amount: 0,
        reusable: false,
      });

    case PromotionType.GIFT_CARD:
      return GiftCardPromotionCreateSchema.parse({
        ...base,
        type,
        fixed_amount: 0,
        reusable: false,
      });

    case PromotionType.PERCENTAGE_DISCOUNT:
      return PercentageDiscountPromotionCreateSchema.parse({
        ...base,
        type,
        percentage_value: 0,
        reusable: false,
        max_usages: null,
      });

    default:
      throw new Error(`Unsupported promotion type: ${type}`);
  }
}

export default function usePromotionsCreation() {
  const [selectedType, setSelectedType] = useState<PromotionType>(PromotionType.FIXED_DISCOUNT);

  const handleTypeChange = (type: PromotionType) => {
    setSelectedType(type);
    return createEmptyPromotion(type);
  };

  function mapFormToCreateInput(
    data: CreatePromotionFormSchemaType
  ): PromotionContracts.Create.Input["promotion"] {
    switch (data.type) {
      case PromotionType.FIXED_DISCOUNT:
        return {
          type: data.type,
          code: data.code,
          label: data.label,
          expires_at: data.expires_at,
          never_expires: data.never_expires,
          fixed_amount: data.fixed_amount ?? 0,
          reusable: false,
        };

      case PromotionType.GIFT_CARD:
        return {
          type: data.type,
          code: data.code,
          label: data.label,
          expires_at: data.expires_at,
          never_expires: data.never_expires,
          fixed_amount: data.fixed_amount ?? 0,
          reusable: false,
        };

      case PromotionType.PERCENTAGE_DISCOUNT:
        return {
          type: data.type,
          code: data.code,
          label: data.label,
          expires_at: data.expires_at,
          never_expires: data.never_expires,
          percentage_value: data.percentage_value ?? 0,
          reusable: data.reusable ?? false,
          max_usages: data.reusable ? (data.max_usages ?? null) : null,
        };
    }
  }

  const productCreationMutation = promotionsAPI.create.useMutation();
  const utils = trpc.useUtils();

  const handlePromotionCreation = async (data: CreatePromotionFormSchemaType) => {
    await productCreationMutation.mutateAsync({ promotion: mapFormToCreateInput(data) });
    await utils.promotions.getAll.invalidate();
  };

  return {
    selectedType,
    handleTypeChange,
    handlePromotionCreation,
  };
}
