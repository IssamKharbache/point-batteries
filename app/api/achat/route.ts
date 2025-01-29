import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const { userId, products } = await req.json();

    if (!userId || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Missing userId or products" },
        { status: 400 }
      );
    }

    // Fetch the existing product IDs using refProduct
    const productRefs = products.map((p: any) => p.refProduct);

    const existingProducts = await prisma.product.findMany({
      where: { refProduct: { in: productRefs } },
    });

    if (existingProducts.length !== products.length) {
      return NextResponse.json(
        { error: "Un des produit n'existe pas" },
        { status: 404 }
      );
    }

    // Map products to their corresponding IDs
    const productMap = new Map(
      existingProducts.map((p) => [p.refProduct, p.id])
    );

    // Create the achat and link products
    const newAchat = await prisma.achat.create({
      data: {
        userId,
        products: {
          create: products.map((p: any) => ({
            productId: productMap.get(p.refProduct),
            qty: parseInt(p.quantity),
            price: parseFloat(p.price),
          })),
        },
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(
      {
        data: newAchat,
        message: "Achat créé avec succès",
      },
      {
        statusText: "created",
      }
    );
  } catch (error) {
    console.error("Error creating achat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
