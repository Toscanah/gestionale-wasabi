import { Product } from "../models";

export type OptionStats = {
  option: string;
  count: number;
  position: number;
};

export type ProductWithStats = Product & {
  quantity: number;
  total: number;
  optionsRank: OptionStats[];
};
