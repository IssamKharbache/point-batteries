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
    const pageSize = 4;

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
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
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

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await context.params).id;
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({
        data: null,
        message: "No changes",
      });
    }
    const existOrder = await db.order.findUnique({
      where: {
        id,
      },
    });
    if (!existOrder) {
      return NextResponse.json({
        data: null,
        message: "Commande n'existe pas",
      });
    }
    const updatedOrder = await db.order.update({
      where: {
        id,
      },
      data: {
        orderStatus: status,
      },
    });
    return NextResponse.json(
      {
        data: updatedOrder,
        message: "Commande modifier avec succès",
      },
      {
        status: 200,
        statusText: "updated",
      }
    );
  } catch (error) {
    console.log(error);
    NextResponse.json({
      error,
      message: "Error while trying to update commande",
    });
  }
};
