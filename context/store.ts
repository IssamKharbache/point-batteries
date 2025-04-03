import { ProductAchat } from "@/components/backend/achat/AchatProductsDetails";
import { Order, Vente } from "@prisma/client";
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
type CategoryProductPageType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};
export const useCategoryProductPageStore = create<CategoryProductPageType>(
  (set) => ({
    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
  })
);

type StepFormType = {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  productsToSubmit: {
    refProduct: string;
    quantity: string;
    discount: string;
    productVenteBenifit: number;
  }[];
  setProductsToSubmit: (
    products: {
      refProduct: string;
      quantity: string;
      discount: string;
      productVenteBenifit: number;
    }[]
  ) => void;
};

export const useStepFormStore = create<StepFormType>((set) => ({
  currentStep: 1,
  setCurrentStep: (currentStep: number) => set({ currentStep }),
  productsToSubmit: [],
  setProductsToSubmit: (products) => set({ productsToSubmit: products }),
}));
//
type OrderPaginationData = {
  page: number;
  setPage: (page: number) => void;
  trackOrder: boolean;
  setTrackOrder: (trackOrder: boolean) => void;
};

export const useOrderPaginationStore = create<OrderPaginationData>((set) => ({
  page: 1,
  setPage: (page) => set({ page }),
  trackOrder: false,
  setTrackOrder: (trackOrder) => set({ trackOrder }),
}));

type FavouritePagination = {
  page: number;
  setPage: (page: number) => void;
};

export const useFavouritePaginationStore = create<FavouritePagination>(
  (set) => ({
    page: 1,
    setPage: (page) => set({ page }),
  })
);

type ProductPaginationData = {
  page: number;
  setPage: (page: number) => void;
};

export const useProductPaginationData = create<ProductPaginationData>(
  (set) => ({
    page: 1,
    setPage: (page: number) => set({ page }),
  })
);
//backend store

type OrderDetailsDialog = {
  openDialog: boolean;
  selectedOrder: Order | null;
  setOpenDialog: (state: boolean) => void;
  setSelectedOrder: (order: Order | null) => void;
};

export const useOrderDetailsStore = create<OrderDetailsDialog>((set) => ({
  openDialog: false,
  selectedOrder: null,
  setOpenDialog: (state) => set({ openDialog: state }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));

type OrderBackendStore = {
  isRefresh: boolean;
  setIsRefresh: (isRefresh: boolean) => void;
};

export const useOrderBackendStore = create<OrderBackendStore>((set) => ({
  isRefresh: false,
  setIsRefresh: (isRefresh) => set({ isRefresh }),
}));

interface ProductAchatDialogStore {
  open: boolean;
  products: ProductAchat[];
  setOpen: (open: boolean) => void;
  setProducts: (products: ProductAchat[]) => void; // Ensure this is defined
  refAchat: string;
  setRefAchat: (refAchat: string) => void;
  date: Date | string;
  setDate: (date: Date) => void;
}

export const useProductAchatDialogStore = create<ProductAchatDialogStore>(
  (set) => ({
    open: false,
    products: [],
    setOpen: (open) => set({ open }),
    setProducts: (products) => set({ products }), // Ensure this is implemented
    refAchat: "",
    setRefAchat: (refAchat: string) => set({ refAchat }),
    date: "",
    setDate: (date: Date) => set({ date }),
  })
);

type FiltersStoreType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useFiltersStore = create<FiltersStoreType>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

type SourceRetourStoreType = {
  source: string;
  setSource: (source: string) => void;
  step: number;
  setStep: (step: number) => void;
};

export const useSourceRetourStore = create<SourceRetourStoreType>((set) => ({
  source: "",
  setSource: (source: string) => set({ source }),
  step: 1,
  setStep: (step: number) => set({ step }),
}));

interface BenificeStore {
  selectedMonth: string;
  selectedYear: string;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  isAllTime: boolean;
  setIsAllTime: (isAllTime: boolean) => void;
}

export const useBenificeStore = create<BenificeStore>((set) => ({
  selectedMonth: (new Date().getMonth() + 1).toString(),
  selectedYear: new Date().getFullYear().toString(),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  isAllTime: false,
  setIsAllTime: (isAllTime: boolean) => set({ isAllTime }),
}));
