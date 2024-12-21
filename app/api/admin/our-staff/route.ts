import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const staff = await db.user.findMany({
      where: {
        role: "SMALLADMIN",
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        tel: true,
        role: true,
        identifiant: true,
      },
    });
    return NextResponse.json(
      {
        data: staff,
        message: "Liste des staffs",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      data: null,
      message: "Une erreur s'est produite pendant la récupération des staffs",
    });
  }
};
