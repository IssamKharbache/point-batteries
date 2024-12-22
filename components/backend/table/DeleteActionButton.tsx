import axios from "axios";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
interface DeleteActionButtonProps {
  title: string;
  endpoint: string;
}

const DeleteActionButton = ({ title, endpoint }: DeleteActionButtonProps) => {
  const handleDelete = async () => {
    Swal.fire({
      title: "Etes-vous sûr?",
      text: `Vous ne pourrez pas revenir en arrière!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui , supprimer!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(endpoint);
        console.log(response.statusText);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-2 font-medium"
    >
      <Trash2 className="w-4 h-4 text-red-500" />
      <span className="text-red-500">{title}</span>
    </button>
  );
};

export default DeleteActionButton;
