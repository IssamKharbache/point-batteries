import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const productId = await (await context.params).id;
  const userId = req.nextUrl.searchParams.get("userId");

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
    const bookmarks = await db.bookmark.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
        include: {
          user: true,
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const productId = await (await context.params).id;
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
  const userId = await req.json();

  const productId = await (await context.params).id;

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
