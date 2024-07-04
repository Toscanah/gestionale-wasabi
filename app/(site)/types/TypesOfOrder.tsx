export enum TypesOfOrder {
  TABLE = "TABLE",
  TO_HOME = "TO_HOME",
  PICK_UP = "PICK_UP",
}

export type TypeOfOrder = keyof typeof TypesOfOrder;
