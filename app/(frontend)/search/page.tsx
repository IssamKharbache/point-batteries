export const dynamic = "force-dynamic";
import BreadCrumpComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";
import FiltersCopy from "@/components/frontend/products/FiltersCopy";
import SearchedProducts from "@/components/frontend/products/SearchedProducts";
import { getData } from "@/lib/getData";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
// // Generate metadata dynamically based on searchParams
export const generateMetadata = async ({ searchParams }: Props) => {
  const q = (await searchParams).q;
  return {
    title: `Résultats de recherche pour "${q}"`,
    description: `Search results for "${q}"`,
  };
};

const page = async ({ searchParams }: Props) => {
  const q = ((await searchParams).q as string) || "";
  const marque = ((await searchParams).marque as string) || "";

  const { page = 1 } = await searchParams;
  const products = await getData(
    `/product?search=${q}&pageNum=${page}&marque=${marque}`
  );

  return (
    <section className="max-w-[1200px] mx-auto">
      <BreadCrumpComponent links={[{ name: q }]} />
      <div className="line-clamp-2 break-all text-center  text-md md:text-2xl font-bold p-8 ">
        <h1 className="font-medium">Résultats de recherche pour</h1>
        <span>&quot;{q}&quot;</span>
      </div>
      <div className="grid grid-cols-12 gap-8">
        {/*  filters */}
        <div className="col-span-12 md:col-span-4 mt-8">
          <FiltersCopy marque={marque} />
        </div>
        {/* product */}
        <div className={"col-span-12 md:col-span-8 p-8 "}>
          <SearchedProducts products={products} pageSize={10} />
        </div>
      </div>
    </section>
  );
};

export default page;
