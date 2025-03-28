import React from "react";
import { ReturnFormProps } from "./ReturnForm";
import { useSourceRetourStore } from "@/context/store";
import SelectProductForReturn from "./SelectProductForReturn";
import SelectFromVenteForReturn from "./SelectFromVenteForReturn";

const DetailsOfSource = ({ products, ventes }: ReturnFormProps) => {
  const { source } = useSourceRetourStore();

  return (
    <div>
      {source === "produit" ? (
        <SelectProductForReturn productsVente={products} />
      ) : (
        <SelectFromVenteForReturn ventes={ventes} />
      )}
    </div>
  );
};

export default DetailsOfSource;
