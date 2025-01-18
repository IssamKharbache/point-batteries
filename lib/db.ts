import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// async function testConnection() {
//   try {
//     await db.$connect();
//     console.log("Connected to the database successfully!");
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//   }
// }

// if (process.env.NODE_ENV !== "production") {
//   testConnection();
// }

// Exporting db for use in other files
export default db;
