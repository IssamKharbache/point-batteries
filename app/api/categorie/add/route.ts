import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { title, description, slug } = await req.json();

    const categoryExists = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (categoryExists) {
      return NextResponse.json(
        {
          data: null,
          message: "Categorie existe deja",
        },
        {
          status: 409,
          statusText: "conflict",
        }
      );
    }
    if (!title || !description || !slug)
      return NextResponse.json({
        data: null,
        message: "All fields are required",
      });

    const newCategorie = await db.category.create({
      data: {
        title,
        description,
        slug,
      },
    });
    return NextResponse.json(
      {
        data: newCategorie,
        message: "Categorie créé avec succès",
      },
      {
        status: 201,
        statusText: "created",
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error,
      message: "Internal server error",
    });
  }
};
