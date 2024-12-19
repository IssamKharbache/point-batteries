import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryData } from "@/data";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { HiMenuAlt2 } from "react-icons/hi";

const CategoryDropDown = () => {
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
        {categoryData.map((cat, index) => (
          <DropdownMenuItem
            key={index}
            className="cursor-pointer w-full py-4 px-4"
          >
            {cat}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropDown;
