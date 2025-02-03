import PageHeader from "@/components/backend/UI/PageHeader";

import { ProductData } from "@/components/backend/table/TableActions";
import { getData } from "@/lib/getData";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const page = async () => {
  const data: ProductData[] = await getData("/product");
  //getting the products that have isAchat true
  const filteredProduct = data.filter(
    (product) => product.isAchatProduct === true
  );

  return (
    <section>
      <PageHeader
        name="Les produit achat"
        href="/dashboard/achat/produit/ajouter"
      />
      <div className="container mx-auto py-10 ">
        <DataTable
          data={filteredProduct}
          columns={columns}
          name="Produit achat"
        />
      </div>
    </section>
  );
};

export default page;
