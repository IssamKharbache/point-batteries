import db from "@/lib/db";
import { generateUniqueDevisRef } from "@/lib/utils/index";
import { NextRequest, NextResponse } from "next/server";

type CreateDevisProduct = {
  productId: string;
  qty: number;
  price: number;
  designationProduit: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const {
      userId,
      products,
      clientNom,
      clientPrenom,
      clientTel,
      nomDuCaissier,
    } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }
    if (
      !userId ||
      !clientNom ||
      !clientPrenom ||
      !clientTel ||
      !nomDuCaissier ||
      !products
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

    const productsData: CreateDevisProduct[] = products.map(
      (p: {
        refProduct: string;
        quantity: string;
        marque: string;
        price: number;
        designationProduct: string;
        discount: string;
      }) => ({
        refProduct: p.refProduct,
        marque: p.marque,
        productId: productMap.get(p.refProduct) as string,
        qty: parseInt(p.quantity),
        price: p.price,
        designationProduit: p.designationProduct,
        discount: parseInt(p.discount),
      })
    );

    const devisRef = await generateUniqueDevisRef();

    const newDevis = await db.devis.create({
      data: {
        userId,
        clientNom,
        clientPrenom,
        devisRef,
        clientTel,
        nomDuCaissier,
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
        data: newDevis,
        message: "Devis creer avec succès",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating devis :", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const devis = await db.devis.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(
      {
        data: devis,
        message: "Devis récupérés avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis" },
      { status: 500 }
    );
  }
};
