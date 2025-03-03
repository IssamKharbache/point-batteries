"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Importing calendar icon
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  designationProduit: string;
  qty: number;
  price: number;
}

interface Vente {
  id: string;
  clientNom: string;
  clientPrenom: string;
  clientTel: string;
  createdAt: string;
  nomDuCaissier: string;
  paymentType: string;
  products: Product[];
  venteRef: string;
}

interface VenteJournalProps {
  ventes: Vente[];
}

const VenteJournal: React.FC<VenteJournalProps> = ({ ventes }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Get today's date
  const today = new Date();

  const filteredVentes = ventes.filter((vente) => {
    const venteDate = new Date(vente.createdAt);
    const start = startDate ? startDate : null;
    const end = endDate ? endDate : null;

    if (end) {
      end.setHours(23, 59, 59, 999); // Include all of the end date
    }

    // Ensure the date is within the range, inclusive of the boundaries
    if (start && venteDate < start) return false;
    if (end && venteDate > end) return false;

    return true;
  });

  // Custom button component for the date picker
  const CustomDatePickerButton = React.forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center space-x-2 w-full px-7 "
    >
      <FaCalendarAlt className="text-gray-500" />
      <span>{value || "Selectionner une date"}</span>
    </button>
  ));

  CustomDatePickerButton.displayName = "CustomDatePickerButton";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Journal de Vente</h1>

      {/* Date pickers with button triggers */}
      <div className="mb-6 flex flex-col md:flex-row gap-8 md:items-center md:justify-end">
        <div className="flex flex-col  gap-2 relative">
          <label htmlFor="" className="font-semibold ">
            Date de debut :
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            maxDate={today} // Disable future dates
            dateFormat="yyyy-MM-dd"
            customInput={<CustomDatePickerButton />}
          />
        </div>

        <div className="flex flex-col relative gap-2">
          <label htmlFor="" className="font-semibold ">
            Date de fin :
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            maxDate={today} // Disable future dates
            dateFormat="yyyy-MM-dd"
            customInput={<CustomDatePickerButton />}
          />
        </div>
      </div>

      <Table className="text-sm border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Designation produit</TableHead>
            <TableHead>Quantite</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Vendue par</TableHead>
          </TableRow>
        </TableHeader>
        {filteredVentes.length > 0 ? (
          filteredVentes.map((vente) => (
            <TableBody className="border" key={vente.id}>
              {vente.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium p-5 line-clamp-2">
                    {product.designationProduit}
                  </TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{vente.nomDuCaissier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="h-24 text-center">
              Aucun résultat
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
};

export default VenteJournal;
