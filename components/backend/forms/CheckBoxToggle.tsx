import React from "react";
interface CheckBoxToggleProps {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}
const CheckBoxToggle = ({ isChecked, setIsChecked }: CheckBoxToggleProps) => {
  return (
    <div className="flex flex-col   gap-4">
      <span className="font-semibold text-2xl">
        {" "}
        {isChecked ? "Produit achat" : "Produit reception"}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          onClick={() => setIsChecked(!isChecked)}
          type="checkbox"
          className="sr-only peer"
          value=""
          checked={isChecked}
          readOnly
        />
        <div className="group peer bg-white rounded-full duration-300 w-16 h-8 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95"></div>
      </label>
    </div>
  );
};

export default CheckBoxToggle;
