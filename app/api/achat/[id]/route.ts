import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const id = (await context.params).id;
  try {
    const isExisting = await db.achat.findUnique({
      where: {
        id,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Achat non trouve",
        },
        { status: 404, statusText: "Achat non trouve" }
      );
    }
    await db.achat.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        message: "Achat supprimer avec succes",
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
          "Erreur pendant la supprimation d'achat , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
