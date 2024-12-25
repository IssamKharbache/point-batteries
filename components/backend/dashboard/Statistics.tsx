import { CircleDollarSign, ShoppingCart, User } from "lucide-react";
import React from "react";

const data = [
  {
    name: "Revenu total",
    number: 250,
    icon: CircleDollarSign,
    bgColor: "bg-blue-300",
  },
  {
    name: "Nombre total de Commandes",
    number: 150,
    icon: ShoppingCart,
    bgColor: "bg-green-200",
  },
  {
    name: "Nombre total de clients",
    number: 100,
    icon: User,
    bgColor: "bg-purple-200",
  },
];
const Statistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`${item.bgColor} flex flex-col items-center gap-4  py-12 rounded`}
          >
            <Icon size={40} />
            <p className="text-center font-semibold text-gray-700">
              {item.name}
            </p>
            <p className="text-center text-6xl ">
              {item.number}
              {item.name === "Revenu total" && "$"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;
