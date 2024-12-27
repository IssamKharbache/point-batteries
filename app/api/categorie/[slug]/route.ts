import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ParamsProps {
  slug: string;
}
export const DELETE = async (
  req: NextRequest,
  { params: { slug } }: { params: ParamsProps }
) => {
  try {
    const isExisting = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Categorie non trouve",
        },
        { status: 404, statusText: "Categorie non trouve" }
      );
    }
    await db.category.delete({
      where: {
        slug,
      },
    });
    return NextResponse.json(
      {
        message: "Categorie supprimer avec succes",
      },
      {
        status: 200,
        statusText: "deleted",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Erreur pendant la supprimation de categorie , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
