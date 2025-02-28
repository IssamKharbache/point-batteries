export const dynamic = "force-dynamic";

import BreadCrumpComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";
import SimilarProcuts from "@/components/frontend/products/SimilarProcuts";
import { getData } from "@/lib/getData";

interface Props {
  params: { marque: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ params, searchParams }: Props) => {
  const marque = await params.marque;
  const { sort = "asc", min = 0, max = "", page = 1 } = await searchParams;

  // Fetch products by marque
  const products = await getData(
    `/product/marque?marque=${marque}&pageNum=${page}&sort=${sort}&min=${min}&max=${max}`
  );

  return (
    <section className="max-w-[1200px] mx-auto">
      <BreadCrumpComponent links={[{ name: marque }]} />
      <h1 className="text-3xl font-bold text-center mb-4 mt-8 capitalize">
        {marque}
      </h1>

      <SimilarProcuts />
    </section>
  );
};

export default Page;
