import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { userId, productId } = await req.json();

  try {
    if (!userId || !productId) {
      return NextResponse.json({
        message: "Unauthorized",
      });
    }
    const bookmark = await db.bookmark.create({
      data: {
        userId,
        productId,
      },
    });
    return NextResponse.json(
      {
        data: bookmark,
        message: "Bookmarked successfully",
      },
      {
        status: 201,
        statusText: "bookmarked",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while trying to bookmark product",
    });
  }
};
