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

export const addProductSchema = z.object({
  title: z.string().min(1, "Titre est obligatoire"),
  description: z.string().min(1, "Description est obligatoire"),
  price: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .min(0, "Le prix doit être supérieur ou égal à 0"),
  stock: z
    .number({ invalid_type_error: "Le stock doit être un nombre" })
    .min(0, "Le stock doit être supérieur ou égal à 0"),
  capacite: z
    .number({ invalid_type_error: "La capacite doit être un nombre" })
    .min(0, "La capacite doit être supérieur ou égal à 0"),
  courantDessai: z
    .number({ invalid_type_error: "Le courant d’essai doit être un nombre" })
    .min(0, "Le courant d’essai doit être supérieur ou égal à 0"),
  marque: z.string().min(1, "Marque est obligatoire"),
  variationProduct: z.string().min(1, "Variations du produit est obligatoire"),
  voltage: z
    .number({ invalid_type_error: "Le voltage doit être un nombre" })
    .min(0, "Le voltage doit être supérieur ou égal à 0"),
  categoryId: z.string().min(1, "Categorie est obligatoire"),
  garantie: z.string().min(1, "Grantie est obligatoire"),
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
