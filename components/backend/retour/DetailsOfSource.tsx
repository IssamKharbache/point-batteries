import React from "react";
import { ReturnFormProps } from "./ReturnForm";
import { useSourceRetourStore } from "@/context/store";
import { Button } from "@/components/ui/button";
import SelectProductStep from "../vente/SelectProductStep";
import SelectProductForReturn from "./SelectProductForReturn";

const DetailsOfSource = ({ products, ventes }: ReturnFormProps) => {
  const { source, setStep } = useSourceRetourStore();

  return (
    <div>
      {source === "produit" ? (
        <SelectProductForReturn productsVente={products} />
      ) : (
        <div>
          <h1>Vente</h1>
          <select>
            {ventes.map((vente) => (
              <option key={vente.id} value={vente.id}>
                {vente.id}
              </option>
            ))}
          </select>
        </div>
      )}

      <Button onClick={() => setStep(1)}>Précédent</Button>
    </div>
  );
};

export default DetailsOfSource;
