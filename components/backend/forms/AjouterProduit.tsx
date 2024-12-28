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
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import UploadImageButton from "../upload/UploadImageButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/app/(backend)/dashboard/categorie/columns";
import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";

const AjouterProduit = ({
  categorieData,
}: {
  categorieData: CategorieData;
}) => {
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      capacite: "",
      courantDessai: 0,
      marque: "",
      variationsProduit: "",
      voltage: 0,
      categorie: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof addProductSchema>) => {
    console.log(data);

    console.log("submited");
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 md:w-[750px] ">
      <h1 className="text-xl text-start text-gray-600 ">Ajouter produit</h1>
      <hr className="text-gray-400 " />
      {/* {error && (
        <div>
          <p className="bg-red-500 text-white rounded p-2 text-center text-md mt-6">
            {error}
          </p>
        </div>
      )} */}
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
              name="categorie"
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
                        {categorieData.map((cat, idx) => (
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
              name="categorie"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantie</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full md:w-[290px]">
                        <SelectValue placeholder="Categorie" />
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
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        className="mt-2 px-4"
                        placeholder="Capacité (Ah) du produit"
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
                        className="mt-2 px-4"
                        placeholder="Voltage (V) du produit"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between x">
            <FormField
              name="variationsProduit"
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
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
            <FormLabel>Image de produit</FormLabel>
            <UploadImageButton />
          </div>

          <Button
            type="submit"
            className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
          >
            Ajouter produit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AjouterProduit;
