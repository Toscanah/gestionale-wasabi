import { TemplateBodyExample, TemplateHeaderTextExample } from "../../shared";

type ExampleType = "header_text" | "body_text";

export default function getExampleParams(
  type: ExampleType,
  example: TemplateBodyExample | TemplateHeaderTextExample | undefined
): string[] | undefined {
  if (!example) return undefined;

  switch (type) {
    case "header_text":
      return (example as TemplateHeaderTextExample)?.header_text;
    case "body_text":
      return (example as TemplateBodyExample).body_text?.[0];
    default:
      return undefined;
  }
}