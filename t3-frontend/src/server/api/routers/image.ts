// src/server/api/routers/image.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const imageRouter = createTRPCRouter({
  process: publicProcedure
    .input(z.object({ imageBase64: z.string() }))
    .mutation(async ({ input }) => {
      // 1. Convert base64 input to a Buffer
      const imageBuffer = Buffer.from(input.imageBase64.split(',')[1], 'base64');
      
      // 2. Create FormData to send to the Python service
      const formData = new FormData();
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
      formData.append("file", imageBlob, "image.png");

      // 3. Proxy the request to the Python AI service
      const pythonApiUrl = "http://127.0.0.1:8000/process-image/"; // Ensure your Python service runs here

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

        // 4. Return the processed image as a base64 string
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
