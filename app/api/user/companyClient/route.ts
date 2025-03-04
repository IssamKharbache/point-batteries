import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const users = await db.companyClient.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
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
