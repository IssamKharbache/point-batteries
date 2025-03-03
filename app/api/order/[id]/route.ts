import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
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
      totalCount: totalCount,
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
  context: {
    params: Promise<{ id: string }>;
  }
) => {
  const id = (await context.params).id;
  const { status } = await req.json();

  try {
    const updateOrder = await db.order.update({
      where: {
        id,
      },
      data: {
        orderStatus: status,
      },
    });

    // If status is updated to "confirmed", update stock and sales
    if (status === "EXPEDIE") {
      const orderItems = await db.orderItem.findMany({
        where: { orderId: id },
      });

      for (const item of orderItems) {
        await db.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            vente: { increment: item.quantity },
          },
        });
      }
    }

    return NextResponse.json(
      {
        data: updateOrder,
        message: "Commande status modifié avec succès",
      },
      {
        status: 201,
        statusText: "updated",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Erreur pendant la modification du status du produit, veuillez essayer après.",
        error,
      },
      { status: 500 }
    );
  }
};
