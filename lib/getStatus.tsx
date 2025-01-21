import { CircleDashed, X } from "lucide-react";
import { FaTruck } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

export const getStatus = (status: string) => {
  switch (status) {
    case "EN_ATTENTE":
      return (
        <div className="flex gap-2 items-center text-sm font-semibold bg-gray-300 px-7 rounded-md text-black  py-2 text-center justify-center">
          <span>En attente</span>
          <MdOutlinePendingActions />
        </div>
      );

    case "EN_COURS":
      return (
        <div className="flex gap-2 items-center text-sm bg-black px-7 rounded-md text-white font-semibold py-2 text-center justify-center">
          <span>En cours</span>
          <FaArrowsRotate />
        </div>
      );

    case "EXPEDIE":
      return (
        <div className="flex gap-2 items-center  text-sm bg-blue-600 px-7 text-white rounded-md font-semibold py-2 text-center justify-center">
          <span>Expedié</span>
          <FaTruck />
        </div>
      );

    case "LIVRE":
      return (
        <div className="flex gap-2 items-center text-sm bg-green-500 px-7 text-white rounded-md font-semibold py-2 text-center justify-center">
          <span>Livré</span>
          <FaCheck />
        </div>
      );
    case "ANNULLE":
      return (
        <div className="flex gap-2 items-center text-sm font-semibold bg-red-500 px-7 text-white rounded-md  py-2 text-center justify-center">
          <span>Annulé</span>
          <X />
        </div>
      );

    default:
      return (
        <div>
          <span>Status inconnu</span>
          <CircleDashed />
        </div>
      );
  }
};
