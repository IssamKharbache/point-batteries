"use client";

import { useSideBarStore } from "@/context/store";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import UserAvatarBack from "./UserAvatarBack";
import { useEffect, useState } from "react";

const NavBar = () => {
  const [isNavBarScrolled, setIsNavBarScrolled] = useState(false);
  const path = usePathname();
  const { openSideBar, setOpenSideBar } = useSideBarStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window && window.scrollY >= 10) {
        setIsNavBarScrolled(true);
      } else {
        setIsNavBarScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`fixed py-4  ${
        openSideBar ? "left-0 lg:left-64" : "left-0"
      } border-b w-full px-4 h-20 flex items-center justify-between z-50 ${
        isNavBarScrolled ? "bg-slate-900 text-white" : ""
      } `}
    >
      <div className="flex items-center justify-between w-full ">
        <div className="flex items-center gap-4">
          <button
            className="hidden lg:flex"
            onClick={() => setOpenSideBar(!openSideBar)}
          >
            <MenuIcon size={25} className="mr-4" />
          </button>
        </div>

        <div
          className={`${
            openSideBar
              ? "pr-[2rem] lg:pr-[17rem] xl:pr-[21rem]"
              : "pr-[1rem] lg:pr-[1rem] xl:pr-[5rem]"
          }`}
        >
          <UserAvatarBack />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
