"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Circle } from "lucide-react";

const Filters = ({ slug }: { slug: string }) => {
  const useParams = useSearchParams();
  //params
  const min = useParams.get("min") || 0;
  const max = useParams.get("max") || 0;
  const page = useParams.get("page") || 1;
  const sort = useParams.get("sort") || "asc";

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

  return (
    <div className="space-y-8 bg-white mt-8 p-8 mb-8">
      <div className="">
        <h1 className="font-semibold text-xl">Filtres</h1>
      </div>
      <hr />
      <div>
        <div className="flex items-center justify-between  mb-4">
          <h1 className="font-medium text-md ">Filtrer par tarif</h1>
          <Link
            href={`/categorie/${slug}?pageNum=${page}&pageSize=${1}&sort=asc&min=0`}
          >
            <Button className="bg-red-500/90 hover:bg-red-600 font-semibold">
              Réinitialiser
            </Button>
          </Link>
        </div>
        {/* Filters */}
        <div className="space-y-8">
          {priceRanges.map((range, i) => {
            const href = `?${new URLSearchParams({
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
      <div className="space-y-4">
        <h1 className="font-medium text-md mb-4">Prix personnalisée</h1>
        <div className="flex items-center gap-8">
          <Input placeholder="Min" className="px-4" />
          <Input placeholder="Max" className="px-4" />
        </div>
        <Button className="w-full font-semibold">Filtrer</Button>
      </div>
    </div>
  );
};

export default Filters;
