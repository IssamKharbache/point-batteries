import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateUsername } from "@/lib/utils/index";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password, nom, prenom, role } = await req.json();

    if (!nom || !prenom || !email || !password || !role) {
      return NextResponse.json({
        data: null,
        message: "All fields are required",
      });
    }
    const userAlreadyExist = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (userAlreadyExist) {
      return NextResponse.json(
        {
          data: null,
          message:
            "Utilisateur déjà existant , veuillez essayer avec un autre email",
        },
        { status: 409 }
      );
    }
    const username = generateUsername(nom, prenom);
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role,
        identifiant: username,
      },
      select: {
        email: true,
        nom: true,
        prenom: true,
        role: true,
        identifiant: true,
      },
    });
    return NextResponse.json(
      {
        data: newUser,
        message: "Utilisateur créé avec succès",
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
