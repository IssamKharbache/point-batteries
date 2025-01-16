import BestSellingProducts from "@/components/frontend/products/BestSellingProducts";
import SectionHeader from "@/components/frontend/products/SectionHeader";
import Banner from "@/components/frontend/sliders/Banner";
import { getData } from "@/lib/getData";
import { CategorieData } from "../(backend)/dashboard/produit/ajouter/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FetchBookmarks from "@/lib/utils/FetchBookmarks";

const frontHomePage = async () => {
  const data = await getData("/banner");
  const products = await getData(`/product`);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const categoryData: CategorieData = await getData("/categorie");
  const filteredData = categoryData?.filter((cat) => cat.products.length >= 4);

  return (
    <div className="max-w-[1200px] mx-auto ">
      {/* Fetch bookmarks specifically for this page */}
      {userId && <FetchBookmarks userId={userId} />}
      <div className="m-4 xl:m-0">
        <Banner bannerData={data} />
      </div>
      <div className="mb-12 m-8 2xl:m-0">
        <SectionHeader header="Meilleures Ventes" />
        <BestSellingProducts productsData={products} />
      </div>
      {filteredData.slice(0, 3).map((cat, idx) => (
        <div key={idx} className="mb-12 m-4 2xl:m-0">
          <SectionHeader isCategory={true} categoryTitle={cat.title} />
          <BestSellingProducts
            productsData={cat.products}
            categoryTitle={cat.title}
          />
        </div>
      ))}
    </div>
  );
};

export default frontHomePage;
