import PageHeader from "@/components/backend/UI/PageHeader";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section>
      <PageHeader href="produit/ajouter" name="Tous les produits" />
    </section>
  );
};

export default page;
