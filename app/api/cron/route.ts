import db from "@/lib/db";
import { UTApi } from "uploadthing/server";

export const GET = async () => {
  try {
    // Fetch all used imageKeys from Product and Banner tables
    const productImages = await db.product.findMany({
      select: { imageKey: true },
    });

    const bannerImages = await db.banner.findMany({
      select: { imageKey: true },
    });

    // Combine used image keys (remove null values)
    const usedImageKeys = new Set(
      [...productImages, ...bannerImages]
        .map((item) => item.imageKey)
        .filter((key): key is string => key !== null)
    );

    const utApi = new UTApi();
    const uploadedImages = await utApi.listFiles();

    const unusedImages = uploadedImages.files
      .map((file) => file.key)
      .filter((key) => !usedImageKeys.has(key));

    if (unusedImages.length === 0) {
      return Response.json({ message: "No unused images found" });
    }

    // Delete unused images from UploadThing
    await utApi.deleteFiles(unusedImages);

    return Response.json(
      {
        message: "Unused images deleted",
        deleted: unusedImages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
