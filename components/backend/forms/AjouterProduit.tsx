"use client";
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
import { addProductSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import UploadImageButton from "../upload/UploadImageButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";
import { createSlug, generateProductReference } from "@/lib/utils/index";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { useRouter } from "next/navigation";

interface ProductDataProps {
  categorieData?: CategorieData;
}
const AjouterProduit = ({ categorieData }: ProductDataProps) => {
  //states
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  //
  const imageRef = useRef<HTMLInputElement>(null);
  //
  const router = useRouter();

  //react hook form
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      stock: "",
      capacite: "",
      courantDessai: "",
      marque: "",
      designationProduit: "",
      voltage: "",
      categoryId: "",
      garantie: "",
      filterByCar: "",
    },
  });
  //session data
  const { data: session } = useSession();
  const userId = session?.user.id;

  //toast
  const { toast } = useToast();

  const handleSubmit = async (data: z.infer<typeof addProductSchema>) => {
    const refProduct = generateProductReference(data.marque);

    if (!image) {
      toast({
        title: "Image de produit est obligatoire",
        variant: "destructive",
      });
      if (imageRef.current) {
        imageRef.current.textContent = "Image de produit est obligatoire";
      }
      return;
    }
    setLoading(true);
    const productSlug = createSlug(data.title);
    try {
      const res = await axios.post("/api/product/add", {
        ...data,
        slug: productSlug,
        userId,
        imageUrl: image,
        imageKey,
        refProduct,
      });
      if (res.statusText === "created") {
        setLoading(false);
        setError("");
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.push("/dashboard/produit");
      }
    } catch (_error) {
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
      <h1 className="text-xl text-start text-gray-600 ">Ajouter produit</h1>
      <hr className="text-gray-400 " />
      {error && (
        <div>
          <p className="bg-red-500 text-white rounded p-2 text-center text-md mt-6 mb-4">
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
                      placeholder="Titre du produit"
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
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Categorie</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full md:w-[290px] ">
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
            <FormField
              name="garantie"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Garantie</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full md:w-[290px]">
                        <SelectValue placeholder="Garantie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOGARANTIE">No garantie</SelectItem>
                        <SelectItem value="ONEYEAR">1 an garantie</SelectItem>
                        <SelectItem value="TWOYEARS">2 ans garantie</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Prix du produit"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="stock"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Combien de produit en stock ?"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
            <FormField
              name="capacite"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Capacité (Ah)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Capacité (Ah) du produit"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="voltage"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Voltage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Voltage (V) du produit"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
            <FormField
              name="courantDessai"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Courant d’essai de décharge</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Courant d’essai de décharge à froid EN (A)"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="designationProduit"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Designation du produit</FormLabel>
                    <FormControl>
                      <Input
                        className="mt-2 px-4"
                        placeholder="Designation du produit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
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
                        placeholder="Description du produit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="filterByCar"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Marque de voiture pour cette batterie</FormLabel>
                    <FormControl>
                      <Textarea
                        className="mt-2 px-4"
                        placeholder="Mercedes, audi, dacia..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div>
            <FormLabel className="mb-4   md:mb-2">Image du produit</FormLabel>

            <p ref={imageRef} className="text-red-500 text-sm"></p>

            <UploadImageButton
              image={image}
              setImage={setImage}
              imageKey={imageKey}
              setImageKey={setImageKey}
              isImageUploading={isImageUploading}
              setIsImageUploading={setIsImageUploading}
            />
          </div>
          {loading || isImageUploading ? (
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

export default AjouterProduit;
