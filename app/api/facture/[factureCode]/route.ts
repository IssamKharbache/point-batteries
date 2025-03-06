import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ factureCode: string }>;
  }
) => {
  const factureCode = (await context.params).factureCode;
  try {
    const vente = await db.vente.findUnique({
      where: { factureCode: factureCode as string },
      include: { products: true },
    });

    if (!vente) {
      return NextResponse.json(
        { message: "Facture introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: vente,
      },
      { status: 201 }
    );
  } catch (error) {
    NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
};
