import React, { useState, useEffect } from "react"; // Added useEffect
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@prisma/client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLoadingStore, useOrderBackendStore } from "@/context/store";

interface UpdateStatusProps {
  data: Order;
}

const UpdateStatus = ({ data }: UpdateStatusProps) => {
  const [value, setValue] = useState(data.orderStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { setIsRefresh } = useOrderBackendStore();
  const { setLoading } = useLoadingStore();
  const { toast } = useToast();
  const router = useRouter();

  // Add this useEffect to sync with parent data updates
  useEffect(() => {
    setValue(data.orderStatus);
  }, [data.orderStatus]);

  const onChange = async (
    selectedValue:
      | "CONFIRMER"
      | "EN_ATTENTE"
      | "EN_COURS"
      | "EXPEDIE"
      | "LIVRE"
      | "ANNULLE"
  ) => {
    if (selectedValue === data.orderStatus) return;

    try {
      // Optimistic update
      setValue(selectedValue);
      setLoading(true);
      setIsUpdating(true);
      setIsRefresh(true);

      const endpoint = `/api/order/${data.id}`;
      const res = await axios.put(endpoint, { status: selectedValue });

      if (res.status === 201) {
        setLoading(false);
        setIsUpdating(false);
        setIsRefresh(false);
        toast({
          title: "Succès",
          description: "Statut de la commande mis à jour",
          variant: "success",
          className: "toast-container",
        });
      }
    } catch (error) {
      // Rollback on error
      setValue(data.orderStatus);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "error",
        className: "toast-container",
      });
    } finally {
      // Cleanup states
      setIsRefresh(false);
      setIsUpdating(false);
      setLoading(false);
    }
  };

  if (isUpdating) {
    return <Loader2 className="animate-spin" size={20} />;
  }

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[100px] md:w-[150px]">
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="EN_ATTENTE">En attente</SelectItem>
        <SelectItem value="CONFIRMER">Confirmer</SelectItem>
        <SelectItem value="EN_COURS">En cours</SelectItem>
        <SelectItem value="EXPEDIE">Expedié</SelectItem>
        <SelectItem value="LIVRE">Livré</SelectItem>
        <SelectItem value="ANNULLE">Annulé</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UpdateStatus;
