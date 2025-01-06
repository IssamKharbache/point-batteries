import Banner from "@/components/frontend/sliders/Banner";
import { getData } from "@/lib/getData";

const frontHomePage = async () => {
  const data = await getData("/banner");

  return (
    <div className="max-w-7xl mx-auto ">
      <div className="m-4 md:m-0">
        <Banner bannerData={data} />
      </div>
    </div>
  );
};

export default frontHomePage;
