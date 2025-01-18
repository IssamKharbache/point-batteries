import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await context.params).id;

    if (!id) {
      return NextResponse.json({
        data: null,
        message: "Unauthorized",
      });
    }

    const orders = await db.order.findMany({
      where: {
        userId: id,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({
      data: orders,
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
