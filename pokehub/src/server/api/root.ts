import { catalogRouter } from "~/server/api/routers/catalog";
import { checkoutRouter } from "~/server/api/routers/checkout";
import { orderRouter } from "~/server/api/routers/order";
import { productRouter } from "~/server/api/routers/product";
import { uploadRouter } from "~/server/api/routers/upload";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  catalog: catalogRouter,
  checkout: checkoutRouter,
  order: orderRouter,
  product: productRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
