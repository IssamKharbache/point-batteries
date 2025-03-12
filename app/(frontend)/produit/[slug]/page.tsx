export const dynamic = "force-dynamic";

import { getData } from "@/lib/getData";
import ProductDetails from "@/components/frontend/products/ProductDetails";
import SimilarProducts from "@/components/frontend/products/SimilarProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product = await getData(`/product/${slug}`);

  return (
    <section>
      <ProductDetails product={product} />
      <SimilarProducts marque={product.marque} />
    </section>
  );
};

export default page;
