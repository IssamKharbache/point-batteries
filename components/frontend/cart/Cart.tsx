import CartProductTable from "./CartProductTable";
import TotalPanier from "./TotalPanier";

const Cart = () => {
  return (
    <div className="grid grid-cols-12 p-8 mb-6">
      <div className="col-span-12 xl:col-span-8">
        <h2 className="text-xl md:text-4xl font-semibold ">Votre panier</h2>
        <CartProductTable />
      </div>
      <div className=" bg-white col-span-12 xl:col-span-4 p-12 m-8">
        <h1 className="text-xl font-semibold border-b p-2">Total panier</h1>
        <TotalPanier />
      </div>
    </div>
  );
};

export default Cart;
