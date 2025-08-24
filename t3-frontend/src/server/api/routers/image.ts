// src/server/api/routers/image.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const imageRouter = createTRPCRouter({
  process: publicProcedure
    .input(z.object({ imageBase64: z.string() }))
    .mutation(async ({ input }) => {
      const base64Data = input.imageBase64.split(',')[1];
      if (!base64Data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid base64 image format.",
        });
      }

      const imageBlob = await (await fetch(input.imageBase64)).blob();
      const formData = new FormData();
      formData.append("file", imageBlob, "image.png");
      const pythonApiUrl = "http://127.0.0.1:8000/process-image/";

      // Set a longer timeout for the fetch request (e.g., 10 minutes = 600,000ms)
      // This is for development on a CPU. A GPU in production will be much faster.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);

      try {
        const response = await fetch(pythonApiUrl, {
          method: "POST",
          body: formData,
          signal: controller.signal, // Add the abort signal here
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Python service failed with status: ${response.status}`,
          });
        }

        const processedImageBlob = await response.blob();
        const processedImageBuffer = Buffer.from(await processedImageBlob.arrayBuffer());
        const processedBase64 = `data:${processedImageBlob.type};base64,${processedImageBuffer.toString('base64')}`;
        
        return {
          processedImage: processedBase64,
        };
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error("Fetch aborted due to timeout.");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "The AI processing took too long and timed out. Please try a smaller image.",
          });
        }
        console.error("Error proxying to Python service:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to communicate with the AI processing service.",
        });
      } finally {
        // Clear the timeout timer to prevent it from running unnecessarily
        clearTimeout(timeoutId);
      }
    }),
});
