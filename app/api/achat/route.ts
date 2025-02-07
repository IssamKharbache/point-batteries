import { generateReferenceAchat } from "./../../../lib/utils/index";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import db from "@/lib/db";

const prisma = new PrismaClient();

type CreateAchatProduct = {
  productId: string; // Assuming product ID is a string (change to number if needed)
  qty: number;
};
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
    const productRefs = products.map((p: Product) => p.refProduct);

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
    const productsData: CreateAchatProduct[] = products.map(
      (p: { refProduct: string; quantity: string }) => ({
        productId: productMap.get(p.refProduct) as string, // Ensuring it's a string
        qty: parseInt(p.quantity),
      })
    );

    const refAchat = generateReferenceAchat();
    // Create the achat and link products
    const newAchat = await prisma.achat.create({
      data: {
        userId,
        refAchat,
        products: {
          create: productsData,
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
        status: 201,
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

export const GET = async () => {
  try {
    const achats = await db.achat.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: true,
      },
    });
    return NextResponse.json(
      {
        data: achats,
        message: "Achats",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting achat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
