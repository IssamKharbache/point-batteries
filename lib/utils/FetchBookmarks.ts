"use client";
import { useEffect } from "react";
import { useBookmarkStore } from "@/context/store";
import axios from "axios";

const FetchBookmarks = ({ userId }: { userId: string | undefined }) => {
  const { setBookmark } = useBookmarkStore();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`/api/bookmark/isBookmarked`, {
          params: { userId },
        });

        const bookmarkedProductIds = response.data.bookmarkedProductIds;
        bookmarkedProductIds.forEach((id: string) => {
          setBookmark(id, true);
        });
      } catch (error) {
        console.error("Failed to fetch bookmarked products:", error);
      }
    };

    fetchBookmarks();
  }, [userId, setBookmark]);

  return null;
};

export default FetchBookmarks;
