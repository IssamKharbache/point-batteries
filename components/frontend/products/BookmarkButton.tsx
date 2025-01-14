import { ProductData } from "@/components/backend/table/TableActions";
import { useBookmarkStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BookmarkButtonProps {
  product: ProductData;
  userId: string | undefined;
}

const BookmarkButton = ({ product, userId }: BookmarkButtonProps) => {
  const { isBookmarkedByUser, setIsBookmarkedByUser } = useBookmarkStore();

  const [isProductBookmarkedByUser, setIsProductBookmarkedByUser] =
    useState(false);

  useEffect(() => {
    // Set the initial state based on whether the product is bookmarked by the user
    if (product?.bookmarks?.some((bookmark) => bookmark.userId === userId)) {
      setIsProductBookmarkedByUser(true);
    }
  }, [product, userId]);
  const { toast } = useToast();

  const bookmarkProduct = async (productId: string) => {
    if (!userId) {
      toast({
        title: "Vous devez être connecté",
        variant: "error",
      });
    }
    setIsProductBookmarkedByUser(!isProductBookmarkedByUser);
    if (!isProductBookmarkedByUser) {
      toast({
        title: "Ajouté aux liste d'envies avec succès",
        variant: "success",
      });
    } else {
      toast({
        title: "Supprimé de la liste d'envies avec succès",
        variant: "success",
      });
    }
    if (isProductBookmarkedByUser) {
      try {
        const res = await axios.delete(`/api/bookmark/${productId}`, {
          data: JSON.stringify(userId),
        });
      } catch (error) {
        // Revert the state if the request fails
        setIsProductBookmarkedByUser(true);
        toast({
          title: "Erreur",
          description: "Échec de la suppression de la liste d'envies",
          variant: "destructive",
        });
      }
    } else {
      try {
        const res = await axios.post(`/api/bookmark/${productId}`, { userId });
      } catch (error) {
        console.log(error);
        // Revert the state if the request fails
        setIsProductBookmarkedByUser(false);
        toast({
          title: "Erreur",
          description: "Échec de l'ajout à la liste d'envies",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <button
      onClick={() => bookmarkProduct(product.id)}
      className="hover:bg-slate-100 p-2  border rounded group/heart "
    >
      <Heart
        className={` group-hover/heart:fill-red-500 group-hover/heart:text-red-500 duration-300 ${
          isProductBookmarkedByUser
            ? "fill-red-500 text-red-500 group-hover/heart:fill-gray-300 group-hover/heart:text-gray-300"
            : "fill-gray-300 text-gray-300"
        }`}
      />
    </button>
  );
};

export default BookmarkButton;
