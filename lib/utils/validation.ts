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
  price: z.string().min(1, "Le prix de vente doit être supérieur ou égal à 1"),
  achatPrice: z
    .string()
    .min(1, "Le prix d'achat doit être supérieur ou égal à 1"),
  stock: z.string().min(1, "Le stock doit être supérieur ou égal à 1"),
  capacite: z.union([
    z.number().min(0).nullable(),
    z
      .string()
      .transform((val) => parseFloat(val))
      .pipe(z.number().min(0))
      .nullable(),
  ]),
  courantDessai: z
    .string()
    .min(1, "Le courant d’essai doit être supérieur ou égal à 1"),
  marque: z.string().min(1, "Marque est obligatoire"),
  designationProduit: z
    .string()
    .min(1, "Designation du produit est obligatoire"),
  voltage: z.string().min(1, "Le voltage doit être supérieur ou égal à 1"),
  categoryId: z.string().min(1, "Categorie est obligatoire"),
  garantie: z.string().min(1, "Garantie est obligatoire"),
  filterByCar: z
    .string()
    .min(1, "Les marque de voiture adapter a cette batterie sont obligatoire"),
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

export const filterInputMarque = z.object({
  marque: z.string().min(1, "Entrer une marque"),
});

export const addAchatSchema = z.object({
  refProduct: z.string().min(1, "Reference produit est obligatoire"),
  quantity: z.string().min(1, "Quantité est obligatoire"),
  price: z.string().min(1, "Prix est obligatoire"),
});

export const addProductAchatSchema = z.object({
  designationProduit: z
    .string()
    .min(1, "Designation du produit est obligatoire"),
  marque: z.string().min(1, "Marque est obligatoire"),
  categoryId: z.string().min(1, "Categorie est obligatoire"),
});

export const addClientVenteSchema = z.object({
  clientPrenom: z.string().min(1, "Prenom est obligatoire"),
  clientNom: z.string().min(1, "Nom est obligatoire"),
  clientTel: z
    .string()
    .min(10, "Numero de telephone est invalide")
    .max(10, "Numero de telephone est invalide")
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres"),
  generateFacture: z.boolean().default(false), // Add this field
});

export const addClientRepSchema = z.object({
  nom: z.string().min(1, "Nom est obligatoire"),
  prenom: z.string().min(1, "Prenom est obligatoire"),
  tel: z
    .string() // it's generally better to handle phone numbers as strings because of formatting
    .min(10, "Numero de telephone est invalide")
    .max(10, "Numero de telephone est invalide") // Check if it’s at least 9 digits
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres"),
});

export const addCostSchema = z.object({
  natureDuFrais: z.string().min(1, "Nature des frais est obligatoire"),
  date: z
    .string()
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()); // Check if the date is valid
      },
      {
        message: "Date invalide",
      }
    )
    .refine((value) => {
      const date = new Date(value);
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      return date >= firstDayOfMonth && date <= lastDayOfMonth;
    }, "Vous ne pouvez ajouter des frais que pour le mois en cours"),
  montant: z.string().min(0, "Montant doit être positif"),
});
