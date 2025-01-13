import CartProductTable from "./CartProductTable";

const Cart = () => {
  return (
    <div>
      <h2 className="text-xl md:text-4xl  mb-6 font-semibold p-8 ">
        Votre panier
      </h2>
      <CartProductTable />
    </div>
  );
};

export default Cart;
