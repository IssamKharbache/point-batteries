import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBestProductSellsStore } from "@/context/store";

interface SectionHeaderProps {
  header: string;
}
const SectionHeader = ({ header }: SectionHeaderProps) => {
  const { filterBy, setFilterBy } = useBestProductSellsStore();
  return (
    <div>
      <div className="flex justify-between ">
        <h1 className="font-semibold text-2xl mb-4">{header}</h1>
        <div>
          <Tabs defaultValue={filterBy} className="">
            <TabsList>
              <TabsTrigger
                onClick={() => setFilterBy("voitures")}
                value="voitures"
              >
                Voitures
              </TabsTrigger>
              <TabsTrigger onClick={() => setFilterBy("motos")} value="motos">
                Motos
              </TabsTrigger>
              <TabsTrigger onClick={() => setFilterBy("pwl")} value="pwl">
                Poit-Lourds
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <hr className="h-[4px] bg-gray-200 rounded-full outline-none border-none" />
    </div>
  );
};

export default SectionHeader;
