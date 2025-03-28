import db from "@/lib/db";
import { generateReturnReference } from "@/lib/utils/index";
import { NextRequest, NextResponse } from "next/server";

type CreateReturnProduct = {
  productId: string;
  qty: number;
  designationProduit: string;
  marque: string;
};
export const POST = async (req: NextRequest) => {
  try {
    const { userId, products, returnFrom, nomDuCaissier, sourceId } =
      await req.json();

    // Validate sourceId for vente returns
    if (returnFrom === "vente" && !sourceId) {
      return NextResponse.json(
        { error: "Source ID is required for vente returns" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }
    // Validate venteId if returning from vente
    if (returnFrom === "vente" && !sourceId) {
      return NextResponse.json(
        { error: "Vente ID is required for vente returns" },
        { status: 400 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "Products list is empty" },
        { status: 400 }
      );
    }

    // Fetch the existing products using refProduct
    const productRefs = products.map(
      (p: { refProduct: string }) => p.refProduct
    );
    const existingProducts = await db.product.findMany({
      where: { refProduct: { in: productRefs } },
    });

    if (existingProducts.length !== products.length) {
      return NextResponse.json(
        { error: "One or more products do not exist" },
        { status: 404 }
      );
    }

    // Map products to their corresponding IDs
    const productMap = new Map(
      existingProducts.map((p) => [p.refProduct, p.id])
    );

    // Prepare the data for VenteProduct relation, including price
    const productsData: CreateReturnProduct[] = products.map(
      (p: {
        refProduct: string;
        quantity: string;
        marque: string;
        designationProduit: string;
      }) => ({
        refProduct: p.refProduct,
        marque: p.marque,
        productId: productMap.get(p.refProduct) as string,
        qty: parseInt(p.quantity),
        designationProduit: p.designationProduit,
      })
    );

    // Generate a unique vente reference
    const returnRef = await generateReturnReference();

    // Create the vente and link products, then update stock & vente count
    const newReturn = await db.$transaction(async (prisma) => {
      const createdReturn = await prisma.return.create({
        data: {
          userId,
          sourceId: returnFrom === "vente" ? sourceId : null,
          products: {
            create: productsData,
          },
          returnRef,
          returnFrom,
          nomDuCaissier,
        },
        include: {
          products: true,
        },
      });

      // Update product stock and vente count
      for (const item of productsData) {
        await prisma.product.update({
          where: { id: item.productId },
          data:
            returnFrom === "product"
              ? { stock: { decrement: item.qty } }
              : {
                  stock: { increment: item.qty },
                  vente: { decrement: item.qty },
                },
        });
      }

      return createdReturn;
    });

    return NextResponse.json(
      {
        data: newReturn,
        message: "Retour créé avec succès",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating return :", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const lesRetour = await db.return.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: true,
      },
    });
    return NextResponse.json({
      data: lesRetour,
      message: "Return details",
    });
  } catch (error) {
    console.error("Error getting return:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
