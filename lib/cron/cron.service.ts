import cron from "node-cron";
import cleanupOrphanedImages from "./cleanup-images";

export function startCronJobs() {
  // Run daily at 3 AM
  cron.schedule("*/2 * * * *", async () => {
    console.log("Running image cleanup...");
    await cleanupOrphanedImages();
  });
}
