"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createSlug } from "@/lib/utils/index";
import { addCategorieSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CategoryData {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface AjouterCategorieFormProps {
  categoryData?: CategoryData;
}

const AjouterCategorieForm = ({ categoryData }: AjouterCategorieFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof addCategorieSchema>>({
    resolver: zodResolver(addCategorieSchema),
    defaultValues: {
      title: categoryData?.title ?? "",
      description: categoryData?.description ?? "",
    },
  });

  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof addCategorieSchema>) => {
    try {
      setLoading(true);
      const slug = createSlug(data.title);
      if (categoryData) {
        if (
          data.title === categoryData.title &&
          data.description === categoryData.description
        ) {
          setLoading(false);
          return null;
        }

        const res = await axios.put(
          `/api/categorie/${categoryData.slug}`,
          data
        );
        if (res.statusText === "updated") {
          setLoading(false);
          toast({
            title: "L'opération est terminée avec succès",
            description: res.data.message,
            variant: "success",
            className: "toast-container",
          });
          router.push("/dashboard/categorie");
        } else {
          setLoading(false);
          setError(res.data.message);
        }
      } else {
        const res = await axios.post("/api/categorie/add", {
          ...data,
          slug,
        });
        if (res.statusText === "created") {
          setLoading(false);
          toast({
            title: "L'opération est terminée avec succès",
            description: res.data.message,
            variant: "success",
            className: "toast-container",
          });
          router.push("/dashboard/categorie");
        }
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 md:w-[750px] mt-8 ">
      <h1 className="text-xl text-start text-gray-600 ">Ajouter Categorie</h1>
      <hr className="text-gray-400 " />
      {error && (
        <div>
          <p className="bg-red-500 text-white rounded p-2 text-center text-md mt-6">
            {error}
          </p>
        </div>
      )}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Titre du categorie"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="mt-2 px-4"
                      placeholder="Description du categorie"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {loading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
            >
              {categoryData ? "Modifier" : " Ajouter"} categorie
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AjouterCategorieForm;
