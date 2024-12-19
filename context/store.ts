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
