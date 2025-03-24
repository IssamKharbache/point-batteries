import { startCronJobs } from "@/lib/cron/cron.service";
import { NextResponse } from "next/server";

export async function GET() {
  startCronJobs();
  return NextResponse.json({ message: "Cron jobs started" });
}
