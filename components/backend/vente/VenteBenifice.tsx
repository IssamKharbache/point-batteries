import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

type VenteBenefitsProps = {
  rowData: {
    venteBenifits: number;
    paymentType: string;
    products: { price: number; qty: number; discount: number }[];
  };
};

const VenteBenefits: React.FC<VenteBenefitsProps> = ({ rowData }) => {
  const { data: session } = useSession();

  let ben = rowData.venteBenifits;

  if (rowData.paymentType === "ACREDIT") {
    ben = -rowData.products.reduce(
      (total, product) =>
        total + product.price * product.qty - product.discount,
      0
    );
  }

  if (session?.user.role === "ADMIN" || session?.user.role === "STAFF") {
    return (
      <p
        className={`font-semibold text-center rounded-full w-fit py-2 px-3 ${
          ben < 0 ? "bg-white text-black" : "bg-green-500"
        }`}
      >
        {ben < 0 ? `- ${Math.abs(ben)}` : `+ ${ben}`} dhs
      </p>
    );
  } else {
    return <X className="text-red-500" />;
  }
};

export default VenteBenefits;
