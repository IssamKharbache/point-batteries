import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productImageProduct: f({ image: { maxFileSize: "16MB" } })
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { UploadedBy: "uploaded pointbatterie admin" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
