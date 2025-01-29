import * as z from "zod";
export const signupSchema = z.object({
  nom: z.string().min(1, "Nom est obligatoire"),
  prenom: z.string().min(1, "Prenom est obligatoire"),
  email: z
    .string()
    .min(1, "Adresse email est obligatoire")
    .email("Address email invalide"),
  password: z.string().min(1, "Mot de passe est obligatoire"),
});
export type SignUpSchemaType = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Adresse email est obligatoire")
    .email("Address email invalide"),
  password: z.string().min(1, "Mot de passe est obligatoire"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const addAdminSchema = z.object({
  nom: z.string().min(1, "Nom est obligatoire"),
  prenom: z.string().min(1, "Prenom est obligatoire"),
  tel: z
    .string() // it's generally better to handle phone numbers as strings because of formatting
    .min(10, "Numero de telephone est invalide")
    .max(10, "Numero de telephone est invalide") // Check if it’s at least 9 digits
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres"),
  email: z
    .string()
    .min(1, "Adresse email est obligatoire")
    .email("Address email invalide"),
  password: z.string().min(1, "Mot de passe est obligatoire"),
});

export const addCategorieSchema = z.object({
  title: z.string().min(1, "Titre est obligatoire"),
  description: z
    .string()
    .min(1, "Description est obligatoire")
    .min(5, "Description est trop courte"),
});

export const addBannerSchema = z.object({
  title: z.string().min(1, "Titre est obligatoire"),
  link: z.string().min(1, "Lien est obligatoire"),
});

export const addProductSchema = z.object({
  title: z.string().min(1, "Titre est obligatoire"),
  description: z.string().min(1, "Description est obligatoire"),
  price: z.string().min(1, "Le prix doit être supérieur ou égal à 1"),
  stock: z.string().min(1, "Le stock doit être supérieur ou égal à 1"),
  capacite: z.string().min(1, "La capacite doit être supérieur ou égal à 1"),
  courantDessai: z
    .string()
    .min(1, "Le courant d’essai doit être supérieur ou égal à 1"),
  marque: z.string().min(1, "Marque est obligatoire"),
  designationProduit: z
    .string()
    .min(1, "Variations du produit est obligatoire"),
  voltage: z.string().min(1, "Le voltage doit être supérieur ou égal à 1"),
  categoryId: z.string().min(1, "Categorie est obligatoire"),
  garantie: z.string().min(1, "Grantie est obligatoire"),
});

export const orderDetailsSchema = z.object({
  prenom: z.string().min(1, "Prenom est obligatoire"),
  nom: z.string().min(1, "Nom est obligatoire"),
  telephone: z
    .string()
    .min(10, "Numero de telephone est invalide")
    .max(10, "Numero de telephone est invalide")
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres"),
  //shipping details
  adresse: z.string().min(1, "Adresse est obligatoire"),
  ville: z.string().min(1, "Ville est obligatoire"),
  codePostal: z.string().min(1, "Code postale est obligatoire"),
  email: z
    .string()
    .min(1, "Adresse email est obligatoire")
    .email("Address email invalide"),
  notesCommande: z.optional(z.string()),
});

export const filterPriceSchema = z.object({
  min: z.string().min(0, "Le prix doit être supérieur ou égal à 0"),
  max: z.string().min(0, "Le prix doit être supérieur ou égal à 0"),
});

export const addAchatSchema = z.object({
  refProduct: z.string().min(1, "Reference produit est obligatoire"),
  quantity: z.string().min(1, "Quantité est obligatoire"),
  price: z.string().min(1, "Prix est obligatoire"),
});
