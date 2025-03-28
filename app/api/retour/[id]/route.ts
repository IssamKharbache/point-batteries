import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const returnId = (await context.params).id;

    // Fetch the existing return
    const existingReturn = await db.return.findUnique({
      where: { id: returnId },
      include: { products: true },
    });

    if (!existingReturn) {
      return NextResponse.json({ error: "Return  not found" }, { status: 404 });
    }

    // Delete the return and its associated products
    await db.$transaction(async (prisma) => {
      // Restore product stock
      for (const item of existingReturn.products) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.qty },
          },
        });
      }

      // Delete the return
      await prisma.return.delete({
        where: { id: returnId },
      });
    });

    return NextResponse.json(
      {
        message: "Return deleted successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error deleting Return:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
