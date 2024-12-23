import { useLoadingStore } from "@/context/store";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
interface DeleteActionButtonProps {
  title: string;
  endpoint: string;
}

const DeleteActionButton = ({ title, endpoint }: DeleteActionButtonProps) => {
  const { loading, setLoading } = useLoadingStore();
  const router = useRouter();

  const handleDelete = async () => {
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
        setLoading(true);
        const response = await axios.delete(endpoint);
        if (response.statusText === "deleted") {
          toast.success("Utilisateur supprimer avec succes");
          setLoading(false);
          router.refresh();
        }
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loader2 className="text-red-500 animate-spin" />
      ) : (
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 font-medium"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span className="text-red-500">{title}</span>
        </button>
      )}
    </>
  );
};

export default DeleteActionButton;
