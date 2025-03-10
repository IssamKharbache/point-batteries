import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { natureDuFrais, montant, date } = await req.json();
  try {
    if (!natureDuFrais || !montant || !date) {
      return NextResponse.json(
        {
          message: "All fields are Required",
        },
        {
          status: 204,
        }
      );
    }
    const newCost = await db.cost.create({
      data: {
        natureDuFrais,
        montant: parseFloat(montant),
        date,
      },
    });
    return NextResponse.json(
      {
        data: newCost,
        message: "Frais créé avec succès",
      },
      {
        status: 201,
        statusText: "created",
      }
    );
  } catch (error) {
    console.error("Error creating cost: ", error);
    return NextResponse.json(
      {
        message: "Error while creating cost",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async () => {
  try {
    const frais = await db.cost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: frais,
      message: "Costs found",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      message: "Error while getting costs data",
    });
  }
};
