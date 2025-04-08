import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { PaymentType } from "@prisma/client";

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
        message: "Vente supprimer aven success",
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

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const venteId = (await context.params).id;

  try {
    const vente = await db.vente.findUnique({
      where: { id: venteId },
    });

    if (!vente) {
      return NextResponse.json({ error: "Vente not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: vente,
      message: "Vente details",
    });
  } catch (error) {
    console.error("Error fetching vente:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const venteId = (await context.params).id;
    const { paymentType } = await req.json();

    if (!venteId) {
      return NextResponse.json(
        { error: "Vente ID is required" },
        { status: 400 }
      );
    }

    // Validate paymentType is a valid enum value
    const validPaymentTypes: PaymentType[] = [
      "ESPECE",
      "CHECK",
      "VIREMENT",
      "ACREDIT",
    ];
    if (!paymentType || !validPaymentTypes.includes(paymentType)) {
      return NextResponse.json(
        { error: "Valid payment type is required" },
        { status: 400 }
      );
    }

    const updatedVente = await db.vente.update({
      where: { id: venteId },
      data: { paymentType },
    });

    return NextResponse.json(
      {
        data: updatedVente,
        message: "Vente modifier avec succès",
      },
      {
        status: 201,
        statusText: "updated",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while trying to update vente",
    });
  }
};
