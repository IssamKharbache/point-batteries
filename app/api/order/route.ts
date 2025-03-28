import { CartItem } from "@/context/store";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { orderItems, formData } = await req.json();
  const {
    prenom,
    nom,
    telephone,
    adresse,
    ville,
    codePostal,
    email,
    notesCommande,
    userId,
    orderNumber,
  } = formData;

  try {
    const result = await db.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        //create new order
        const newOrder = await prisma.order.create({
          data: {
            prenom,
            nom,
            telephone,
            adresse,
            ville,
            codePostal,
            email,
            notesCommande,
            userId,
            orderNumber,
          },
        });
        const newOrderItems = await prisma.orderItem.createMany({
          data: orderItems.map((item: CartItem) => ({
            title: item.title,
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            price: item.price,
          })),
        });

        return { newOrder, newOrderItems };
      }
    );

    return NextResponse.json(
      {
        data: result.newOrder,
      },
      {
        status: 201,
        statusText: "created",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error while creating order",
      },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const orders = await db.order.findMany({
      orderBy: {
        createdAt: "desc",
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
