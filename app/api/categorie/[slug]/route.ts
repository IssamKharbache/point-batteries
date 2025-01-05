import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ParamsProps {
  slug: string;
}
export const DELETE = async (
  req: NextRequest,
  { params: { slug } }: { params: ParamsProps }
) => {
  try {
    const isExisting = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Categorie non trouve",
        },
        { status: 404, statusText: "Categorie non trouve" }
      );
    }
    await db.category.delete({
      where: {
        slug,
      },
    });
    return NextResponse.json(
      {
        message: "Categorie supprimer avec succes",
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
          "Erreur pendant la supprimation de categorie , veuillez essayer apres.",
        error,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  try {
    const slug = (await context.params).slug;
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({
        data: null,
        message: "No changes",
      });
    }
    const existCat = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (!existCat) {
      return NextResponse.json({
        data: null,
        message: "Categorie n'existe pas",
      });
    }
    const updatedCategory = await db.category.update({
      where: {
        slug,
      },
      data: {
        title,
        description,
      },
    });
    return NextResponse.json(
      {
        data: updatedCategory,
        message: "Categorie modifier avec succès",
      },
      {
        status: 200,
        statusText: "updated",
      }
    );
  } catch (error) {
    console.log(error);
    NextResponse.json({
      error,
      message: "Error while trying to update category",
    });
  }
};

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  try {
    const slug = (await context.params).slug;

    const category = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (!category) {
      return NextResponse.json({
        data: null,
        message: "Categorie not found",
      });
    }
    return NextResponse.json({
      data: category,
      message: "Category found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while getting category data",
    });
  }
};
