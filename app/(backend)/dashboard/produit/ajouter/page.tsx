export const dynamic = "force-dynamic";

import AjouterProduit from "@/components/backend/forms/AjouterProduit";
import { ProductData } from "@/components/backend/table/TableActions";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import { Category } from "@prisma/client";

export type CategorieData = [
  categorie: {
    id: string;
    title: string;
    products: [ProductData];
    slug: string;
  }
];
const page = async () => {
  const categoriesData = await getData("/categorie");
  //getting only id and name of the category
  const categories = categoriesData.map((category: Category) => {
    return {
      id: category.id,
      title: category.title,
    };
  });

  return (
    <section>
      <PageHeader name="Ajouter produit" />
      <div className="flex flex-col items-center justify-center mt-8 w-full">
        <AjouterProduit categorieData={categories} />
      </div>
    </section>
  );
};

export default page;
