"use client";

import SearchBar from "./SearchBar";
import { FaPhoneAlt } from "react-icons/fa";

import { useSession } from "next-auth/react";

import { useMobileMenuStore, useSearchBarStore } from "@/context/store";
import MainNav from "./MainNav";
const NavBar = () => {
  const { data: session, status } = useSession();
  const { setOpenBar, openBar } = useSearchBarStore();

  return (
    <>
      {/* informations navbar */}
      <div className="flex items-center justify-center gap-4 bg-black w-full text-center py-2 text-white text-sm">
        <FaPhoneAlt />
        <p>+212 68574114</p>
      </div>
      {/* main navbar */}
      {status === "loading" ? (
        <div className="text-center mt-4">Loading...</div>
      ) : (
        <MainNav />
      )}
      {/* Search bar  */}
      <SearchBar open={openBar} setOpen={setOpenBar} />
    </>
  );
};

export default NavBar;
