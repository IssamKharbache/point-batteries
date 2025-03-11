import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const id = (await context.params).id;
  try {
    const isExisting = await db.companyClient.findUnique({
      where: {
        id,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Utilisateur non trouve",
        },
        { status: 404, statusText: "Utilisateur non trouve" }
      );
    }
    await db.companyClient.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        message: "Utilisateur supprimer avec succes",
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
          "Erreur pendant la supprimation de staff , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
