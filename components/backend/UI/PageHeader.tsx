import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PageHeaderProps {
  name: string;
  href: string;
}
const PageHeader = ({ name, href }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 max-w-6xl mx-auto bg-slate-100 rounded-sm">
      <h1 className="text-2xl font-semibold">{name}</h1>
      <Link
        href={href}
        className="flex items-center gap-2 py-2  text-white px-7 rounded font-semibold bg-black hover:bg-black/80 duration-200"
      >
        Ajouter
        <Plus size={20} />
      </Link>
    </div>
  );
};

export default PageHeader;
