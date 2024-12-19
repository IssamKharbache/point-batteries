import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { motion } from "framer-motion";
import { menuItems, monCompteItems } from "@/data";
import Link from "next/link";

import { useMonCompteStore } from "@/context/store";
import { useSession } from "next-auth/react";

const MonCompte = () => {
  const { openMonCompte, setOpenMonCompte } = useMonCompteStore();
  const { data: session } = useSession();

  return (
    <motion.div
      className={`absolute bg-white  h-screen right-0 top-0 z-40 flex flex-col ${
        openMonCompte ? "w-72" : "w-0"
      }`}
      initial={{ x: "100%", width: 0 }}
      animate={{
        x: openMonCompte ? 0 : "100%",
        width: openMonCompte ? "20rem" : 0,
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
        <button
          className="border-r py-4 px-4 hover:bg-gray-200 duration-200"
          onClick={() => setOpenMonCompte(false)}
        >
          <ChevronLeft />
        </button>

        <h1 className="py-4 px-7">Mon compte</h1>
        <button
          className="border-l py-4 px-4 hover:bg-gray-200 duration-200"
          onClick={() => setOpenMonCompte(false)}
        >
          <X />
        </button>
      </div>

      <hr />

      <div className="flex flex-col  flex-grow   w-full py-8 ">
        {monCompteItems.map((item, index) => (
          <Link
            className="hover:bg-gray-100 w-full px-4 py-4 capitalize"
            key={index}
            href={item.href}
          >
            {item.name}
          </Link>
        ))}
        {session ? (
          <Link
            className="flex items-center justify-between gap-2 hover:bg-gray-100 w-full px-4 py-4 capitalize"
            href={"/mon-compte"}
          >
            Mon profile
          </Link>
        ) : (
          <Link
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
  );
};

export default MonCompte;
