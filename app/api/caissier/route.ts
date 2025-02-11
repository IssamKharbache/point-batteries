import db from "@/lib/db";
import { NextResponse } from "next/server";
export const GET = async () => {
  try {
    const users = await db.user.findMany({
      where: {
        role: "CAISSIER",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        identifiant: true,
        role: true,
        tel: true,
      },
    });
    return NextResponse.json({
      data: users,
      message: "User details",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Error getting users",
      },
      {
        status: 500,
      }
    );
  }
};
