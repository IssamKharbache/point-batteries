"use client";
import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";
import { ProductData } from "@/app/(backend)/dashboard/produit/modifier/[slug]/page";
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
import { Textarea } from "@/components/ui/textarea";
import { addProductSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import UploadImageButton from "../upload/UploadImageButton";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";

const UpdateProductForm = ({ productData, categoryData }: ProductData) => {
  const [image, setImage] = useState(productData.imageUrl);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageKey, setImageKey] = useState("");
  const [loading, setLoading] = useState(false);

  //react hook form
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: productData,
  });

  const router = useRouter();

  const { toast } = useToast();
  const handleSubmit = async (data: z.infer<typeof addProductSchema>) => {
    setLoading(true);
    const allData = {
      ...data,
      imageUrl: image,
      imageKey,
    };
    if (!image) {
      toast({
        title: "L'image du produit est obligatoire",
        variant: "error",
        className: "toast-container",
      });
      return;
    }

    if (
      productData.title === allData.title &&
      productData.marque === allData.marque &&
      productData.categoryId === allData.categoryId &&
      productData.price === allData.price &&
      productData.stock === allData.stock &&
      productData.capacite === allData.capacite &&
      productData.voltage === allData.voltage &&
      productData.courantDessai === allData.courantDessai &&
      productData.variationProduct === allData.variationProduct &&
      productData.description === allData.description &&
      productData.garantie === allData.garantie &&
      productData.imageUrl === allData.imageUrl
    ) {
      return;
    }
    try {
      const res = await axios.put(`/api/product/${productData.slug}`, allData);
      if (res.statusText === "updated") {
        setLoading(false);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.push("/dashboard/produit");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Une erreur s'est produite",
        description: "",
        variant: "error",
        className: "toast-container",
      });
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 md:w-[750px] ">
      <h1 className="text-xl text-start text-gray-600 ">Ajouter produit</h1>
      <hr className="text-gray-400 " />

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
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorie</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full md:w-[290px]">
                        <SelectValue placeholder="Categorie" />
                      </SelectTrigger>

                      <SelectContent>
                        {categoryData?.map((cat, idx) => (
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
            <Controller
              name="garantie"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantie</FormLabel>
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
                        className="mt-2 px-4"
                        placeholder="Prix du produit"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
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
                        className="mt-2 px-4"
                        placeholder="Combien de produit en stock ?"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
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
                        className="mt-2 px-4"
                        placeholder="Capacité (Ah) du produit"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
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
                        className="mt-2 px-4"
                        placeholder="Voltage (V) du produit"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
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
                        className="mt-2 px-4"
                        placeholder="Courant d’essai de décharge à froid EN (A)"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="variationProduct"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Variations du produit</FormLabel>
                    <FormControl>
                      <Input
                        className="mt-2 px-4"
                        placeholder="Variations du produit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

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
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <FormLabel className="mb-4   md:mb-2">Image du produit</FormLabel>
              <Button
                type="button"
                onClick={() => {
                  setImage("");
                }}
              >
                Modifier l'image du produit
              </Button>
            </div>

            {/* <p ref={imageRef} className="text-red-500 text-sm"></p> */}

            <UploadImageButton
              imageKey={imageKey}
              setImageKey={setImageKey}
              isImageUploading={isImageUploading}
              setIsImageUploading={setIsImageUploading}
              setImage={setImage}
              image={image}
            />
          </div>
          {loading || isImageUploading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
            >
              Modifier produit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UpdateProductForm;
