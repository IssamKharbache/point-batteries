import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
type bookmarkType = {
  productId: string;
};
export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Fetch all bookmarked product IDs for the user
    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      select: { productId: true },
    });

    const bookmarkedProductIds = bookmarks.map(
      (bookmark: bookmarkType) => bookmark.productId
    );

    return NextResponse.json(
      { bookmarkedProductIds, message: "Bookmarks fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
