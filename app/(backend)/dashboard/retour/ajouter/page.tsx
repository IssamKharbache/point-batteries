export const dynamic = "force-dynamic";

import ReturnForm from "@/components/backend/retour/ReturnForm";
import { ProductData } from "@/components/backend/table/TableActions";
import { getData } from "@/lib/getData";

const page = async () => {
  const products: ProductData[] = await getData("/product/all");
  const filterProducts = products.filter((product) => !product.isAchatProduct);

  const ventes = await getData("/vente");

  return (
    <main>
      <h1 className="text-center font-bold text-3xl mt-5">
        Sélectionner la source du retour
      </h1>
      {/* Steps */}
      <ReturnForm products={filterProducts} ventes={ventes} />
    </main>
  );
};

export default page;
