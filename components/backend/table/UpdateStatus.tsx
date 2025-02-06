import React, { useState } from "react";
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

interface UpdateStatusProps {
  data: Order;
}
const UpdateStatus = ({ data }: UpdateStatusProps) => {
  const [value, setValue] = useState(data.orderStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();
  const onChange = async (
    selectedValue:
      | "CONFIRMER"
      | "EN_ATTENTE"
      | "EN_COURS"
      | "EXPEDIE"
      | "LIVRE"
      | "ANNULLE"
  ) => {
    setIsUpdating(true);
    setValue(selectedValue);
    if (selectedValue === data.orderStatus) {
      setIsUpdating(false);
      return;
    }
    try {
      const endpoint = `/api/order/${data.id}`;
      const res = await axios.put(endpoint, {
        status: selectedValue,
      });
      if (res.statusText === "updated") {
        setIsUpdating(false);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
      }
    } catch (__error) {
      setIsUpdating(false);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "error",
        className: "toast-container",
      });
    }
  };
  if (isUpdating) {
    return <Loader2 className="animate-spin" size={20} />;
  }
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[100px] md:w-[150px] ">
        <SelectValue placeholder={data.orderStatus} />
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
