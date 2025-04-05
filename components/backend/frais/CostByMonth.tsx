"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { getData } from "@/lib/getData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { useLoadingStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { Cost } from "@prisma/client";

const CostsByMonth = () => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM") // Default to current month
  );
  const [filteredCosts, setFilteredCosts] = useState<Cost[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { loading: loadingStore, setLoading: setLoadingStore } =
    useLoadingStore();

  const { toast } = useToast();

  // Fetch all costs on component mount
  const fetchCosts = async () => {
    setLoading(true);
    try {
      const costs = await getData("/frais");
      setCosts(costs);
    } catch (error) {
      console.error("Error fetching costs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyTotal = (costs: Cost[]) => {
    return costs.reduce((total, cost) => total + (cost.montant || 0), 0);
  };

  // Fetch costs on component mount
  useEffect(() => {
    fetchCosts();
  }, []);

  useEffect(() => {
    if (costs.length > 0) {
      const startDate = startOfMonth(new Date(selectedMonth));
      const endDate = endOfMonth(new Date(selectedMonth));

      const filtered = costs.filter((cost) => {
        const costDate = new Date(cost.date);
        return costDate >= startDate && costDate <= endDate;
      });

      setFilteredCosts(filtered);
      setMonthlyTotal(calculateMonthlyTotal(filtered));
    } else {
      setFilteredCosts([]);
      setMonthlyTotal(0);
    }
  }, [selectedMonth, costs]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Etes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc1414",
      cancelButtonColor: "#6f7478",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui , supprimer!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingStore(true);
          const response = await axios.delete(`/api/frais/${id}`);
          if (response.status === 201) {
            toast({
              title: "L'opération est terminée avec succès",
              variant: "success",
              description: response.data.message,
              className: "toast-container",
            });

            // Re-fetch costs after deletion
            await fetchCosts();
          }
        } catch (__error) {
          toast({
            title: "Une erreur s'est produite",
            variant: "error",
            description: "Une erreur s'est produite contactez le staff",
            className: "toast-container",
          });
        } finally {
          setLoadingStore(false);
        }
      }
    });
  };

  // Generate a list of months for the dropdown
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push({
        label: format(date, "MMMM yyyy", { locale: fr }),
        value: format(date, "yyyy-MM"),
      });
    }
    return months;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="space-y-4">
      {/* Month Selection Dropdown */}
      <div className="flex justify-end mt-8 mr-12">
        <Select
          value={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un mois" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Costs for the Selected Month */}
      {loading || loadingStore ? (
        <LoadingButton />
      ) : (
        <div className="m-8">
          <h2 className="text-xl font-semibold mb-8 capitalize">
            Frais pour mois ,
            {format(new Date(selectedMonth), "MMMM yyyy", { locale: fr })}
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Nature des frais</th>
                <th className="border p-2">Montant</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCosts.length > 0 ? (
                filteredCosts.map((cost) => (
                  <tr key={cost.id}>
                    {/* Add key prop */}
                    <td className="border p-2">{cost.natureDuFrais}</td>
                    <td className="border p-2">{cost.montant}</td>
                    <td className="flex items-center justify-between border p-2">
                      {format(new Date(cost.date), "PPP", { locale: fr })}
                      <div>
                        <button
                          onClick={() => handleDelete(cost.id)}
                          className="flex items-center gap-2 font-medium"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border p-2 text-center">
                    Aucun frais pour ce mois.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-end  py-2 ">
            <span className="text-muted-foreground m-2">
              {`Total des frais pour le mois`}{" "}
              <span className="capitalize font-semibold text-blue-500">
                {format(new Date(selectedMonth), "MMMM yyyy", { locale: fr })} :
              </span>
            </span>
            <span className="font-bold ">{monthlyTotal.toFixed(2)} DH</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostsByMonth;
