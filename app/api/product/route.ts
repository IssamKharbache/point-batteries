import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  type ProductWhereInput = Prisma.ProductWhereInput;

  // Extract query parameters
  const categoryId = searchParams.get("catId");
  const search = searchParams.get("search");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const sortBy = searchParams.get("sort") || "desc"; // Default sorting
  const page = parseInt(searchParams.get("pageNum") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // Build the `where` clause dynamically
  const where: ProductWhereInput = {};

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Filter by price range
  if (min || max) {
    where.price = {};
    if (min) where.price.gte = parseFloat(min);
    if (max) where.price.lte = parseFloat(max);
  }

  // Filter by search term (case-insensitive)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } }, // Search in product name
      { description: { contains: search, mode: "insensitive" } }, // Search in product description
      { marque: { contains: search, mode: "insensitive" } }, //search in product marque
      { filterByCar: { contains: search, mode: "insensitive" } }, //search in product car brand
    ];
  }

  try {
    // Fetch products with filters, sorting, and pagination
    const products = await db.product.findMany({
      where,
      orderBy: {
        createdAt: sortBy === "asc" ? "asc" : "desc", // Sort by creation date
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
