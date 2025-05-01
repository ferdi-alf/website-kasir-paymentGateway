import { mutate } from "swr";
import { showErrorToast, showSuccessToast } from "./toast/Toast";

interface DeleteButtonProps {
  api: string;
  id: string;
}
const ButtonUpdateStatus = ({ api, id }: DeleteButtonProps) => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const handleUpdate = async () => {
    const result = await fetch(`${url}${api}${id}`, {
      method: "PUT",
    });

    const response = await result.json();
    console.log(response);

    if (response.success) {
      showSuccessToast(response.message);
      mutate("pesanan");
    } else if (response.error) {
      showErrorToast(response.message);
    }
  };
  return (
    <button
      onClick={handleUpdate}
      className="p-2 md:md:w-2/3 cursor-pointer hover:bg-green-700 w-full rounded-lg shadow-lg bg-green-500 text-white"
    >
      Konfirmasi
    </button>
  );
};

export default ButtonUpdateStatus;
