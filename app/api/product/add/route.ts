import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const {
      title,
      slug,
      description,
      imageUrl,
      price,
      stock,
      capacite,
      marque,
      variationProduct,
      courantDessai,
      garantie,
      categoryId,
      userId,
      voltage,
    } = await req.json();
    //CHECK IF THE PRODUCT ALREADY EXISTS
    const alreadyExist = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (alreadyExist) {
      return NextResponse.json(
        {
          data: null,
          message: "Product already exists",
        },
        { status: 409, statusText: "Product already exists" }
      );
    }
    const newProduct = await db.product.create({
      data: {
        title,
        slug,
        description,
        imageUrl,
        price: parseFloat(price),
        stock: parseInt(stock),
        capacite: parseInt(capacite),
        voltage: parseInt(voltage),
        marque,
        variationProduct,
        courantDessai: parseInt(courantDessai),
        garantie,
        categoryId,
        userId,
      },
    });
    return NextResponse.json(
      {
        data: newProduct,
        message: "Produit créé avec succès",
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
        data: null,
        message: "Error while creating new product",
      },
      {
        status: 500,
      }
    );
  }
};
