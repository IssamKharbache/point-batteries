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
