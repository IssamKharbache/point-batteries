import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";

interface SearchBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchBar = ({ open, setOpen }: SearchBarProps) => {
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handler = (e: any) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
  }, []);
  return (
    <motion.div
      ref={searchBarRef}
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: open ? 1 : 0,
        y: open ? 0 : -100,
        transition: {
          duration: 0.1,
          type: "spring",
          damping: 100,
          stiffness: 500,
        },
      }}
      exit={{ opacity: 0, y: -100 }}
      className={`flex max-w-sm mx-auto items-center justify-between rounded bg-gray-200 mt-4`}
    >
      <div className="p-1 border-r border-gray-300">
        <button className="flex items-center justify-center text-black px-2 py-2 w-8 h-8 hover:bg-black duration-200 hover:text-white rounded-full bg-gray-200  ">
          <HiMenuAlt2 />
        </button>
      </div>
      <Input
        className="w-full placeholder:text-gray-400 outline-none  px-8 focus:bg-gray-300 h-11 hover:bg-gray-300 "
        placeholder="Recherche"
      />
      <div className="p-1  border-l border-gray-300">
        <button className="flex items-center justify-center text-black px-2 py-2 w-8 h-8 hover:bg-black duration-200 hover:text-white rounded-full bg-gray-200 ">
          <Search />
        </button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
