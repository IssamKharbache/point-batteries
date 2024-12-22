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
  openSideBar: false,
  setOpenSideBar: (openSideBar: boolean) => set({ openSideBar }),
}));

//loading operation context

type LoadingStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));
