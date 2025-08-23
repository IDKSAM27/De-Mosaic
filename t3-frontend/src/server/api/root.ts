// src/server/api/root.ts
import { imageRouter } from "~/server/api/routers/image";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  image: imageRouter, // Add this line
});

export type AppRouter = typeof appRouter;
