import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";

interface ParamsProps {
  id: string;
}
export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: ParamsProps }
) => {
  try {
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
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await context.params).id;
    const { nom, prenom, password, email } = await req.json();
    let hashedPassword;

    const existingUser = await db.user.findUnique({
      where: {
        identifiant: id,
      },
    });
    if (!existingUser) {
      return NextResponse.json({
        data: null,
        message: "Utilisateur non trouvé",
      });
    }
    if (email !== existingUser.email) {
      const isEmailExists = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (isEmailExists) {
        return NextResponse.json(
          {
            data: null,
            message: "Email adresse déjà utilisé",
          },
          {
            statusText: "conflict",
          }
        );
      }
    }
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updateUser = await db.user.update({
      where: {
        identifiant: id,
      },
      data: {
        nom,
        prenom,
        password: password ? hashedPassword : existingUser.password,
        email,
      },
    });

    return NextResponse.json(
      {
        data: updateUser,
        message: "Utilisateur modifier avec succès",
      },
      {
        status: 200,
        statusText: "updated",
      }
    );
  } catch (error) {
    return NextResponse.json({
      message:
        "Erreur pendant la modification , essayez s'il vous plaît plus tard",
      error,
    });
  }
};

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await context.params).id;

    const user = await db.user.findFirst({
      where: {
        identifiant: id,
      },
      select: {
        nom: true,
        prenom: true,
        email: true,
        identifiant: true,
        role: true,
        tel: true,
      },
    });
    if (!user) {
      return NextResponse.json({
        data: null,
        message: "Utilisateur non trouvé",
      });
    }

    return NextResponse.json({
      data: user,
      message: "Utilisateur trouve",
    });
  } catch (error) {
    return NextResponse.json({
      message:
        "Erreur pendant la supprimation de staff , veuillez essayer apres.",
      error,
    });
  }
};
