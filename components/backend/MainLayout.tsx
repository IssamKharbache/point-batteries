"use client";
import SideBar from "@/components/backend/sidebar/SideBar";
import NavBar from "@/components/backend/navbar/NavBar";
import { useSideBarStore } from "@/context/store";

const BackendLayout = ({ children }: { children: React.ReactNode }) => {
  const { openSideBar } = useSideBarStore();
  return (
    <div className="flex ">
      <div
        className={`mt-24 ml-4 ${
          openSideBar ? "ml-64" : "ml-4"
        } py-4 px-8 w-full `}
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
