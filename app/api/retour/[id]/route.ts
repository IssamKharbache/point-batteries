import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const returnId = params.id;

    await db.$transaction(async (prisma) => {
      // 1. Fetch the return with its products and linked vente
      const returnData = await prisma.return.findUnique({
        where: { id: returnId },
        include: {
          products: true,
          vente: {
            include: { products: { include: { product: true } } },
          },
        },
      });

      if (!returnData) {
        throw new Error("Return not found");
      }

      // 2. Reverse stock changes
      for (const product of returnData.products) {
        await prisma.product.update({
          where: { id: product.productId },
          data:
            returnData.returnFrom === "vente"
              ? {
                  stock: { decrement: product.qty },
                  vente: { increment: product.qty },
                }
              : {
                  stock: { increment: product.qty },
                },
        });
      }

      if (returnData.vente) {
        let benefitToRestore = 0;

        for (const returnedProduct of returnData.products) {
          const originalSale = returnData.vente.products.find(
            (p: { productId: string }) =>
              p.productId === returnedProduct.productId
          );

          if (originalSale) {
            const profitPerUnit =
              (originalSale.price || 0) -
              (originalSale.product.achatPrice || 0);
            benefitToRestore += profitPerUnit * returnedProduct.qty;
          }
        }

        await prisma.vente.update({
          where: { id: returnData.vente.id },
          data: {
            venteBenifits: { increment: benefitToRestore },
          },
        });
      }

      await prisma.return.delete({
        where: { id: returnId },
      });
    });

    return NextResponse.json(
      {
        message: "Retour supprimer avec succes",
      },
      {
        status: 201,
        statusText: "deleted",
      }
    );
  } catch (error) {
    console.error("[DELETE_RETURN]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
