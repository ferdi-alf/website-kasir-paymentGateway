import { useFormStatus } from "react-dom";

export const FormButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          {/* Loading spinner */}
          <div className="w-16 h-16 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      ) : null}
      <button
        className="p-2 hover:bg-green-700 font-semibold bg-green-500 rounded-md uppercase text-lg text-white w-full mt-7"
        type="submit"
      >
        {pending ? "Loading..." : "Submit"}
      </button>
    </>
  );
};
