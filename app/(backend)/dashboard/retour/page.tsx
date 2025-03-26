import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";

const page = async () => {
  return (
    <section>
      <PageHeader href="retour/ajouter" name="Tous les Retours" />
      {/* <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={filteredProducts} name="Produits" />
      </div> */}
    </section>
  );
};

export default page;
