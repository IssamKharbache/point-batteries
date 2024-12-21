"use client";

import { sideBarMenu } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PbsLogo from "@/public/pbslogo.svg";
import LogoutButton from "@/components/frontend/buttons/LogoutButton";
import { useSideBarStore } from "@/context/store";
import { motion } from "framer-motion";
const SideBarMenu = () => {
  const path = usePathname();
  const { openSideBar, setOpenSideBar } = useSideBarStore();
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: openSideBar ? 0 : "-100%" }}
      transition={{ duration: 0.3 }}
      exit={{ x: "-100%" }}
      className={`flex-col  bg-black space-y-8 w-64 h-screen text-white  left-0 top-0 overflow-y-scroll fixed z-50 hidden lg:flex`}
    >
      {/* logo */}
      <div className="flex items-center justify-center py-4 border-b border-gray-900">
        <PbsLogo alt="Logo" />
      </div>
      {/* side bar menus */}
      <div className="flex flex-col flex-grow space-y-12 ">
        {sideBarMenu.map((menu, index) => {
          const Icon = menu.icon;
          return (
            <Link
              className={`flex items-center gap-4 hover:bg-lightBlack w-full py-5 px-8 ${
                menu.href === path
                  ? "bg-lightBlack border-l-8  hover:bg-gray-950 duration-300"
                  : ""
              }`}
              key={index}
              href={menu.href}
            >
              <Icon />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>
      {/* log out button */}
      <LogoutButton />
    </motion.div>
  );
};

export default SideBarMenu;
