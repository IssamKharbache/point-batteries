"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Circle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { filterPriceSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Swal from "sweetalert2";

const Filters = ({ slug }: { slug?: string }) => {
  const form = useForm<z.infer<typeof filterPriceSchema>>({
    resolver: zodResolver(filterPriceSchema),
    defaultValues: {
      min: "",
      max: "",
    },
  });
  const useParams = useSearchParams();
  const router = useRouter();
  //params
  const min = useParams.get("min") || 0;
  const max = useParams.get("max") || 0;
  const page = useParams.get("page") || 1;
  const sort = useParams.get("sort") || "asc";
  const search = useParams.get("q") || "";

  //list of price ranges
  const priceRanges = [
    {
      displayName: "Moins de 2000",
      min: 0,
      max: 2000,
    },
    { displayName: "Entre 2000dhs et 3000dhs", min: 2000, max: 3000 },
    { displayName: "Entre 3000dhs and 4000dhs", min: 3000, max: 4000 },
    { displayName: "Plus de 4000", min: 4000 },
  ];
  const submitPrice = (data: z.infer<typeof filterPriceSchema>) => {
    const minInt = Number(data.min);
    const maxInt = Number(data.max);
    if (minInt >= maxInt) {
      Swal.fire({
        text: "Le prix minimum doit être inférieur au prix maximum",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
    const href = search
      ? `/search?q=${search}&${new URLSearchParams({
          page: String(1),
          min: data.min,
          max: data.max,
          sort,
        }).toString()}`
      : `/categorie/${slug}?${new URLSearchParams({
          page: String(1),
          min: data.min,
          max: data.max,
          sort,
        }).toString()}`;
    router.push(href);
  };
  //for deleting filters
  const href = search
    ? `/search/?q=${search}&pageNum=${page}&sort=asc&min=0`
    : `/categorie/${slug}?pageNum=${page}&sort=asc&min=0`;
  return (
    <div className="space-y-8 bg-white mt-8 p-8 mb-8 m-8 md:m-0">
      <div className="">
        <h1 className="font-semibold text-xl">Filtres</h1>
      </div>
      <hr />
      <div>
        <div className="flex items-center justify-between  mb-4">
          <h1 className="font-medium text-md ">Filtrer par tarif</h1>
          <Link href={href} onClick={() => form.reset()}>
            <Button className="bg-red-500/90 hover:bg-red-600 font-semibold">
              Réinitialiser
            </Button>
          </Link>
        </div>
        {/* Filters */}
        <div className="space-y-8">
          {priceRanges.map((range, i) => {
            const href = search
              ? `/search?${new URLSearchParams({
                  q: search,
                  page: String(1),
                  min: range.min !== undefined ? String(range.min) : "",
                  max: range.max !== undefined ? String(range.max) : "",
                  sort,
                }).toString()}`
              : `?${new URLSearchParams({
                  page: String(1),
                  min: range.min !== undefined ? String(range.min) : "",
                  max: range.max !== undefined ? String(range.max) : "",
                  sort,
                }).toString()}`;

            return (
              <div key={i}>
                <Link
                  href={href}
                  className={`${
                    (range.min && range.min == min) ||
                    (range.max && range.max == max) ||
                    (range.min &&
                      range.min &&
                      range.min == min &&
                      range.max == max)
                      ? "border-black text-black flex items-center   justify-between border-2  px-4 py-2"
                      : "flex items-center justify-between border border-gray-300 text-gray-600  px-4 py-2 "
                  }`}
                >
                  {range.displayName}
                  <Circle
                    className={`${
                      (range.min && range.min == min) ||
                      (range.max && range.max == max) ||
                      (range.min &&
                        range.min &&
                        range.min == min &&
                        range.max == max)
                        ? "fill-black text-black"
                        : "text-gray-500"
                    }`}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      {/* custom price */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitPrice)} className="space-y-4">
          <h1 className="font-medium text-md mb-4">Prix personnalisée</h1>
          <div className="flex items-center gap-8">
            <FormField
              name="min"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Min prix"
                        className="px-2 md:px-4 placeholder:text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="max"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Max prix"
                        className="px-2 md:px-4 placeholder:text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button className="w-full font-semibold">Filtrer</Button>
        </form>
      </Form>
    </div>
  );
};

export default Filters;
