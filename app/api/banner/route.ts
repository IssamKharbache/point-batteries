import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const banners = await db.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        data: banners,
        message: "Banners",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error while getting banners",
    });
  }
};
