import { useLoadingStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
interface DeleteActionButtonProps {
  title: string;
  endpoint: string;
}

const DeleteActionButton = ({ title, endpoint }: DeleteActionButtonProps) => {
  const { loading, setLoading } = useLoadingStore();
  const router = useRouter();
  const { toast } = useToast();

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
        try {
          setLoading(true);
          const response = await axios.delete(endpoint);
          if (response.statusText === "deleted") {
            toast({
              title: "L'opération est terminée avec succès",
              variant: "success",
              description: response.data.message,
              className: "toast-container",
            });
            setLoading(false);
            router.refresh();
          } else {
            setLoading(false);
          }
        } catch (_error) {
          toast({
            title: "Une erreur s'est produite",
            variant: "error",
            description: "Une erreur s'est produite contactez le staff",
            className: "toast-container",
          });

          setLoading(false);
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
