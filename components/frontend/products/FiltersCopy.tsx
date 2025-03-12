"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { filterInputMarque } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useCategoryProductPageStore } from "@/context/store";
import { useEffect } from "react";

const FiltersCopy = ({ slug, marque }: { slug?: string; marque?: string }) => {
  const form = useForm<z.infer<typeof filterInputMarque>>({
    resolver: zodResolver(filterInputMarque),
    defaultValues: {
      marque: "",
    },
  });
  const useParams = useSearchParams();
  const router = useRouter();
  const { loading, setLoading } = useCategoryProductPageStore();

  const page = useParams.get("page") || 1;
  const search = useParams.get("q") || "";
  const marqueParams = useParams.get("marque") || "";

  const submit = (data: z.infer<typeof filterInputMarque>) => {
    if (data.marque === marqueParams) {
      return;
    }
    setLoading(true);
    const href = search
      ? `/search?q=${search}&${new URLSearchParams({
          page: String(1),
          marque: data.marque,
        }).toString()}`
      : slug
      ? `/categorie/${slug}?${new URLSearchParams({
          page: String(1),
          marque: data.marque,
        }).toString()}`
      : `/produits/marque/${marque}?${new URLSearchParams({
          page: String(1),
        }).toString()}`;
    router.push(href);
  };

  useEffect(() => {
    form.reset();
  }, [search, marqueParams]);

  return (
    <div className="space-y-8 bg-white mt-8 p-8 mb-8 m-8 md:m-0   relative">
      <div
        className={`bg-white ${
          loading ? "opacity-20 pointer-events-none " : ""
        }`}
      >
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between  mb-4">
            <h1 className="font-medium text-md ">Filtrer par marque</h1>
          </div>
          <hr />
        </div>
        {/* custom price */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4 mt-8">
            <h1 className="font-medium text-md mb-4">
              Votre marque de Vehicule
            </h1>

            <FormField
              name="marque"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Audi, Dacia, Kia..."
                        className="px-2 md:px-4 placeholder:text-xs"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Submit Button with Loader */}
            <Button className="w-full font-semibold" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                "Filtrer"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Full opacity loader */}
      {loading && (
        <div className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 pointer-events-auto">
          <Loader2 className="animate-spin" size={45} />
        </div>
      )}
    </div>
  );
};

export default FiltersCopy;
