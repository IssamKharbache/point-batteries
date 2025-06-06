"use client";

import React, { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/index";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Printer } from "lucide-react";
import axios from "axios";
import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import { fr } from "date-fns/locale";

interface VenteJournalProps {
    ventes: VenteType[];
}

const VenteJournal: React.FC<VenteJournalProps> = ({ ventes }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [ventesList, setVentesList] = useState<VenteType[]>(ventes);
    const [loading, setLoading] = useState(false);
    const today = new Date();

    // Improved show today function
    const showTodayVentes = () => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        setStartDate(todayStart);
        setEndDate(new Date(todayStart));
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };
    useEffect(() => {
        registerLocale("fr", fr);
    }, []);
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/vente");
                setVentesList(res.data.data);
            } catch (error) {
                console.error("Error fetching ventes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredVentes = ventesList.filter((vente) => {
        // First check if there are any returns for this vente
        const hasReturns = vente.returns && vente.returns.length > 0;

        // Skip ventes that have returns
        if (hasReturns) return false;

        const venteDate = new Date(vente.createdAt);

        // If no dates are selected, show all non-returned ventes
        if (!startDate && !endDate) return true;

        // If only start date is selected, show from that date onward
        if (startDate && !endDate) {
            return venteDate >= new Date(startDate.setHours(0, 0, 0, 0));
        }

        // If only end date is selected, show up to that date
        if (!startDate && endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            return venteDate <= endOfDay;
        }

        // If both dates are selected, show between them
        if (startDate && endDate) {
            const start = new Date(startDate.setHours(0, 0, 0, 0));
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return venteDate >= start && venteDate <= end;
        }

        return true;
    });
    const CustomDatePickerButton = React.forwardRef<
        HTMLButtonElement,
        { value?: string; onClick?: () => void }
    >(({ value, onClick }, ref) => (
        <button
            onClick={onClick}
            ref={ref}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center space-x-2 w-full px-7"
        >
            <FaCalendarAlt className="text-gray-500" />
            <span>{value || "Selectionner une date"}</span>
        </button>
    ));

    CustomDatePickerButton.displayName = "CustomDatePickerButton";

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: `Journal_Vente_${startDate ? formatDate(startDate) : ""}_${
            endDate ? formatDate(endDate) : ""
        }`,
    });

    // Add this calculation right before your return statement
    const totalNetSales = filteredVentes.reduce((total, vente) => {
        return (
            total +
            vente.products.reduce((venteTotal, product) => {
                // 1. Calculate base price for all quantities (e.g., 3800 x 2 = 7600)
                const totalPrice = product.price * product.qty;

                // 2. Subtract discount ONCE per product line (not per quantity)
                const afterDiscount = totalPrice - (product.discount || 0);

                // 3. Subtract commission ONCE per product line (not per quantity)
                const afterCommission =
                    afterDiscount - (product.commission || 0);

                return venteTotal + afterCommission;
            }, 0)
        );
    }, 0);
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Journal des Ventes</h1>

            {/* Date controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2">
                    <Button
                        variant={!startDate && !endDate ? "default" : "outline"}
                        onClick={clearFilters}
                        className="flex items-center gap-2"
                    >
                        Toutes les ventes
                    </Button>
                    <Button
                        variant={
                            startDate &&
                            !endDate &&
                            startDate.toDateString() === today.toDateString()
                                ? "default"
                                : "outline"
                        }
                        onClick={showTodayVentes}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <FaCalendarAlt />
                        Aujourd&apos;hui
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                            Date de début:
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={endDate || today}
                            dateFormat="yyyy-MM-dd"
                            customInput={<CustomDatePickerButton />}
                            className="w-full"
                            locale="fr"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                            Date de fin:
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate || undefined}
                            maxDate={today}
                            dateFormat="yyyy-MM-dd"
                            customInput={<CustomDatePickerButton />}
                            className="w-full"
                            locale="fr"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {startDate || endDate ? (
                        <p className="text-sm text-muted-foreground">
                            {startDate && `De: ${formatDate(startDate)} `}
                            {endDate && `À: ${formatDate(endDate)}`}
                            {startDate && endDate && (
                                <span className="ml-2">
                                    (
                                    {getDaysDifference(startDate, endDate) === 1
                                        ? `${getDaysDifference(startDate, endDate)} jour`
                                        : `${getDaysDifference(startDate, endDate)} jours`}
                                    )
                                </span>
                            )}
                        </p>
                    ) : null}
                </div>
                <Button onClick={() => reactToPrintFn()} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimer
                </Button>
            </div>

            <div ref={contentRef} className="border rounded-lg m-5">
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">
                            Journal des ventes
                        </h2>
                        <p className="text-md font-semibold">
                            {filteredVentes.length} Produits vendue
                        </p>

                        <div className="flex items-center gap-4">
                            {startDate || endDate ? (
                                <p className="text-sm text-muted-foreground">
                                    {startDate &&
                                        `De: ${formatDate(startDate)} `}
                                    {endDate && `À: ${formatDate(endDate)}`}
                                    {startDate && endDate && (
                                        <span className="ml-2">
                                            (
                                            {getDaysDifference(
                                                startDate,
                                                endDate,
                                            ) === 1
                                                ? `${getDaysDifference(startDate, endDate)} jour`
                                                : `${getDaysDifference(startDate, endDate)} jours`}
                                            )
                                        </span>
                                    )}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <Image
                        src="/logopbsdark.png"
                        alt="Company Logo"
                        width={160}
                        height={60}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead>Quantité</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Caissier</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : filteredVentes.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    Aucune vente trouvée
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredVentes.flatMap((vente) =>
                                vente.products.map((product, index) => {
                                    const priceAfterCommission =
                                        product.commission > 0
                                            ? product.price - product.commission
                                            : product.price;

                                    return (
                                        <TableRow key={`${vente.id}-${index}`}>
                                            <TableCell className="font-medium">
                                                {product.designationProduit}
                                            </TableCell>
                                            <TableCell>{product.qty}</TableCell>
                                            <TableCell>
                                                {(
                                                    product.price *
                                                        product.qty -
                                                    product.discount -
                                                    (product.commission || 0)
                                                ).toFixed(2)}{" "}
                                                DH
                                            </TableCell>
                                            <TableCell>
                                                {vente.nomDuCaissier}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }),
                            )
                        )}
                    </TableBody>
                    {/* Add this table footer */}
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={2}
                                className="text-right font-medium"
                            >
                                Total:
                            </TableCell>
                            <TableCell className="font-bold">
                                {totalNetSales.toFixed(2)} DH
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};

function getDaysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export default VenteJournal;
