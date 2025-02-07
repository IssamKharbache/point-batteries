"use client";
import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createSlug, generateProductReference } from "@/lib/utils/index";
import { addProductAchatSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ProductDataProps {
  categorieData?: CategorieData;
}
const AddProductAchat = ({ categorieData }: ProductDataProps) => {
  //states
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  //session data
  const { data: session } = useSession();
  const userId = session?.user.id;
  //toast
  const { toast } = useToast();
  const form = useForm<z.infer<typeof addProductAchatSchema>>({
    resolver: zodResolver(addProductAchatSchema),
    defaultValues: {
      categoryId: "",
      designationProduit: "",
      marque: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof addProductAchatSchema>) => {
    setLoading(true);
    const refProduct = generateProductReference(data.marque);
    const productSlug = createSlug(data.designationProduit);
    try {
      const res = await axios.post("/api/product/add", {
        ...data,
        slug: productSlug,
        userId,
        refProduct,
        isAchat: true,
      });
      if (res.status === 201) {
        setLoading(false);
        setError("");
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.push("/dashboard/achat/produit/produit-achat");
      }
    } catch (__error) {
      setLoading(false);
      setError(
        "Une erreur s'est produite, réessayez plus tard ou contactez le support"
      );
      toast({
        title: "Une erreur s'est produite",
        description: "Réessayez plus tard ou contactez le support",
        variant: "error",
      });
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 w-[300px] sm:w-[500px] md:w-[750px] ">
      <h1 className="text-xl text-start text-gray-600 ">
        Ajouter produit achat
      </h1>

      <hr className="text-gray-400 mb-4" />
      {error && (
        <p className="bg-red-500 text-white text-center p-2 font-semibold rounded mt-4 mb-4">
          Une erreur est survenue
        </p>
      )}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            name="designationProduit"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Designation Produit</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Designation Produit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="marque"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Marque du produit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Categorie</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Categorie" />
                    </SelectTrigger>

                    <SelectContent>
                      {categorieData?.map((cat, idx) => (
                        <SelectItem key={idx} value={cat.id}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
            >
              Ajouter produit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddProductAchat;
