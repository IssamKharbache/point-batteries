"use client";

import SearchBar from "./SearchBar";
import { FaPhoneAlt } from "react-icons/fa";

import { useSession } from "next-auth/react";

import { useSearchBarStore } from "@/context/store";
import MainNav from "./MainNav";
const NavBar = () => {
  const { status } = useSession();
  const { setOpenBar, openBar } = useSearchBarStore();

  return (
    <>
      {/* informations navbar */}
      <div className="flex items-center justify-center gap-4 bg-black w-full text-center py-2 text-white text-sm">
        <FaPhoneAlt />
        <p>+212531510011</p>
      </div>
      {/* main navbar */}
      {status === "loading" ? (
        <div className="h-20 skeleton-navbar"></div>
      ) : (
        <MainNav />
      )}
      {/* Search bar  */}
      <div className="bg-gray-50">
        <SearchBar open={openBar} setOpen={setOpenBar} />
      </div>
    </>
  );
};

export default NavBar;
