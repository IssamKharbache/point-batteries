import SectionHeader from "@/components/frontend/products/SectionHeader";
import Banner from "@/components/frontend/sliders/Banner";
import { getData } from "@/lib/getData";
import { CategorieData } from "../(backend)/dashboard/produit/ajouter/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FetchBookmarks from "@/lib/utils/FetchBookmarks";
import ProductCard from "@/components/frontend/products/ProductCard";
import SpecialAndDemandingProducts from "@/components/frontend/products/SpecialAndDemandingProducts";
import Brands from "@/components/frontend/brands/Brands";
import { ProductData } from "@/components/backend/table/TableActions";

const frontHomePage = async () => {
  const data = await getData("/banner");
  const products = await getData(`/product`);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const categoryData: CategorieData = await getData("/categorie");
  const filteredData = categoryData?.filter((cat) => cat.products.length >= 1);

  const bestSelledProducts = products.filter(
    (product: ProductData) =>
      product.vente && product.vente >= 5 && product.isAchatProduct === false
  );

  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-10 md:px-5 2xl:p-0">
        {/* Fetch bookmarks specifically for the logged in user */}
        {userId && <FetchBookmarks userId={userId} />}
        {/* banner */}
        <div>
          <Banner bannerData={data} />
        </div>
        {/* best selling products */}
        <div>
          <SectionHeader header="Meilleures Ventes" />
          <ProductCard productsData={bestSelledProducts} />
        </div>
        {/* category products */}
        {filteredData.map((cat, idx) => (
          <div key={idx}>
            <SectionHeader
              isCategory={true}
              categoryTitle={cat.title}
              catSlug={cat.slug}
            />
            <ProductCard
              productsData={cat.products}
              categoryTitle={cat.title}
            />
          </div>
        ))}
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
