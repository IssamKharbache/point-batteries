"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentType } from "@prisma/client";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { usePaymentTypeLoadingStore } from "@/context/store";

const paymentTypeLabels: Record<PaymentType, string> = {
  ESPECE: "Espèces",
  CHECK: "Chèque",
  VIREMENT: "Virement",
  ACREDIT: "A crédit",
};

export function PaymentTypeEdit({
  currentType,
  venteId,
}: {
  currentType: PaymentType;
  venteId: string;
}) {
  const router = useRouter();
  const { loadingVentes, setLoadingVente } = usePaymentTypeLoadingStore();

  const handlePaymentTypeChange = async (newType: PaymentType) => {
    setLoadingVente(venteId, true);

    try {
      await axios.put(`/api/vente/${venteId}`, { paymentType: newType });
      toast({
        title: "Succès",
        description: "Type de paiement mis à jour",
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du type de paiement",
        variant: "destructive",
      });
    } finally {
      setLoadingVente(venteId, false);
    }
  };

  const isLoading = loadingVentes[venteId] || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button
          variant="ghost"
          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-md min-w-[120px] justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            paymentTypeLabels[currentType]
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {(Object.keys(paymentTypeLabels) as PaymentType[]).map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => handlePaymentTypeChange(type)}
            className="flex items-center justify-between"
            disabled={isLoading}
          >
            <span className="flex-1">{paymentTypeLabels[type]}</span>
            {currentType === type && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
