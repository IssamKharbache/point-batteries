import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  type ProductWhereInput = Prisma.ProductWhereInput;

  // Extract query parameters
  const marque = searchParams.get("marque"); // Get marque from query params
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("pageNum") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // Build the `where` clause dynamically
  const where: ProductWhereInput = {};

  // Filter by marque
  if (marque) {
    where.marque = marque;
  }

  // Filter by search term (case-insensitive)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } }, // Search in product name
      { description: { contains: search, mode: "insensitive" } }, // Search in product description
      { marque: { contains: search, mode: "insensitive" } }, // Search in product marque
      { filterByCar: { contains: search, mode: "insensitive" } }, // Search in product car brand
    ];
  }

  try {
    // Fetch products with filters, sorting, and pagination
    const products = await db.product.findMany({
      where,
      orderBy: {
        createdAt: "asc", // Sort by creation date
      },
      skip: (page - 1) * pageSize, // Pagination: skip items
      take: pageSize, // Pagination: take items
    });

    // Get total count of products matching the filters (for pagination)
    const totalCount = await db.product.count({ where });

    return NextResponse.json(
      {
        data: products,
        totalCount,
        message: "Products fetched successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error while fetching products",
      },
      {
        status: 500,
      }
    );
  }
};
