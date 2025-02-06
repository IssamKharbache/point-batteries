import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  open: boolean | null;
  setOpen: (open: boolean) => void;
}

const SearchBar = ({ open, setOpen }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setOpen]);

  const handleSearch = () => {
    setOpen(false);
    router.push(`/search?q=${query}`);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
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
      className={`flex w-full left-1/2  md:max-w-sm top-0 mx-auto items-center justify-between rounded bg-gray-200 `}
    >
      <div className="p-1 border-r border-gray-300 ">
        <button
          onClick={() => setOpen(false)}
          className="flex items-center justify-center text-black px-2 py-2 w-8 h-8 hover:bg-red-500 duration-200 hover:text-white rounded-full bg-gray-200  "
        >
          <X />
        </button>
      </div>
      <Input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className="w-full placeholder:text-gray-400 outline-none  px-8 focus:bg-gray-300 h-11 hover:bg-gray-300 focus:border-none"
        placeholder="Recherche..."
      />
      <div className="p-1  border-l border-gray-300">
        <button
          onClick={handleSearch}
          className="flex items-center justify-center text-black px-2 py-2 w-8 h-8 hover:bg-black duration-200 hover:text-white rounded-full bg-gray-200 "
        >
          <Search />
        </button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
