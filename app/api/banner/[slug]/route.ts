import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  const slug = (await context.params).slug;
  try {
    const isExisting = await db.banner.findUnique({
      where: {
        slug,
      },
    });
    if (!isExisting) {
      return NextResponse.json(
        {
          message: "Banniere non trouve",
        },
        { status: 404, statusText: "Banniere non trouve" }
      );
    }
    await db.banner.delete({
      where: {
        slug,
      },
    });
    return NextResponse.json(
      {
        message: "Banniere supprimer avec succes",
      },
      {
        status: 201,
        statusText: "deleted",
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Erreur pendant la supprimation de Banniere , veuillez essayer apres.",
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
    const { title, link, imageUrl, imageKey } = await req.json();
    if (!title && !link && !imageUrl && !imageKey) {
      return NextResponse.json({
        data: null,
        message: "No changes",
      });
    }
    const existCat = await db.banner.findUnique({
      where: {
        slug,
      },
    });
    if (!existCat) {
      return NextResponse.json({
        data: null,
        message: "Banniere n'existe pas",
      });
    }
    const updatedBanner = await db.banner.update({
      where: {
        slug,
      },
      data: {
        title,
        link,
        imageUrl,
        imageKey,
      },
    });
    return NextResponse.json(
      {
        data: updatedBanner,
        message: "Banniere modifier avec succès",
      },
      {
        status: 201,
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

    const banner = await db.banner.findUnique({
      where: {
        slug,
      },
    });
    if (!banner) {
      return NextResponse.json({
        data: null,
        message: "Banner not found",
      });
    }
    return NextResponse.json({
      data: banner,
      message: "Banniere found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while getting category data",
    });
  }
};
