"use client";
import SideBar from "@/components/backend/sidebar/SideBar";
import NavBar from "@/components/backend/navbar/NavBar";
import { useSideBarStore } from "@/context/store";
import { Toaster } from "@/components/ui/toaster";

const BackendLayout = ({ children }: { children: React.ReactNode }) => {
  const { openSideBar } = useSideBarStore();
  return (
    <div className="flex">
      <Toaster />
      <div
        className={`mt-24 ml-4   py-4 px-8 w-full ${
          openSideBar ? "lg:ml-64" : "ml-4"
        }  `}
      >
        {children}
      </div>
      <SideBar />
      <div>
        <NavBar />
      </div>
    </div>
  );
};

export default BackendLayout;
