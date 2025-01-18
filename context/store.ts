import { title } from "process";
import { create } from "zustand";

//search bar store context
type SearchBarStore = {
  openBar: boolean | null;
  setOpenBar: (openBar: boolean) => void;
};
export const useSearchBarStore = create<SearchBarStore>((set) => ({
  openBar: false,
  setOpenBar: (openBar: boolean) => set({ openBar }),
}));

//mon compte store context
type MonCompteStore = {
  openMonCompte: boolean | null;
  setOpenMonCompte: (openMonCompte: boolean) => void;
};
export const useMonCompteStore = create<MonCompteStore>((set) => ({
  openMonCompte: false,
  setOpenMonCompte: (openMonCompte: boolean) => set({ openMonCompte }),
}));
//mobile menu store context
type MobileMenuStore = {
  openMobileMenu: boolean | null;
  setOpenMobileMenu: (openMobileMenu: boolean) => void;
};
export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
  openMobileMenu: false,
  setOpenMobileMenu: (openMobileMenu: boolean) => set({ openMobileMenu }),
}));

//sidebar store context
type SideBarStore = {
  openSideBar: boolean | null;
  setOpenSideBar: (openSideBar: boolean) => void;
};
export const useSideBarStore = create<SideBarStore>((set) => ({
  openSideBar: true,
  setOpenSideBar: (openSideBar: boolean) => set({ openSideBar }),
}));

//loading delete operation context

type LoadingStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));

export interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
  userId: string;
  stock: number;
}

type CartStore = {
  cartItems: CartItem[];
  total: number;
  setTotal: (total: number) => void;
  setCartItems: (newItem: CartItem) => void;
  addItem: (newItem: CartItem) => void;
  resetCart: () => void;
  deleteItem: (id: string) => void;
  incrementQty: (id: string) => void;
  decrementQty: (id: string) => void;
  livraison: number;
  setLivraison: (livraison: number) => void;
  submitForm: boolean;
  setSubmitForm: (submitForm: boolean) => void;
  loadingOrder: boolean;
  setLoadingOrder: (loadingOrder: boolean) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems:
    typeof window !== "undefined"
      ? (() => {
          try {
            const storedItems = JSON.parse(
              localStorage.getItem("cartItems") || "[]"
            );
            return Array.isArray(storedItems) ? storedItems : [];
          } catch {
            return [];
          }
        })()
      : [],
  setCartItems: (newItems) => {
    set((state) => {
      // Ensure newItems is always an array of CartItem
      const updatedCartItems = Array.isArray(newItems) ? newItems : [newItems];

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }

      return { cartItems: updatedCartItems };
    });
  },
  addItem: (newItem) => {
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      let updatedCartItems;
      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item to the cart
        updatedCartItems = [...state.cartItems, newItem];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }

      return { cartItems: updatedCartItems };
    });
  },
  deleteItem: (id) => {
    set((state) => {
      const updatedCartItems = state.cartItems.filter((item) => item.id !== id);

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }

      return { cartItems: updatedCartItems };
    });
  },
  incrementQty: (id) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }

      return { cartItems: updatedCartItems };
    });
  },
  decrementQty: (id) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }

      return { cartItems: updatedCartItems };
    });
  },
  resetCart: () => {
    set((state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartItems");
      }
      return { cartItems: [] };
    });
  },
  total: 0,
  setTotal: (total: number) => set({ total }),
  livraison:
    typeof window !== "undefined"
      ? Number(localStorage.getItem("livraison") || 0)
      : 0,
  setLivraison: (newLivraison) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("livraison", JSON.stringify(newLivraison));
    }
    set({ livraison: newLivraison });
  },
  submitForm: false,
  setSubmitForm: (submitForm: boolean) => set({ submitForm }),
  loadingOrder: false,
  setLoadingOrder: (loadingOrder: boolean) => set({ loadingOrder }),
}));

type BookmarkStore = {
  bookmarks: { [productId: string]: boolean }; // Object to store bookmark states by product ID
  setBookmark: (productId: string, isBookmarked: boolean) => void; // Function to update a bookmark
};

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: {}, // Initial state: no bookmarks
  setBookmark: (productId, isBookmarked) =>
    set((state) => ({
      bookmarks: {
        ...state.bookmarks,
        [productId]: isBookmarked, // Update the bookmark state for the specific product
      },
    })),
}));
