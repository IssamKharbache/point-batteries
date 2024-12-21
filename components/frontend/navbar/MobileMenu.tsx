import { ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import { menuItems } from "@/data";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMonCompteStore } from "@/context/store";
import MonCompte from "./mobile-menu/MonCompte";

interface MobileMenuProps {
  isOpen: boolean | null;
  setisOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isOpen, setisOpen }: MobileMenuProps) => {
  const { data: session } = useSession();
  // Disable scroll on body when menu is open
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.overflowX = "hidden";
      } else {
        document.body.style.overflow = "auto";
        document.body.style.overflowX = "auto";
      }
    }
  }, [isOpen]);

  const closeMenu = () => {
    setisOpen(false);
  };
  const { openMonCompte, setOpenMonCompte } = useMonCompteStore();

  return (
    <>
      {/* Background overlay */}
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"
          onClick={() => setisOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      )}

      {/* Mobile Menu */}
      <motion.div
        className={`absolute bg-white  h-screen right-0 top-0 z-20 flex flex-col ${
          isOpen ? "w-72" : "w-0"
        }`}
        initial={{ x: "100%", width: 0 }}
        animate={{
          x: isOpen ? 0 : "100%",
          width: isOpen ? "20rem" : 0,
        }}
        exit={{ x: "100%", width: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          width: { duration: 0.3 },
          x: { duration: 0.3 },
        }}
        style={{ overflow: "hidden" }}
      >
        <div className="flex justify-between">
          <h1 className="py-4 px-7">Menu</h1>
          <button
            className="border-l py-4 px-4 hover:bg-gray-200 duration-200"
            onClick={() => setisOpen(false)}
          >
            <X />
          </button>
        </div>

        <hr />

        <div className="flex flex-col  flex-grow   w-full py-8 ">
          {menuItems.map((item, index) => (
            <Link
              onClick={closeMenu}
              className="hover:bg-gray-100 w-full px-4 py-4 capitalize"
              key={index}
              href={item.href}
            >
              {item.name}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => {
                setOpenMonCompte(true);
              }}
              className="flex items-center justify-between gap-2 hover:bg-gray-100 w-full px-4 py-4 capitalize"
            >
              Mon compte
              <ChevronRight />
            </button>
          ) : (
            <Link
              onClick={closeMenu}
              className="hover:bg-gray-100 w-full px-4 py-4 capitalize"
              href={"/connecter"}
            >
              Se connecter
            </Link>
          )}
        </div>
        <hr />
        <div className="flex flex-col items-center justify-center m-auto w-full h-16">
          <p className="text-sm text-gray-400">Nous appeler </p>
          <p className="mt-1 font-se text-md">05 60 00 00 00</p>
        </div>
      </motion.div>
      <MonCompte />
    </>
  );
};

export default MobileMenu;
