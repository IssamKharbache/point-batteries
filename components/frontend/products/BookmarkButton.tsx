import { ProductData } from "@/components/backend/table/TableActions";
import { useBookmarkStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Heart } from "lucide-react";
import React, { useEffect } from "react";

interface BookmarkButtonProps {
  product: ProductData;
  userId: string | undefined;
}

const BookmarkButton = ({ product, userId }: BookmarkButtonProps) => {
  const { bookmarks, setBookmark } = useBookmarkStore();
  const { toast } = useToast();

  // Get the bookmark state for this product
  const isBookmarked = bookmarks[product.id] || false;

  useEffect(() => {
    // Fetch the bookmark state from the backend when the component mounts
    const fetchBookmarkState = async () => {
      try {
        const response = await axios.get(`/api/bookmark/${product.id}`, {
          data: { userId },
        });
        console.log(response);

        setBookmark(product.id, response.data.isBookmarked);
      } catch (error) {
        console.error("Failed to fetch bookmark state", error);
      }
    };

    if (userId) {
      fetchBookmarkState();
    }
  }, [product.id, userId, setBookmark]);

  const handleBookmark = async () => {
    if (!userId) {
      toast({
        title: "Vous devez être connecté",
        variant: "error",
      });
      return;
    }

    // Optimistic update
    const previousState = isBookmarked;
    setBookmark(product.id, !isBookmarked);

    try {
      if (isBookmarked) {
        // Unbookmark the product
        await axios.delete(`/api/bookmark/${product.id}`, {
          data: { userId },
        });
        toast({
          title: "Supprimé",
          description: "Supprimé de la liste d'envies avec succès",
          variant: "success",
        });
      } else {
        // Bookmark the product
        await axios.post(`/api/bookmark/${product.id}`, { userId });
        toast({
          title: "Ajouté",
          description: "Ajouté à la liste d'envies avec succès",
          variant: "success",
        });
      }
    } catch (error) {
      // Revert state if the API call fails
      setBookmark(product.id, previousState);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite, veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleBookmark}
      className="hover:bg-slate-100 p-2 border rounded group/heart"
    >
      {isBookmarked ? "book" : "unbook"}

      <Heart
        className={`group-hover/heart:fill-red-500 group-hover/heart:text-red-500 duration-300 ${
          isBookmarked
            ? "fill-red-500 text-red-500 group-hover/heart:!fill-gray-300 group-hover/heart:!text-gray-300"
            : "fill-gray-300 text-gray-300"
        }`}
      />
    </button>
  );
};

export default BookmarkButton;
