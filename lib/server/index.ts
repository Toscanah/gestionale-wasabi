import { ordersRouter } from "./routers/orders";
import { createTRPCRouter } from "./trpc";

const appRouter = createTRPCRouter({
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
