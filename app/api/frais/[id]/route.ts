import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
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
          message: "Frais n'existe pas ",
        },
        { status: 404, statusText: "Frais n'existe pas " }
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
          "Erreur pendant la supprimation du frais, veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};
