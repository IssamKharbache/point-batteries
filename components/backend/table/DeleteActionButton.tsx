import { useLoadingStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
interface DeleteActionButtonProps {
  title?: string;
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
          if (response.status === 201) {
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
        } catch (error) {
          const errorMessage = getErrorMessage(error);

          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
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
          className="flex items-center justify-center  font-medium  rounded-full gap-2"
        >
          <Trash2 className="w-4 h-4 text-red-500  " />
          <span className="text-red-500">{title ?? ""}</span>
        </button>
      )}
    </>
  );
};

export default DeleteActionButton;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    const errorMessage = error.response?.data?.error;

    if (errorMessage === "Cannot delete vente with associated returns") {
      return "Impossible de supprimer une vente avec des retours associés";
    }

    if (error.response?.status === 400) {
      return "Requête incorrecte";
    }

    if (error.response?.status === 404) {
      return "Ressource non trouvée";
    }

    if (error.response?.status === 500) {
      return "Erreur interne du serveur";
    }
  }

  // Default message for unknown errors
  return "Une erreur s'est produite. Contactez le staff";
}
