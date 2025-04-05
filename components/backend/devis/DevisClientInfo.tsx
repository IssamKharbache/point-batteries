import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useDevisStepFormStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const devisClientSchema = z.object({
  clientNom: z.string().min(1, "Nom est obligatoire"),
  clientPrenom: z.string().min(1, "Prénom est obligatoire"),
  clientTel: z
    .string()
    .min(10, "Numero de telephone est invalide")
    .max(10, "Numero de telephone est invalide")
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres"),
});

const DevisClientInfo = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const nomDuCaissier = session?.user.nom;

  const form = useForm<z.infer<typeof devisClientSchema>>({
    resolver: zodResolver(devisClientSchema),
    defaultValues: {
      clientNom: "",
      clientPrenom: "",
      clientTel: "",
    },
  });

  const { toast } = useToast();
  const { currentStep, setCurrentStep, productsToSubmit } =
    useDevisStepFormStore();

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (data: z.infer<typeof devisClientSchema>) => {
    if (!productsToSubmit || productsToSubmit.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un produit",
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/devis", {
        userId,
        products: productsToSubmit,
        clientNom: data.clientNom,
        clientPrenom: data.clientPrenom,
        clientTel: data.clientTel,
        nomDuCaissier,
      });

      toast({
        title: "Succès",
        description: response.data.message,
        variant: "success",
      });

      setCurrentStep(0);
      router.push(`/dashboard/devis`);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.response?.data?.error ||
          "Une erreur est survenue lors de la création du devis",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="space-y-2 bg-white p-10 rounded-md border-2 md:w-[750px] mt-8">
        <h1 className="text-xl text-start text-gray-600">Détails du client</h1>
        <hr className="text-gray-400" />

        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="clientNom"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Nom du client"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="clientPrenom"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Prénom du client"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="clientTel"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Téléphone du client"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" onClick={handlePrevious} className="mt-6">
                <ChevronLeft />
                <span>Précédent</span>
              </Button>

              <Button
                type="submit"
                className="mt-6 px-4 py-3 bg-black text-white text-md"
                disabled={loading}
              >
                {loading ? "Création en cours..." : "Créer le devis"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DevisClientInfo;
