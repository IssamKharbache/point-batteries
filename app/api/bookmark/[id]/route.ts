import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const userId = (await context.params).id;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("pageNum") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "4");
  try {
    const bookmarks = await db.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Get the total count of orders for pagination
    const totalCount = await db.bookmark.count({
      where: {
        userId,
      },
    });

    return NextResponse.json(
      {
        data: bookmarks,
        message: "Favourites",
        totalCount: totalCount,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error || "Internal Server Error",
      message: "Error while trying to get favourites products",
    });
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const productId = (await context.params).id;
  const { userId } = await req.json();

  try {
    if (!userId) {
      return NextResponse.json(
        {
          message: "You must be logged in",
        },
        {
          status: 401,
          statusText: "unauthorized",
        }
      );
    }
    if (!productId) {
      return NextResponse.json(
        {
          message: "You have to choose a product to bookmark",
        },
        {
          status: 404,
          statusText: "product not found",
        }
      );
    }
    const bookmark = await db.bookmark.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
      },
      update: {},
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

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { userId } = await req.json();

  const productId = (await context.params).id;

  try {
    if (!userId) {
      return NextResponse.json(
        {
          message: "You must be logged in",
        },
        {
          status: 401,
          statusText: "unauthorized",
        }
      );
    }
    if (!productId) {
      return NextResponse.json(
        {
          message: "You have to choose a product to bookmark",
        },
        {
          status: 404,
          statusText: "product not found",
        }
      );
    }

    const bookmark = await db.bookmark.deleteMany({
      where: {
        userId,
        productId,
      },
    });
    return NextResponse.json(
      {
        data: bookmark,
        message: "Removed from favourite successfully",
      },
      {
        status: 201,
        statusText: "removed",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while trying to delete bookmarked product",
    });
  }
};
