import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  type ProductWhereInput = Prisma.ProductWhereInput;

  // Extract query parameters
  const categoryId = searchParams.get("catId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("pageNum") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const marque = searchParams.get("marque") || "";

  // Validate page and pageSize
  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
    return NextResponse.json(
      { message: "Invalid page or pageSize parameters" },
      { status: 400 }
    );
  }

  // Build the `where` clause dynamically
  const where: ProductWhereInput = {};

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Filter by price range
  if (marque) {
    where.filterByCar = { contains: marque, mode: "insensitive" };
  }

  // Filter by search term (case-insensitive)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } }, // Search in product name
      { description: { contains: search, mode: "insensitive" } }, // Search in product description
      { marque: { contains: search, mode: "insensitive" } }, // Search in product marque
      { filterByCar: { contains: search, mode: "insensitive" } }, // Search in product car brand
      { category: { title: { contains: search, mode: "insensitive" } } }, //search in category product
    ];
  }
  if (search && marque) {
    where.filterByCar = { contains: marque, mode: "insensitive" };
    where.OR = [
      { title: { contains: search, mode: "insensitive" } }, // Search in product name
      { description: { contains: search, mode: "insensitive" } }, // Search in product description
      { marque: { contains: search, mode: "insensitive" } }, // Search in product marque
      { filterByCar: { contains: search, mode: "insensitive" } }, // Search in product car brand
      { category: { title: { contains: search, mode: "insensitive" } } }, //search in category product
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
      include: {
        category: true,
      },
    });

    // Get total count of products matching the filters (for pagination)
    const totalCount = await db.product.count({ where });

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json(
      {
        data: products,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
        message: "Products fetched successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
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
