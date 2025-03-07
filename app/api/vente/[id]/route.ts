import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type UpdateVenteProduct = {
  productId: string;
  qty: number;
  price: number;
  designationProduit: string;
  discount: number;
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const venteId = (await context.params).id;

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

    // Fetch the existing vente
    const existingVente = await db.vente.findUnique({
      where: { id: venteId },
      include: { products: true },
    });

    if (!existingVente) {
      return NextResponse.json({ error: "Vente not found" }, { status: 404 });
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
    const productsData: UpdateVenteProduct[] = products.map(
      (p: {
        refProduct: string;
        quantity: string;
        price: number;
        designationProduit: string;
        discount: string;
      }) => ({
        productId: productMap.get(p.refProduct) as string,
        qty: parseInt(p.quantity),
        price: p.price,
        designationProduit: p.designationProduit,
        discount: parseFloat(p.discount),
      })
    );

    // Update the vente and its products
    const updatedVente = await db.$transaction(async (prisma) => {
      // Delete existing products associated with the vente
      await prisma.venteProduct.deleteMany({
        where: { venteId },
      });

      // Update the vente
      const updatedVente = await prisma.vente.update({
        where: { id: venteId },
        data: {
          userId,
          clientNom,
          clientPrenom,
          paymentType,
          clientTel,
          nomDuCaissier,
          generateFacture,
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

      return updatedVente;
    });

    return NextResponse.json(
      {
        data: updatedVente,
        message: "Vente updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating vente:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const venteId = (await context.params).id;

    // Fetch the existing vente
    const existingVente = await db.vente.findUnique({
      where: { id: venteId },
      include: { products: true },
    });

    if (!existingVente) {
      return NextResponse.json({ error: "Vente not found" }, { status: 404 });
    }

    // Delete the vente and its associated products
    await db.$transaction(async (prisma) => {
      // Restore product stock
      for (const item of existingVente.products) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.qty },
            vente: { decrement: item.qty },
          },
        });
      }

      // Delete the vente
      await prisma.vente.delete({
        where: { id: venteId },
      });
    });

    return NextResponse.json(
      {
        message: "Vente deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting vente:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
