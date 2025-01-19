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
  const [value, setValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();
  const onChange = async (selectedValue: string) => {
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
    } catch (error) {
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
      <SelectTrigger className="w-[150px] ">
        <SelectValue placeholder={data.orderStatus} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="EN_ATTENTE">EN_ATTENTE</SelectItem>
        <SelectItem value="EN_COURS">EN_COURS</SelectItem>
        <SelectItem value="EXPEDIE">EXPEDIE</SelectItem>
        <SelectItem value="LIVRE">LIVRE</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UpdateStatus;
