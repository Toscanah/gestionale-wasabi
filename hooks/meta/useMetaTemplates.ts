import { useEffect, useState } from "react";
import { OrderByType } from "@/lib/shared";
import { useWasabiContext } from "@/context/WasabiContext";
import { toastError, toastSuccess } from "@/lib/shared/utils/global/toast";
import { TemplateParamsMap } from "./useTemplatesParams";
import { trpc } from "@/lib/trpc/client";

type UseMetaTemplatesParams = {
  open: boolean;
  paramsMap: TemplateParamsMap;
};

export default function useMetaTemplates({ open, paramsMap }: UseMetaTemplatesParams) {
  const { selectedOrders, toggleOrderSelection, updateGlobalState } = useWasabiContext();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const { data: templates = [], isFetching, isError } = trpc.meta.getTemplates.useQuery(undefined, {
    enabled: open,
  });

  const sendMutation = trpc.meta.sendMessage.useMutation();

  const toggleTemplate = (templateName: string, checked: boolean) =>
    setSelectedTemplates((prev) =>
      checked ? [...prev, templateName] : prev.filter((name) => name !== templateName)
    );

  const sendMessages = async ({
    templateName,
    order,
    toast = true,
  }: {
    templateName?: string;
    order?: OrderByType;
    toast?: boolean;
  } = {}): Promise<boolean> => {
    const VAR_REGEX = /\{\{(\d+)\}\}/g;

    const templateMap = Object.fromEntries(templates.map((t) => [t.name, t.id]));

    const templateNames = templateName ? [templateName] : selectedTemplates;
    const orders = order ? [order] : selectedOrders;

    const messagePromises: Promise<void>[] = [];

    for (const templateName of templateNames) {
      const templateId = templateMap[templateName];
      const template = templates.find((t) => t.id === templateId);
      if (!templateId || !template) continue;

      const paramGroups = {
        header_text: paramsMap[templateId]?.header_text ?? {},
        body_text: paramsMap[templateId]?.body_text ?? {},
        button_url: paramsMap[templateId]?.button_url ?? {},
      };

      const expectedCounts = { header_text: 0, body_text: 0, button_url: 0 };
      for (const component of template.components) {
        if (component.type === "HEADER" && component.format === "TEXT") {
          expectedCounts.header_text = new Set(
            [...component.text.matchAll(VAR_REGEX)].map((m) => m[1])
          ).size;
        }
        if (component.type === "BODY") {
          expectedCounts.body_text = new Set(
            [...component.text.matchAll(VAR_REGEX)].map((m) => m[1])
          ).size;
        }
        if (component.type === "BUTTONS") {
          for (const button of component.buttons) {
            expectedCounts.button_url += new Set(
              [...button.text.matchAll(VAR_REGEX)].map((m) => m[1])
            ).size;
          }
        }
      }

      const actualCounts = {
        header_text: Object.keys(paramGroups.header_text).length,
        body_text: Object.keys(paramGroups.body_text).length,
        button_url: Object.keys(paramGroups.button_url).length,
      };

      if (
        actualCounts.header_text < expectedCounts.header_text ||
        actualCounts.body_text < expectedCounts.body_text ||
        actualCounts.button_url < expectedCounts.button_url
      ) {
        toastError(
          `Il template "${templateName}" richiede più parametri. Compila tutti i campi prima di inviare.`
        );
        return false;
      }

      for (const order of orders) {
        const promise = sendMutation
          .mutateAsync({
            template: { name: templateName, id: templateId },
            orderId: order.id,
            params: paramGroups,
          })
          .then((updatedOrder) => updateGlobalState(updatedOrder, "update"));

        messagePromises.push(promise);
      }
    }

    const results = await Promise.allSettled(messagePromises);
    const hasErrors = results.some((res) => res.status === "rejected");

    if (hasErrors) {
      toastError("Alcuni messaggi non sono stati inviati.");
      return false;
    } else {
      if (toast) toastSuccess("Messaggi inviati con successo!");
      if (!order) selectedOrders.forEach(toggleOrderSelection);
      return true;
    }
  };

  return {
    isMetaError: isError,
    templates,
    selectedTemplates,
    toggleTemplate,
    sendMessages,
    selectedOrders,
    canSend: selectedTemplates.length > 0,
    isFetching,
  };
}
