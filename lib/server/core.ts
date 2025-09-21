import {
  ordersRouter,
  categoriesRouter,
  addressesRouter,
  customersRouter,
  engagementsRouter,
  metaRouter,
  optionsRouter,
  paymentsRouter,
  productsRouter,
  riceRouter,
} from "./routers/_index";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  orders: ordersRouter,
  addresses: addressesRouter,
  categories: categoriesRouter,
  customers: customersRouter,
  engagements: engagementsRouter,
  meta: metaRouter,
  options: optionsRouter,
  payments: paymentsRouter,
  products: productsRouter,
  rice: riceRouter,
});

export type AppRouter = typeof appRouter;
