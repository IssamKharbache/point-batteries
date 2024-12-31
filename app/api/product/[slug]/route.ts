import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ParamsProps {
  slug: string;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: ParamsProps }
) => {
  const { slug } = await params;
  try {
    const product = await db.product.findUnique({
      where: {
        slug,
      },
      select: {
        title: true,
        description: true,
        price: true,
        stock: true,
        capacite: true,
        courantDessai: true,
        marque: true,
        variationProduct: true,
        voltage: true,
        categoryId: true,
      },
    });
    if (!product) {
      return NextResponse.json({
        data: null,
        message: "there is no such product",
      });
    }
    return NextResponse.json({
      data: product,
      message: "Product data found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Erreur pendant la retrer de produit, veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: ParamsProps }
) => {
  const { slug } = await params;

  try {
    const isExisting = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Produit n'existe pas ",
        },
        { status: 404, statusText: "Produit n'existe pas " }
      );
    }
    await db.product.delete({
      where: {
        slug,
      },
    });
    return NextResponse.json(
      {
        message: "Produit supprimer avec succes",
      },
      {
        status: 200,
        statusText: "deleted",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Erreur pendant la supprimation du produit, veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
