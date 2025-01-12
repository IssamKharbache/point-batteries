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

interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  qty: number;
  userId: string;
}

type CartStore = {
  cartItems: CartItem[];
  setCartItems: (newItem: CartItem) => void;
  deleteItem: (id: string) => void;
  incrementQty: (id: string) => void;
  decrementQty: (id: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems: (typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("cartItems") || "[]")) as CartItem[],
  setCartItems: (newItem) => {
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      let updatedCartItems;
      if (existingItemIndex !== -1) {
        updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, qty: item.qty + newItem.qty }
            : item
        );
      } else {
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
        item.id === id ? { ...item, qty: item.qty + 1 } : item
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
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }

      return { cartItems: updatedCartItems };
    });
  },
}));
