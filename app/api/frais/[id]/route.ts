import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const id = (await context.params).id;
  try {
    const isExisting = await db.cost.findUnique({
      where: {
        id,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Frais non trouve",
        },
        { status: 404, statusText: "Frais non trouve" }
      );
    }
    await db.cost.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        message: "Frais supprimer avec succes",
      },
      {
        status: 201,
        statusText: "deleted",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Erreur pendant la supprimation de Frais , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
