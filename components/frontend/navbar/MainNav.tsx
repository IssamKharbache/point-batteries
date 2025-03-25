import UserAvatar from "./UserAvatar";
import Image from "next/image";
import { Menu, Search } from "lucide-react";
import MobileMenu from "./MobileMenu";

import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import {
  useCartStore,
  useMobileMenuStore,
  useSearchBarStore,
} from "@/context/store";
import { useSession } from "next-auth/react";
import LogoDark from "@/public/logo_dark.svg";

const MainNav = () => {
  const { status } = useSession();
  const { openMobileMenu, setOpenMobileMenu } = useMobileMenuStore();
  const { setOpenBar } = useSearchBarStore();
  const { cartItems } = useCartStore();

  return (
    <nav className="h-25 border-b  shadow-sm ">
      <div className="flex items-center justify-between py-3 max-w-[1500px] mx-auto px-4 md:px-8 gap-8  ">
        <Link href="/">
          <Image
            src="/logopbsdark.png"
            alt="Logo"
            width={300}
            height={48}
            priority
          />
        </Link>
        <div className="items-center gap-4 hidden lg:flex">
          <button
            onClick={() => setOpenBar(true)}
            className="py-2 px-4 bg-black rounded text-white hover:bg-black/80 duration-200"
          >
            Recherche
          </button>
        </div>

        <div className="flex items-center gap-2  md:gap-4 ">
          <button onClick={() => setOpenBar(true)} className="block md:hidden">
            <Search size={20} />
          </button>
          {/* connect button */}
          <div>
            {status === "authenticated" ? (
              <UserAvatar />
            ) : (
              <Link
                href="/connecter"
                className="items-center gap-4  hover:bg-gray-100  rounded px-0 md:px-7 md:text-md hidden md:flex"
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
              href="/mon-panier"
              className="flex items-center gap-4  hover:bg-gray-100 py-2 rounded px-4 md:px-7 relative"
            >
              <IoCartOutline className="size-[22px] md:size-[25px] " />
              <div className="text-center absolute inline-flex items-center justify-center w-4 h-4  text-[10px] md:text-[12px] font-bold text-white bg-red-500 rounded-full top-[1px] md:top-[1px] start-3 md:start-6">
                {cartItems.length}
              </div>

              <p className="text-md hidden xl:block">Mon panier</p>
            </Link>
          </div>
          <button onClick={() => setOpenMobileMenu(true)}>
            <Menu className="lg:hidden" />
          </button>
          <MobileMenu isOpen={openMobileMenu} setisOpen={setOpenMobileMenu} />
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
