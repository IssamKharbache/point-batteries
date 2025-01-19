import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ id: string; pageNum: string }>;
  }
) => {
  try {
    const id = (await context.params).id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("pageNum") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    if (!id) {
      return NextResponse.json({
        data: null,
        message: "Unauthorized",
      });
    }

    // Get the orders for the current page
    const orders = await db.order.findMany({
      where: {
        userId: id,
      },
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Get the total count of orders for pagination
    const totalCount = await db.order.count({
      where: {
        userId: id,
      },
    });

    return NextResponse.json({
      data: orders,
      totalCount: totalCount, // Add the total count here
      message: "Orders found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while getting order data",
    });
  }
};
