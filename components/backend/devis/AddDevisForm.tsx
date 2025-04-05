"use client";

import React, { useEffect } from "react";
import { ProductData } from "../table/TableActions";

import { useDevisStepFormStore } from "@/context/store";
import { getData } from "@/lib/getData";
import SelectProductsForDevis from "./SelectProductsForDevis";
import DevisClientInfo from "./DevisClientInfo";

interface AddVenteProps {
  productsVente: ProductData[];
}

const AddDevisForm = ({ productsVente }: AddVenteProps) => {
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
  const { currentStep } = useDevisStepFormStore();
  if (currentStep === 1) {
    return <SelectProductsForDevis productsVente={data} />;
  } else if (currentStep === 2) {
    return <DevisClientInfo />;
  }
};

export default AddDevisForm;
