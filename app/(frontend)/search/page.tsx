export const dynamic = "force-dynamic";

import Filters from "@/components/frontend/products/Filters";
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
  const q = (await searchParams).q;
  const { sort = "asc", min = 0, max = "", page = 1 } = await searchParams;
  const products = await getData(
    `/product?search=${q}&pageNum=${page}&sort=${sort}&min=${min}&max=${max}`
  );

  return (
    <section className="max-w-[1200px] mx-auto">
      <div className="w-full min-w-0 space-y-5">
        <div className="">
          <h1 className="line-clamp-2 break-all text-center  text-md md:text-4xl font-bold p-8">
            Résultats de recherche pour &quot;{q}&quot;
          </h1>
        </div>
        <div className="grid grid-cols-12">
          {/* product */}
          <div className={"col-span-12 md:col-span-8 p-8 "}>
            <SearchedProducts products={products} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
