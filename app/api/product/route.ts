import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const {
      title,
      slug,
      description,
      imageUrl,
      productPrice,
      productStock,
      capacite,
      marque,
      variationProduct,
      courantDessai,
      garantie,
    } = await req.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      data: null,
      message: "Error while creating new product",
    });
  }
};
