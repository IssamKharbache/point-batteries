import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const categoryId = request.nextUrl.searchParams.get("catId");
  //price params
  const sortBy = searchParams.get("sort");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  //page params
  const page = parseInt(searchParams.get("pageNum") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  //sorting by price
  let where: any = {
    categoryId,
  };
  let totalCount;

  //sorting by min and max
  if (min && max) {
    where.price = {
      gte: parseFloat(min),
      lte: parseFloat(max),
    };
  } else if (min) {
    where.price = {
      gte: parseFloat(min),
    };
  } else if (max) {
    where.price = {
      lte: parseFloat(max),
    };
  }
  let products;
  try {
    if (categoryId) {
      products = await db.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      totalCount = await db.product.count({
        where,
      });
    } else {
      products = await db.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    return NextResponse.json(
      {
        data: products,
        totalCount,
        message: "product",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error while getting products",
    });
  }
};
