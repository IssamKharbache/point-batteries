import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js"; // Import Fuse.js

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

  try {
    // Fetch all products (without marque or search filters initially)
    let products = await db.product.findMany({
      where,
      include: {
        category: true,
      },
    });

    // Apply fuzzy search for `marque` if provided
    if (marque) {
      const fuseOptions = {
        keys: ["filterByCar"],
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
      };

      const fuse = new Fuse(products, fuseOptions);
      const marqueResults = fuse.search(marque);

      // Extract the matched products
      products = marqueResults.map((result) => result.item);
    }

    // Apply fuzzy search for `search` parameter if provided
    if (search) {
      const fuseOptions = {
        keys: [
          "title",
          "description",
          "marque",
          "filterByCar",
          "category.title",
        ], // Fields to search
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
      };

      const fuse = new Fuse(products, fuseOptions);
      const searchResults = fuse.search(search);

      // Extract the matched products
      products = searchResults.map((result) => result.item);
    }

    // If both `marque` and `search` are provided, ensure the results match both criteria
    if (marque && search) {
      const fuseMarqueOptions = {
        keys: ["filterByCar"], // Field to search for marque
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
      };

      const fuseSearchOptions = {
        keys: [
          "title",
          "description",
          "marque",
          "filterByCar",
          "category.title",
        ], // Fields to search for search
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
      };

      // Apply fuzzy search for marque
      const fuseMarque = new Fuse(products, fuseMarqueOptions);
      const marqueResults = fuseMarque.search(marque);

      // Apply fuzzy search for search
      const fuseSearch = new Fuse(
        marqueResults.map((result) => result.item),
        fuseSearchOptions
      );
      const searchResults = fuseSearch.search(search);

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
