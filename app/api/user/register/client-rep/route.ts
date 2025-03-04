import db from "@/lib/db";
import { generateUsername } from "@/lib/utils/index";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { nom, prenom, tel } = await req.json();
  const username = generateUsername(nom, prenom);
  try {
    if (!nom || !prenom || !tel) {
      return NextResponse.json({
        data: null,
        message: "All fields are required",
      });
    }
    const newCompanyClient = await db.companyClient.create({
      data: {
        nom,
        prenom,
        tel,
        identifiant: username,
      },
    });
    return NextResponse.json(
      {
        data: newCompanyClient,
        message: "Client rep créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Internal server error",
    });
  }
};
