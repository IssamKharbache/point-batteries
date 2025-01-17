import OrderDetailsForm from "@/components/frontend/cart/forms/OrderDetailsForm";
import OrderDetails from "@/components/frontend/cart/OrderDetails";
import React from "react";

const page = () => {
  return (
    <section className="max-w-[1100px] mx-auto p-8 md:p-0">
      <h1 className="font-semibold text-3xl">Validation de la commande </h1>
      <div className="grid grid-cols-10 gap-4 mt-8">
        <div className="col-span-6">
          <OrderDetailsForm />
        </div>
        <div className="col-span-4">
          <OrderDetails />
        </div>
      </div>
    </section>
  );
};

export default page;
