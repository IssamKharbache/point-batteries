import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const GET = async () => {
  try {
    const product = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        data: product,
        message: "product",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error while getting products",
    });
  }
};
