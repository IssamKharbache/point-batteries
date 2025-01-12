import { getData } from "@/lib/getData";
import ProductDetails from "@/components/frontend/products/ProductDetails";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product = await getData(`/product/${slug}`);

  return (
    <section className="flex flex-col gap-4 max-w-[85rem] mx-auto">
      <ProductDetails product={product} />
    </section>
  );
};

export default page;
