import { Delete } from "@mui/icons-material";
import { showSuccessToast } from "./toast/Toast";
import { mutate } from "swr";

interface DeleteButtonProps {
  api: string;
  id: string;
}

const DeleteButton = ({ api, id }: DeleteButtonProps) => {
  const handleDelete = async () => {
    const result = await fetch(`${api}${id}`, {
      method: "DELETE",
    });

    const response = await result.json();

    if (response.success) {
      showSuccessToast(response.message);
      mutate("menu");
      mutate("users");
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded-lg shadow-lg w-fit focus:ring-green-400 cursor-pointer focus:ring-4 focus:outline-none hover:bg-green-100"
    >
      <Delete />
    </button>
  );
};

export default DeleteButton;
