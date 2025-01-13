import { ProductData } from "@/components/backend/table/TableActions";
import { Heart } from "lucide-react";
import React from "react";

const BookmarkButton = ({ slug }: ProductData) => {
  console.log(slug);

  const bookmarkProduct = () => {};
  return (
    <button className="hover:bg-slate-100 p-2  border rounded group/heart duration-300">
      <Heart className="group-hover/heart:fill-red-500 group-hover/heart:text-red-500" />
    </button>
  );
};

export default BookmarkButton;
