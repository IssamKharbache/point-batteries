"use client";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import { FaPhoneAlt } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
const NavBar = () => {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <div className="flex items-center justify-center gap-4 bg-black w-full text-center py-2 text-white text-sm">
        <FaPhoneAlt />
        <p>+212 68574114</p>
      </div>
      <nav className="h-25 border-b  shadow-sm ">
        <div className="flex items-center justify-between py-3 max-w-7xl mx-auto  px-8 gap-8 ">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-4 hover:bg-gray-100 p-3 px-7">
              <HiMenuAlt2 size={20} />
              <span>Acheter Par Categorie</span>
            </button>
            <button
              onClick={() => setOpenSearchBar((prev) => !prev)}
              className="py-2 px-4 bg-black rounded text-white hover:bg-black/80 duration-200"
            >
              Recherche
            </button>
          </div>
          <p>logo</p>

          <div className="flex items-center ">
            {/* connect button */}

            <div>
              {status === "authenticated" ? (
                <button onClick={() => signOut()}>Logout</button>
              ) : (
                <Link
                  href="/connecter"
                  className="flex items-center gap-4  hover:bg-gray-100 p-2 rounded px-7"
                >
                  <FaRegUser size={30} />
                  <div>
                    <p className="text-sm text-gray-400">Se connecter</p>
                    <p className="text-md">Mon compte</p>
                  </div>
                </Link>
              )}
            </div>
            {/* cart */}
            <div>
              <Link
                href="/pannier"
                className="flex items-center gap-4  hover:bg-gray-100 p-2 rounded px-7"
              >
                <IoCartOutline size={30} />
                <p className="text-md">Mon panier</p>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <SearchBar open={openSearchBar} setOpen={setOpenSearchBar} />
      </div>
    </>
  );
};

export default NavBar;
