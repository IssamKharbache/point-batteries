import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { title, slug, link, imageUrl, imageKey } = await req.json();
  try {
    if (!title || !slug || !link || !imageUrl || !imageKey) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }
    const isExisting = await db.banner.findFirst({
      where: {
        slug,
      },
    });
    if (isExisting) {
      return NextResponse.json(
        {
          message: "A banner with this slug already exists",
        },
        { status: 409 }
      );
    }

    const newBanner = await db.banner.create({
      data: {
        title,
        slug,
        link,
        imageUrl,
        imageKey,
      },
    });
    return NextResponse.json(
      {
        data: newBanner,
        message: "Bannière créé avec succès",
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
