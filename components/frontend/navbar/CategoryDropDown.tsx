import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getData } from "@/lib/getData";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";

const CategoryDropDown = () => {
  const [categoryData, setCategorieData] = useState<CategorieData>();
  useEffect(() => {
    const fetchCat = async () => {
      const cate = await getData("/categorie");
      setCategorieData(cate);
    };
    fetchCat();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus:outline-none hidden md:flex"
      >
        <button className="flex items-center gap-4 hover:bg-gray-100 p-3 px-7  ">
          <HiMenuAlt2 size={20} />
          <span>Acheter Par Categorie</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        {categoryData?.map((cat, index) => (
          <Link href={`/categorie/${cat.slug}`} key={index}>
            <DropdownMenuItem className="cursor-pointer w-full py-4 px-4 capitalize">
              {cat.title}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropDown;
