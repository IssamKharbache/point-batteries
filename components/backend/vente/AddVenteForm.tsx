"use client";

import React, { useEffect } from "react";
import { ProductData } from "../table/TableActions";

import { useStepFormStore } from "@/context/store";
import SelectProductStep from "./SelectProductStep";
import ClientInfo from "./ClientInfo";
import { getData } from "@/lib/getData";

interface AddVenteProps {
  productsVente: ProductData[];
}

const AddVenteForm = ({ productsVente }: AddVenteProps) => {
  const [data, setData] = React.useState<ProductData[]>(productsVente);
  useEffect(() => {
    const fetchData = async () => {
      const products = await getData("/product/all");
      setData(
        products.filter((product: ProductData) => !product.isAchatProduct)
      );
    };
    fetchData();
  }, []);
  const { currentStep } = useStepFormStore();
  if (currentStep === 1) {
    return <SelectProductStep productsVente={data} />;
  } else if (currentStep === 2) {
    return <ClientInfo />;
  }
};

export default AddVenteForm;
