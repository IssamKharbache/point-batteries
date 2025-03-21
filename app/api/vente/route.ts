import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateUniqueVenteRef } from "@/lib/utils/index";

type CreateVenteProduct = {
  productId: string;
  qty: number;
  price: number;
  designationProduit: string;
  discount: number;
};

export const POST = async (req: NextRequest) => {
  try {
    const {
      userId,
      products,
      nomDuCaissier,
      paymentType,
      clientNom,
      clientPrenom,
      clientTel,
      generateFacture,
      factureCode,
      venteBenifits,
    } = await req.json();

    if (
      !userId ||
      !paymentType ||
      !clientNom ||
      !clientPrenom ||
      !clientTel ||
      !nomDuCaissier
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
        marque: string;
        price: number;
        designationProduit: string;
        discount: string;
        productVenteBenifit: number;
      }) => ({
        refProduct: p.refProduct,
        marque: p.marque,
        productId: productMap.get(p.refProduct) as string,
        qty: parseInt(p.quantity),
        price: p.price,
        designationProduit: p.designationProduit,
        discount: parseFloat(p.discount),
        productVenteBenifit: p.productVenteBenifit,
      })
    );

    // Generate a unique vente reference
    const venteRef = await generateUniqueVenteRef();

    // Create the vente and link products, then update stock & vente count
    const newVente = await db.$transaction(async (prisma) => {
      const createdVente = await prisma.vente.create({
        data: {
          userId,
          clientNom,
          clientPrenom,
          venteRef,
          paymentType,
          clientTel,
          nomDuCaissier,
          generateFacture,
          venteBenifits,
          factureCode: generateFacture ? factureCode : null,
          products: {
            create: productsData,
          },
        },
        include: {
          products: true,
        },
      });

      // Update product stock and vente count
      for (const item of productsData) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.qty },
            vente: { increment: item.qty },
          },
        });
      }

      return createdVente;
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
