// components/achat/AchatProductsDetails.tsx
import { Button } from "@/components/ui/button";
import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { useProductAchatDialogStore } from "@/context/store";

export interface ProductAchat {
  id: string;
  title: string;
  price: number;
  quantity: string;
  refProduct: string;
  designationProduit: string;
}

interface AchatProductsDetailsProps {
  productIds: string[];
  quantities: string[];
  refAchat: string;
  date: Date;
}

interface ApiResponse {
  data: ProductAchat[];
  message: string;
}

const AchatProductsDetails = ({
  productIds,
  quantities,
  refAchat,
  date,
}: AchatProductsDetailsProps) => {
  const [products, setProducts] = useState<ProductAchat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    setOpen,
    setProducts: setDialogProducts,
    setRefAchat,
    setDate,
  } = useProductAchatDialogStore(); // Use the correct function name

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<ApiResponse>("/api/productById", {
          params: { id: productIds },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        // Map quantities to products
        const productsWithQuantities = data.data.map((product, index) => ({
          ...product,
          quantity: quantities[index] || " 0",
        }));

        setProducts(productsWithQuantities);
        if (!data.data.length) {
          setError("Aucun produit trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement des produits");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productIds.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [productIds, quantities]);
  const handleOpenDialog = () => {
    setDialogProducts(products);
    setOpen(true);
    setRefAchat(refAchat);
    setDate(date);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="products-container">
      <Button variant="outline" size="sm" onClick={handleOpenDialog}>
        Voir plus
      </Button>
    </div>
  );
};

export default AchatProductsDetails;
