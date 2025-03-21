"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal } from "lucide-react";
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
import { useCategoryProductPageStore, useFiltersStore } from "@/context/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FiltersCopy = ({ slug, marque }: { slug?: string; marque?: string }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const form = useForm<z.infer<typeof filterInputMarque>>({
    resolver: zodResolver(filterInputMarque),
    defaultValues: {
      marque: "",
    },
  });
  const useParams = useSearchParams();
  const router = useRouter();
  const { loading, setLoading } = useCategoryProductPageStore();
  const search = useParams.get("q") || "";
  const marqueParams = useParams.get("marque") || "";

  const { isOpen, setIsOpen } = useFiltersStore();

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
    <div className="space-y-8 bg-white mt-8 p-8 mb-8 m-8 md:m-0 relative">
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2"
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </Button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {(isOpen || (isClient && window.innerWidth >= 768)) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`bg-white ${
              loading ? "opacity-20 pointer-events-none" : ""
            }`}
          >
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-4">
                <h1 className="font-medium text-md">Filtrer par marque</h1>
              </div>
              <hr />
            </div>
            {/* Custom Price */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-4 mt-8"
              >
                <h1 className="font-medium text-md mb-4">Marque de batterie</h1>

                <FormField
                  name="marque"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Exide, Bosch, Alma..."
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10" />
        </div>
      )}
    </div>
  );
};

export default FiltersCopy;
