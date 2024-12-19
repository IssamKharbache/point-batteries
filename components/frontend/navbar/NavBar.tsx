"use client";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import { FaPhoneAlt } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useState } from "react";
import { useSession } from "next-auth/react";
import UserAvatar from "./UserAvatar";
import Image from "next/image";
import { Menu, Search } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useSearchBarStore } from "@/context/store";
const NavBar = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { data: session, status } = useSession();

  const { setOpenBar, openBar } = useSearchBarStore();

  return (
    <>
      <div className="flex items-center justify-center gap-4 bg-black w-full text-center py-2 text-white text-sm">
        <FaPhoneAlt />
        <p>+212 68574114</p>
      </div>
      {status === "loading" ? (
        <div className="text-center mt-4">Loading...</div>
      ) : (
        <nav className="h-25 border-b  shadow-sm ">
          <div className="flex items-center justify-between py-3 max-w-7xl mx-auto px-4 md:px-8 gap-8  ">
            <div className="items-center gap-2 hidden lg:flex">
              <button className="flex items-center gap-4 hover:bg-gray-100 p-3 px-7  ">
                <HiMenuAlt2 size={20} />
                <span>Acheter Par Categorie</span>
              </button>
              <button
                onClick={() => setOpenBar(true)}
                className="py-2 px-4 bg-black rounded text-white hover:bg-black/80 duration-200"
              >
                Recherche
              </button>
            </div>
            <Link href="/">
              <Image
                src="/pbslogo.png"
                alt="Logo"
                width={500}
                height={500}
                className=" w-24 md:w-32"
                priority
              />
            </Link>

            <div className="flex items-center  md:gap-4 ">
              <button
                onClick={() => setOpenBar(true)}
                className="block md:hidden"
              >
                <Search size={20} />
              </button>
              {/* connect button */}
              <div>
                {status === "authenticated" ? (
                  <UserAvatar />
                ) : (
                  <Link
                    href="/connecter"
                    className="items-center gap-4  hover:bg-gray-100  rounded px-0 md:px-7 text-sm md:text-md hidden md:flex"
                  >
                    <FaRegUser size={30} />
                    <div>
                      <p className="text-md  text-gray-400">Se connecter</p>
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
                  <IoCartOutline className="size-[22px] md:size-[30px]" />
                  <p className="text-md hidden md:block">Mon panier</p>
                </Link>
              </div>
              <button onClick={() => setOpenMobileMenu(true)}>
                <Menu className="lg:hidden" />
              </button>
              <MobileMenu
                isOpen={openMobileMenu}
                setisOpen={setOpenMobileMenu}
              />
            </div>
          </div>
        </nav>
      )}

      <div>
        <SearchBar open={openBar} setOpen={setOpenBar} />
      </div>
    </>
  );
};

export default NavBar;
