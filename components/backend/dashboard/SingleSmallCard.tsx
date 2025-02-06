import React, { ReactNode } from "react";
interface SingleSmallCardProps {
  data: {
    iconBg: string;
    icon: ReactNode;
    title: string;
    orders: number;
  };
}
const SingleSmallCard = ({ data }: SingleSmallCardProps) => {
  return (
    <div className="rounded-lg shadow-lg bg-slate-200  p-4 ">
      {/*  */}
      <div className="flex space-x-8">
        <div
          className={`${data.iconBg} w-12 h-12  
         rounded-full flex items-center justify-center`}
        >
          {data.icon}
        </div>

        <div className="text-gray-700 ">
          <p className="text-sm">{data.title}</p>
          <h3 className="text-2xl font-semibold">
            {" "}
            {data.orders.toString().padStart(2, "0")}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SingleSmallCard;
