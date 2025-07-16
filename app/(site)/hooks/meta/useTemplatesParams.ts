import { useState, useCallback } from "react";

export type ParamType = "header_text" | "body_text" | "button_text";

export type TemplateParamsMap = Record<
  string, // templateId
  Partial<Record<ParamType, Record<number, string>>> // index → value per type
>;

export function useTemplatesParams() {
  const [paramsMap, setParamsMap] = useState<TemplateParamsMap>({});

  const setParam = useCallback(
    (templateId: string, type: ParamType, index: number, value: string) => {
      setParamsMap((prev) => ({
        ...prev,
        [templateId]: {
          ...prev[templateId],
          [type]: {
            ...prev[templateId]?.[type],
            [index]: value,
          },
        },
      }));
    },
    []
  );

  const getParams = useCallback(
    (templateId: string, type: ParamType): Record<number, string> => {
      return paramsMap[templateId]?.[type] ?? {};
    },
    [paramsMap]
  );

  return {
    paramsMap,
    setParam,
    getParams,
  };
}
