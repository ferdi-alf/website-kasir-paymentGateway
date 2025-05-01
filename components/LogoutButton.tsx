import { handleSignOut } from "@/lib/signOutAction";
import { useFormStatus } from "react-dom";

export const LogoutButton = () => {
  const { pending } = useFormStatus();
  const onSignOut = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  return (
    <>
      {pending ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          {/* Loading spinner */}
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      ) : null}

      <button
        onClick={onSignOut}
        className="block px-4 py-2 hover:bg-gray-100 w-full text-start text-sm text-gray-700"
        type="submit"
      >
        {pending ? "Sign Out...." : "Sign Out"}
      </button>
    </>
  );
};
