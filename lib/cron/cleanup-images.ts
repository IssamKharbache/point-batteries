import { PrismaClient } from "@prisma/client";
import { UTApi } from "uploadthing/server";

const prisma = new PrismaClient();
const utapi = new UTApi();

export default async function cleanupOrphanedImages() {
  try {
    // 1. Get all active imageKeys from database
    const productImages = await prisma.product.findMany({
      select: { imageKey: true },
    });
    const bannerImages = await prisma.banner.findMany({
      select: { imageKey: true },
    });

    const activeImageKeys = new Set([
      ...productImages.map((p) => p.imageKey).filter(Boolean),
      ...bannerImages.map((b) => b.imageKey).filter(Boolean),
    ]);

    // 2. List all files from Uploadthing
    const { files } = await utapi.listFiles();
    const uploadthingKeys = files.map((f) => f.key);

    // 3. Find orphaned files (in Uploadthing but not in DB)
    const orphanedKeys = uploadthingKeys.filter(
      (key) => !activeImageKeys.has(key)
    );

    // 4. Delete orphaned files in batches
    const BATCH_SIZE = 50;
    let totalDeleted = 0;
    let totalFailed = 0;

    for (let i = 0; i < orphanedKeys.length; i += BATCH_SIZE) {
      const batch = orphanedKeys.slice(i, i + BATCH_SIZE);
      const result = await utapi.deleteFiles(batch);

      if (result.success) {
        console.log(`Deleted batch of ${result.deletedCount} files`);
        totalDeleted += result.deletedCount;
      } else {
        console.error(`Failed to delete batch starting with ${batch[0]}`);
        totalFailed += batch.length;
      }
    }

    console.log(
      orphanedKeys.length > 0
        ? `Cleanup completed: ${totalDeleted} deleted, ${totalFailed} failed`
        : "No orphaned files found"
    );

    return {
      totalDeleted,
      totalFailed,
      totalOrphaned: orphanedKeys.length,
    };
  } catch (error) {
    console.error("Error in image cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run directly if this is the main module
if (require.main === module) {
  cleanupOrphanedImages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
