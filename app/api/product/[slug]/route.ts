import db from "@/lib/db";
import { uatpi } from "@/lib/uploadthing-server";

import { NextRequest, NextResponse } from "next/server";

interface ParamsProps {
  slug: string;
}

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  try {
    const slug = (await context.params).slug;
    const {
      title,
      description,
      imageUrl,
      price,
      stock,
      capacite,
      marque,
      designationProduit,
      courantDessai,
      garantie,
      categoryId,
      userId,
      voltage,
      imageKey,
    } = await req.json();
    if (
      !title &&
      !description &&
      !imageUrl &&
      !price &&
      !stock &&
      !capacite &&
      !marque &&
      !designationProduit &&
      !courantDessai &&
      !garantie &&
      !categoryId &&
      !voltage &&
      !userId
    ) {
      return NextResponse.json({
        data: null,
        message: "No changes",
      });
    }
    const existProduct = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (!existProduct) {
      return NextResponse.json({
        data: null,
        message: "Produit n'existe pas",
      });
    }
    const updatedProduct = await db.product.update({
      where: {
        slug,
      },
      data: {
        title,
        slug,
        description,
        imageUrl,
        imageKey,
        price: parseFloat(price),
        stock: parseInt(stock),
        capacite: parseInt(capacite),
        voltage: parseInt(voltage),
        marque,
        designationProduit,
        courantDessai: parseInt(courantDessai),
        garantie,
        categoryId,
        userId,
      },
    });
    return NextResponse.json(
      {
        data: updatedProduct,
        message: "Produit modifier avec succès",
      },
      {
        status: 200,
        statusText: "updated",
      }
    );
  } catch (error) {
    console.log(error);
    NextResponse.json({
      error,
      message: "Error while trying to update produit",
    });
  }
};

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
        slug: true,
        title: true,
        description: true,
        price: true,
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

    if (isExisting.imageKey) {
      await uatpi.deleteFiles(isExisting.imageKey);
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
