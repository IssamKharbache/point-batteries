import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ marque: string }> }
) => {
  try {
    const marque = (await context.params).marque;

    const products = await db.product.findMany({
      where: {
        marque,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        price: true,
        achatPrice: true,
        stock: true,
        capacite: true,
        courantDessai: true,
        marque: true,
        designationProduit: true,
        voltage: true,
        categoryId: true,
        imageUrl: true,
        garantie: true,
        imageKey: true,
        isAchatProduct: true,
        filterByCar: true,
        refProduct: true,
      },
    });
    if (!products) {
      return NextResponse.json({
        data: null,
        message: "Produits non trouvé",
      });
    }

    return NextResponse.json({
      data: products,
      message: "Produits trouvee",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Erreur pendant la retrer de produit, veuillez essayer apres.",
      error,
    });
  }
};
