import { ProductData } from "@/components/backend/table/TableActions";
import { useBookmarkStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface BookmarkButtonProps {
  product: ProductData;
  userId: string | undefined;
}

const BookmarkButton = ({ product, userId }: BookmarkButtonProps) => {
  const { bookmarks, setBookmark } = useBookmarkStore();
  const { toast } = useToast();

  const router = useRouter();

  // Determine if the product is bookmarked
  const isBookmarked = bookmarks[product.id] || false;

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
        const res = await axios.delete(`/api/bookmark/${product.id}`, {
          data: { userId },
        });
        toast({
          title: "Supprimé",
          description: "Supprimé de la liste d'envies avec succès",
          variant: "success",
        });
        if (res.statusText === "removed") {
          router.refresh();
        }
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
