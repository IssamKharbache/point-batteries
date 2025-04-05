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
      devisRef,
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
      !products ||
      !devisRef
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating devis :", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
