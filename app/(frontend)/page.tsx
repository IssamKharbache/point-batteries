import BestSellingProducts from "@/components/frontend/products/BestSellingProducts";
import SectionHeader from "@/components/frontend/products/SectionHeader";
import Banner from "@/components/frontend/sliders/Banner";
import { getData } from "@/lib/getData";
import { Category } from "@prisma/client";

const frontHomePage = async () => {
  const data = await getData("/banner");
  const products = await getData(`/product`);
  const categoryData = await getData("/categorie");
  console.log(categoryData);

  return (
    <div className="max-w-[1500px] mx-auto ">
      <div className="m-4 md:m-0">
        <Banner bannerData={data} />
      </div>
      <div className="mb-12 m-4 2xl:m-0">
        <SectionHeader header="Meilleures Ventes" />
        <BestSellingProducts productsData={products} />
      </div>

      <div>
        {categoryData.slice(0, 2).map((cat: any, idx: number) => (
          <div className="mb-12 m-4 2xl:m-0">
            <SectionHeader header={cat.title} />
            <BestSellingProducts productsData={cat.products} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default frontHomePage;
