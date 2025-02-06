import SectionHeader from "@/components/frontend/products/SectionHeader";
import Banner from "@/components/frontend/sliders/Banner";
import { getData } from "@/lib/getData";
import { CategorieData } from "../(backend)/dashboard/produit/ajouter/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FetchBookmarks from "@/lib/utils/FetchBookmarks";
import SpecialAndDemandingProducts from "@/components/frontend/products/SpecialAndDemandingProducts";
import Brands from "@/components/frontend/brands/Brands";
import DynamicProductList from "@/components/frontend/products/DynamicProductList";
import DynamicCategoryProducts from "@/components/frontend/products/DynamicCategoryProducts";

const frontHomePage = async () => {
  const banner = await getData("/banner");
  const products = await getData(`/product`);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const categoryData: CategorieData = await getData("/categorie");

  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-10 md:px-5 2xl:p-0">
        {/* Fetch bookmarks specifically for the logged in user */}
        {userId && <FetchBookmarks userId={userId} />}
        {/* banner */}
        <div>
          <Banner bannerData={banner} />
        </div>
        {/* best selling products */}
        <div>
          <SectionHeader header="Meilleures Ventes" />
          <DynamicProductList initialProducts={products} />
        </div>
        {/* category products */}
        <DynamicCategoryProducts initialCategorieData={categoryData} />
        {/* SpecialAndDemandingProducts */}
        <div>
          <SpecialAndDemandingProducts product={products} />
        </div>
      </div>
      {/* brands */}
      <Brands />
    </div>
  );
};

export default frontHomePage;
