import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        data: products,
        message: "Products fetched successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Error while fetching products",
      },
      {
        status: 500,
      }
    );
  }
};
