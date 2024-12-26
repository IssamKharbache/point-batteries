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
  description: z
    .string()
    .min(1, "Description est obligatoire")
    .min(10, "Description est trop courte"),
  price: z.number().min(1, "Le prix doit être supérieur ou égal à 1"),
  stock: z.number(),
  marque: z.string().min(1, "Marque est obligatoire"),
  capacite: z.string().min(1, "Capacité est obligatoire"),
  variationsProduit: z.string().min(1, "Variations du produit est obligatoire"),
  courantDessai: z
    .number()
    .min(1, "Courant d’essai de décharge est obligatoire"),
  voltage: z.number(),
});

export const addCategorieSchema = z.object({
  title: z.string().min(1, "Titre est obligatoire"),
  description: z
    .string()
    .min(1, "Description est obligatoire")
    .min(5, "Description est trop courte"),
});
