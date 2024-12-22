import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ParamsProps {
  id: string;
}
export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: ParamsProps }
) => {
  try {
    console.log(id);

    const isExisting = await db.user.findUnique({
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
    await db.user.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        message: "Utilisateur supprimer avec succes",
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
          "Erreur pendant la supprimation de staff , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ id });
};
