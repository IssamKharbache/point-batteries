import db from "@/lib/db";
import { NextResponse } from "next/server";
export const GET = async () => {
  try {
    const product = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bookmarks: true,
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
