export enum AddressChoice {
  NORMAL = "NORMAL",
  NEW = "NEW",
  TEMPORARY = "TEMPORARY",
}

export type AddressChoiceType = keyof typeof AddressChoice;
