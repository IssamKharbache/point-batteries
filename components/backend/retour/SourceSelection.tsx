import React from "react";
import { Check, CircleDollarSign, Package } from "lucide-react";
import { useSourceRetourStore } from "@/context/store";

const SourceSelection = () => {
  const { source, setSource, setStep } = useSourceRetourStore();
  const selectSource = (value: string) => {
    if (value === source) {
      setSource("");
    } else {
      setSource(value);
    }
  };
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative">
          {source === "produit" ? (
            <div className="flex items-center justify-center absolute -top-3 -right-2 bg-red-400 rounded-full w-7 h-7">
              <Check size={20} />
            </div>
          ) : null}
          <button
            onClick={() => selectSource("produit")}
            className={`group/product flex flex-col items-center justify-center gap-5 bg-yellow-400  hover:bg-yellow-300/45 duration-300 p-10 rounded h-56 w-56 ${
              source === "produit" && "border-[3px] border-red-500 "
            }`}
          >
            <div className="group-hover/product:bg-yellow-500/50 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center ">
              <Package />
            </div>
            <span className="text-xl font-bold">Produit</span>
          </button>
        </div>
        <div className="relative">
          {source === "vente" ? (
            <div className="flex items-center justify-center absolute -top-3 -right-2 bg-red-400 rounded-full w-7 h-7">
              <Check size={20} />
            </div>
          ) : null}
          <button
            onClick={() => selectSource("vente")}
            className={`flex flex-col items-center justify-center gap-5 bg-purple-400 hover:bg-purple-300   p-10 rounded h-56  w-56 group ${
              source === "vente" && "border-[3px] border-red-500 hover"
            }`}
          >
            <div className="w-16 h-16 bg-purple-300 group-hover:bg-purple-400  duration-300  rounded-full flex items-center justify-center">
              <CircleDollarSign />
            </div>
            <span className="text-xl font-bold">Vente</span>
          </button>
        </div>
      </div>
      <button
        disabled={!source}
        onClick={() => setStep(2)}
        className={`bg-black w-full max-w-[calc(2*14rem+2rem)] py-3 font-bold mt-5 duration-300 rounded-full text-white hover:bg-black/80 disabled:cursor-not-allowed ${
          source ? "opacity-100" : "opacity-40"
        } `}
      >
        Sélectionner
      </button>
    </div>
  );
};

export default SourceSelection;
