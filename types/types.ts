export interface Bookmark {
  userId: string;
}

export interface ProductData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  price: number;
  stock: number | null;
  capacite: number | null;
  marque: string;
  categoryId: string;
  garantie: string;
  courantDessai: number | null;
  variationProduct: string | null;
  voltage: number | null;
  userId: string;
  vente: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  bookmarks: Bookmark[];
}
