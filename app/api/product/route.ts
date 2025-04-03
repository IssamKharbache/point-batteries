import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";
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
  const where: ProductWhereInput = {
    stock: {
      gt: 0,
    },
  };

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (marque) {
    where.marque = {
      contains: marque,
      mode: "insensitive",
    };
  }

  try {
    // Fetch all products (without marque or search filters initially)
    let products = await db.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });
    // Move products with marque "BOSCH" to the top
    products = products.sort((a, b) => {
      const marqueA = a.marque?.toUpperCase();
      const marqueB = b.marque?.toUpperCase();

      // Prioritize AMARON
      if (marqueA === "AMARON" && marqueB !== "AMARON") return -1;
      if (marqueA !== "AMARON" && marqueB === "AMARON") return 1;
      // then Prioritize BOSCH
      if (marqueA === "BOSCH" && marqueB !== "BOSCH") return -1;
      if (marqueA !== "BOSCH" && marqueB === "BOSCH") return 1;
      // Then prioritize Fiamm
      if (marqueA === "FIAMM" && marqueB !== "FIAMM") return -1;
      if (marqueA !== "FIAMM" && marqueB === "FIAMM") return 1;
      // Then prioritize Exide
      if (marqueA === "EXIDE" && marqueB !== "EXIDE") return -1;
      if (marqueA !== "EXIDE" && marqueB === "EXIDE") return 1;

      return 0;
    });

    // Apply fuzzy search for `search` parameter if provided
    if (search) {
      const fuseOptions = {
        keys: [
          "title",
          "description",
          "marque",
          "filterByCar",
          "category.title",
        ],
        threshold: 0.3,
        distance: 30,
        ignoreLocation: true,
        minMatchCharLength: 2,
        shouldSort: true,
        includeMatches: true,
      };

      const fuse = new Fuse(products, fuseOptions);
      const searchResults = fuse.search(search);

      // Extract the matched products
      products = searchResults.map((result) => result.item);
    }

    // Paginate the results
    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginatedProducts = products.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    return NextResponse.json(
      {
        data: paginatedProducts,
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
