import bcrypt from "bcryptjs";
import db from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import { generateUsername } from "@/lib/utils/index";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { email, password, nom, prenom, role, tel } = await req.json();

  try {
    // Validate the request body
    if (!email || !password || !nom || !prenom || !role) {
      return NextResponse.json({
        data: null,
        error: "Some fields are missing",
      });
    }
    const userAlreadyExists = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (userAlreadyExists) {
      return NextResponse.json(
        {
          data: null,
          message: "Utilisateur deja existant",
        },
        { status: 409 }
      );
    }
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //generate the username
    const username = generateUsername(nom, prenom);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role,
        tel,
        identifiant: username,
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
      data: null,
      message: "Une erreur s'est produite",
    });
  }
};
