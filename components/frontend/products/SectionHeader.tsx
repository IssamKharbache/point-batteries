import { SquareArrowOutUpRight } from "lucide-react";

interface SectionHeaderProps {
  header?: string;
  isCategory?: boolean;
  categoryTitle?: string;
}
const SectionHeader = ({
  header,
  isCategory,
  categoryTitle,
}: SectionHeaderProps) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between  md:mb-0 md:flex-row  ">
        <h1 className="font-semibold text-xl mb-4 capitalize">
          {header ?? categoryTitle}
        </h1>
        {isCategory && (
          <button className="flex items-center gap-4 bg-gray-700 hover:bg-gray-900 duration-300 text-white px-5 mb-4 rounded py-2 capitalize font-semibold">
            Voir tout
            <SquareArrowOutUpRight size={20} />
          </button>
        )}
      </div>
      <hr className="h-[4px] bg-gray-200 rounded-full outline-none border-none" />
    </div>
  );
};

export default SectionHeader;
