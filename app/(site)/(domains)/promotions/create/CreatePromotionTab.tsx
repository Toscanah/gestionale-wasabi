import WasabiAnimatedTab from "@/components/shared/wasabi/WasabiAnimatedTab";
import { useZodForm } from "@/hooks/useZodForm";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PromotionType } from "@/prisma/generated/client/enums";
import { CreatePromotionFormSchema, CreatePromotionFormSchemaType } from "./CreatePromotionForm";
import { Button } from "@/components/ui/button";
import CommonFields from "./fields/CommonFields";
import { SpecificFieldsProps } from "./fields/SpecificFields";
import { ReactNode } from "react";

export type PromotionFormProp = ReturnType<typeof useZodForm<typeof CreatePromotionFormSchema>>;

interface CreatePromotionTabProps {
  selectedType: PromotionType;
  type: PromotionType;
  form: PromotionFormProp;
  onSubmit: (data: CreatePromotionFormSchemaType) => void;
  children: ReactNode;
}

export default function CreatePromotionTab({
  selectedType,
  type,
  form,
  onSubmit,
  children,
}: CreatePromotionTabProps) {
  return (
    <WasabiAnimatedTab value={type} currentValue={selectedType}>
      <Card className="h-full">
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col h-full gap-4"
            >
              <CommonFields form={form} />
              {children}
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Crea promozione
          </Button>
        </CardFooter>
      </Card>
    </WasabiAnimatedTab>
  );
}
