"use client";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import UploadImageButton from "../upload/UploadImageButton";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import CheckBoxToggle from "./CheckBoxToggle";
import { mutate } from "swr";
import { RichTextEditor } from "../RichTextEditor";

const UpdateProductForm = ({ productData, categoryData }: ProductData) => {
  const [image, setImage] = useState(productData.imageUrl);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageKey, setImageKey] = useState(productData.imageKey);
  const [loading, setLoading] = useState(false);
  //
  const [isProductAchat, setIsProductAchat] = useState<boolean>(
    productData.isAchatProduct
  );

  const priceToString = String(productData.price);
  const achatPriceToString = String(productData.achatPrice);
  const stockToString = String(productData.stock);
  const cdes = String(productData.courantDessai);
  const voltageToString = String(productData.voltage);

  //react hook form
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      ...productData,
      price: priceToString,
      achatPrice: achatPriceToString,
      stock: stockToString,
      courantDessai: cdes,
      voltage: voltageToString,
    },
  });

  const router = useRouter();

  const { toast } = useToast();
  const handleSubmit = async (data: z.infer<typeof addProductSchema>) => {
    const allData = {
      ...data,
      imageUrl: image,
      imageKey,
      isAchatProduct: isProductAchat,
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
      productData.price === Number(allData.price) &&
      productData.achatPrice === Number(allData.achatPrice) &&
      productData.stock === Number(allData.stock) &&
      productData.capacite === Number(allData.capacite) &&
      productData.voltage === Number(allData.voltage) &&
      productData.courantDessai === Number(allData.courantDessai) &&
      productData.designationProduit === allData.designationProduit &&
      productData.description === allData.description &&
      productData.garantie === allData.garantie &&
      productData.imageUrl === allData.imageUrl &&
      productData.filterByCar === allData.filterByCar &&
      productData.isAchatProduct === allData.isAchatProduct
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(`/api/product/${productData.slug}`, allData);
      if (res.status === 201) {
        mutate("/api/product");
        mutate("/api/categorie");
        setLoading(false);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.push("/dashboard/produit");
      }
    } catch (__error) {
      setLoading(false);
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
      <h1 className="text-xl text-start text-gray-600 ">Modifier produit</h1>
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
                      value={field.value ?? ""}
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
                      value={field.value ?? ""}
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
            <FormField
              name="garantie"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantie</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
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

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Prix de vente</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Prix du produit de vente"
                        min={0}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="achatPrice"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Prix d&apos;achat</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4 text-sm"
                        placeholder="Prix d'achat du produit"
                        min={0}
                        {...field}
                        value={field.value ?? ""}
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
                        value={field.value ?? ""}
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
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(null);
                          } else {
                            const numValue = parseFloat(value);
                            field.onChange(isNaN(numValue) ? null : numValue);
                          }
                        }}
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
                        value={field.value ?? ""}
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
                    <FormLabel>Courant d&apos;essai de décharge</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4"
                        placeholder="Courant d’essai de décharge à froid EN (A)"
                        min={0}
                        {...field}
                        value={field.value ?? ""}
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
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

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
                      value={field.value ?? ""}
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
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Description du Produit ..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <CheckBoxToggle
            isChecked={isProductAchat}
            setIsChecked={setIsProductAchat}
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
                Modifier l&apos;image du produit
              </Button>
            </div>

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
              className="mt-4 px-4 h-12 rounded-sm bg-black text-white w-full text-md"
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
