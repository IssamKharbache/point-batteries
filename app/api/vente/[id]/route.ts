import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const venteId = (await context.params).id;

    // Check if any returns reference this vente as source
    const hasReturns = await db.return.findFirst({
      where: {
        returnFrom: "vente",
        sourceId: venteId,
      },
    });

    if (hasReturns) {
      return NextResponse.json(
        { error: "Cannot delete vente with associated returns" },
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
        status: 201,
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
