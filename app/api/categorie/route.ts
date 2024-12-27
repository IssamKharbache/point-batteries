import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categorie = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        data: categorie,
        message: "Categorie",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error while getting categories",
    });
  }
};
