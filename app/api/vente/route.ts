import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import db from "@/lib/db";
import { generateUniqueVenteRef } from "@/lib/utils/index";

type CreateVenteProduct = {
  productId: string;
  qty: number;
};

export const POST = async (req: NextRequest) => {
  try {
    const {
      userId,
      products,
      paymentType,
      clientNom,
      clientPrenom,
      clientCin,
      clientTel,
    } = await req.json();

    if (
      !userId ||
      !paymentType ||
      !clientNom ||
      !clientPrenom ||
      !clientCin ||
      !clientTel
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "Products list is empty" },
        { status: 400 }
      );
    }

    // Fetch the existing products using refProduct
    const productRefs = products.map(
      (p: { refProduct: string }) => p.refProduct
    );
    const existingProducts = await db.product.findMany({
      where: { refProduct: { in: productRefs } },
    });

    if (existingProducts.length !== products.length) {
      return NextResponse.json(
        { error: "One or more products do not exist" },
        { status: 404 }
      );
    }

    // Map products to their corresponding IDs
    const productMap = new Map(
      existingProducts.map((p) => [p.refProduct, p.id])
    );

    // Prepare the data for VenteProduct relation, including price
    const productsData: CreateVenteProduct[] = products.map(
      (p: {
        refProduct: string;
        quantity: string;
        price: number;
        designationProduit: string;
      }) => ({
        productId: productMap.get(p.refProduct) as string,
        qty: parseInt(p.quantity),
        price: p.price,
        designationProduit: p.designationProduit,
      })
    );

    // Generate a unique vente reference
    const venteRef = await generateUniqueVenteRef();

    // Create the vente and link products
    const newVente = await db.vente.create({
      data: {
        userId,
        clientNom,
        clientPrenom,
        clientCin,
        venteRef,
        paymentType,
        clientTel,
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
        data: newVente,
        message: "Vente created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating vente:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const lesVentes = await db.vente.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: true,
      },
    });
    return NextResponse.json({
      data: lesVentes,
      message: "Vente details",
    });
  } catch (error) {
    console.error("Error getting vente:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
