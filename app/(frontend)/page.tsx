import BestSellingProducts from "@/components/frontend/products/BestSellingProducts";
import Banner from "@/components/frontend/sliders/Banner";
import { useBestProductSellsStore } from "@/context/store";
import { getData } from "@/lib/getData";

const frontHomePage = async () => {
  const data = await getData("/banner");
  const products = await getData(`/product`);

  return (
    <div className="max-w-[1500px] mx-auto ">
      <div className="m-4 md:m-0">
        <Banner bannerData={data} />
      </div>
      <div className="mb-12 m-4 md:m-0">
        <BestSellingProducts productsData={products} />
      </div>
    </div>
  );
};

export default frontHomePage;
