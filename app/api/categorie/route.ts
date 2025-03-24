import db from "@/lib/db";
import { Product } from "@prisma/client";
import { NextResponse } from "next/server";

interface Category {
  id: string;
  title: string;
  description: string;
  products: Product[];
}
export const GET = async () => {
  try {
    const categorie = await db.category.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        products: true,
      },
    });
    // Loop through each category and sort its products
    categorie.forEach((category) => {
      if (category.products) {
        category.products.sort((a, b) => {
          const marqueA = a.marque?.toUpperCase();
          const marqueB = b.marque?.toUpperCase();
          b;

          // Prioritize AMARON
          if (marqueA === "AMARON" && marqueB !== "AMARON") return -1;
          if (marqueA !== "AMARON" && marqueB === "AMARON") return 1;
          // then Prioritize BOSCH
          if (marqueA === "BOSCH" && marqueB !== "BOSCH") return -1;
          if (marqueA !== "BOSCH" && marqueB === "BOSCH") return 1;
          // Then prioritize Fiamm
          if (marqueA === "FIAMM" && marqueB !== "FIAMM") return -1;
          if (marqueA !== "FIAMM" && marqueB === "FIAMM") return 1;
          // Then prioritize Exide
          if (marqueA === "EXIDE" && marqueB !== "EXIDE") return -1;
          if (marqueA !== "EXIDE" && marqueB === "EXIDE") return 1;
          return 0;
        });
      }
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
