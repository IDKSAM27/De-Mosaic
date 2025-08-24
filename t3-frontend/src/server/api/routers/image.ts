// src/server/api/routers/image.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const imageRouter = createTRPCRouter({
  process: publicProcedure
    .input(z.object({ imageBase64: z.string() }))
    .mutation(async ({ input }) => {
      // 1. Extract the base64 content from the data URL
      const base64Data = input.imageBase64.split(',')[1];
      if (!base64Data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid base64 image format.",
        });
      }

      // 2. Create a Blob from the base64 data
      const imageBlob = await (await fetch(input.imageBase64)).blob();

      // 3. Create FormData to send to the Python service
      const formData = new FormData();
      formData.append("file", imageBlob, "image.png");

      // 4. Proxy the request to the Python AI service
      const pythonApiUrl = "http://127.0.0.1:8000/process-image/";

      try {
        const response = await fetch(pythonApiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Python service failed with status: ${response.status}`,
          });
        }

        // 5. Return the processed image as a new base64 string
        const processedImageBlob = await response.blob();
        const processedImageBuffer = Buffer.from(await processedImageBlob.arrayBuffer());
        const processedBase64 = `data:${processedImageBlob.type};base64,${processedImageBuffer.toString('base64')}`;
        
        return {
          processedImage: processedBase64,
        };
      } catch (error) {
        console.error("Error proxying to Python service:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to communicate with the AI processing service.",
        });
      }
    }),
});
