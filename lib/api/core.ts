import * as routers from "./routers";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  orders: routers.ordersRouter,
  addresses: routers.addressesRouter,
  categories: routers.categoriesRouter,
  customers: routers.customersRouter,
  engagements: routers.engagementsRouter,
  meta: routers.metaRouter,
  options: routers.optionsRouter,
  payments: routers.paymentsRouter,
  products: routers.productsRouter,
  rice: routers.riceRouter,
  promotions: routers.promotionsRouter,
});

export type AppRouter = typeof appRouter;
