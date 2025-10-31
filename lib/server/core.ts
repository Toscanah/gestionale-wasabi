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
  promotionsRouter,
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
  promotions: promotionsRouter,
});

export type AppRouter = typeof appRouter;
