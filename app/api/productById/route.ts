import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll("id");

    if (!ids.length) {
      return NextResponse.json({ data: [], message: "No IDs provided" });
    }

    const products = await db.product.findMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ data: products, message: "Products found" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
};
