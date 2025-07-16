export enum TemplateStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum TemplateParameterFormat {
  POSITIONAL = "POSITIONAL",
  // NAMED = "NAMED",
}

export enum TemplateCategory {
  AUTHENTICATION = "AUTHENTICATION",
  MARKETING = "MARKETING",
  UTILITY = "UTILITY",
}

export enum TemplateLanguage {
  IT = "it_IT",
  EN = "en_US",
  // You can add more or use TemplateLanguageEnum as string union
}

export enum TemplateComponentType {
  HEADER = "HEADER",
  BODY = "BODY",
  FOOTER = "FOOTER",
  BUTTONS = "BUTTONS",
}

export enum TemplateFormat {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  LOCATION = "LOCATION",
}

export enum ButtonType {
  QUICK_REPLY = "QUICK_REPLY",
  URL = "URL",
  PHONE_NUMBER = "PHONE_NUMBER",
}
