import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const id = (await context.params).id;
  try {
    const isExisting = await db.devis.findUnique({
      where: {
        id,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Devis non trouve",
        },
        { status: 404, statusText: "Devis non trouve" }
      );
    }
    await db.devis.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        message: "Devis supprimer avec succes",
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
          "Erreur pendant la supprimation de devis , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
