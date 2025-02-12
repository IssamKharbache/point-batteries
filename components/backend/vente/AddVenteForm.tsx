"use client";

import React from "react";
import { ProductData } from "../table/TableActions";

import { useStepFormStore } from "@/context/store";
import SelectProductStep from "./SelectProductStep";
import ClientInfo from "./ClientInfo";

interface AddVenteProps {
  productsVente: ProductData[];
}

const AddVenteForm = ({ productsVente }: AddVenteProps) => {
  const { currentStep } = useStepFormStore();
  if (currentStep === 1) {
    return <SelectProductStep productsVente={productsVente} />;
  } else if (currentStep === 2) {
    return <ClientInfo />;
  }
};

export default AddVenteForm;
