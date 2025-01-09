interface SectionHeaderProps {
  header: string;
}
const SectionHeader = ({ header }: SectionHeaderProps) => {
  return (
    <div className="m-4">
      <div className="flex flex-col items-center justify-between  md:mb-0 md:flex-row  ">
        <h1 className="font-semibold text-2xl mb-4 capitalize">{header}</h1>
      </div>
      <hr className="h-[4px] bg-gray-200 rounded-full outline-none border-none" />
    </div>
  );
};

export default SectionHeader;
