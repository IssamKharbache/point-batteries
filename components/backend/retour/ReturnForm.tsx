"use client";
import { useSourceRetourStore } from "@/context/store";
import React from "react";
import SourceSelection from "./SourceSelection";
import DetailsOfSource from "./DetailsOfSource";
import { ProductData } from "../table/TableActions";
import { Vente } from "@prisma/client";
export interface ReturnFormProps {
  products: ProductData[];
  ventes: Vente[];
}
const ReturnForm = ({ products, ventes }: ReturnFormProps) => {
  const { step } = useSourceRetourStore();
  return (
    <>
      {step === 1 && <SourceSelection />}
      {step === 2 && <DetailsOfSource products={products} ventes={ventes} />}
    </>
  );
};

export default ReturnForm;
