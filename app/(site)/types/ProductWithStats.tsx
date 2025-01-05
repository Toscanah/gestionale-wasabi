import { Product } from "../models";

export type ProductWithStats = Product & {
  quantity: number;
  total: number;
};
