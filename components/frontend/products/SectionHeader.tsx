import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  header?: string;
  isCategory?: boolean;
  categoryTitle?: string;
  catSlug?: string;
}
const SectionHeader = ({
  header,
  isCategory,
  categoryTitle,
  catSlug,
}: SectionHeaderProps) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-8  md:mb-0 md:flex-row  ">
        <h1 className="font-semibold text-sm md:text-xl mb-4 capitalize">
          {header ?? categoryTitle}
        </h1>
        {isCategory && (
          <Link
            href={`/categorie/${catSlug}`}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-900 duration-300 text-white px-5 mb-4 rounded-none py-1 md:py-2 capitalize font-semibold text-xs md:text-sm"
          >
            <span className="hidden md:block"> Voir tout</span>
            <SquareArrowOutUpRight className="size-4 md:size-5" />
          </Link>
        )}
      </div>
      <hr className="h-[4px] bg-gray-200 rounded-full outline-none border-none" />
    </div>
  );
};

export default SectionHeader;
