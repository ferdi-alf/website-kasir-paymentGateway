"use client";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderButton = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    role: string;
    image: string;
  } | null>(null);

  console.log("wiwok de tok", user);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/user/me", { method: "GET" }); // Lebih baik endpoint user sendiri

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    };

    getUser();
  }, []);

  const handleClick = () => {
    if (user === null) {
      router.push("/login");
    } else {
      router.push("/order");
    }
  };
  return (
    <div className="w-full h-screen fixed z-30 ">
      <button
        onClick={handleClick}
        className="bg-green-600 flex flex-nowrap  text-white font-bold py-2 px-4 rounded-3xl gap-2 shadow-lg hover:bg-green-700 transition duration-300 ease-in-out fixed bottom-5 right-5"
      >
        <RoomServiceIcon />
        <p>Order Disini</p>
      </button>
    </div>
  );
};

export default OrderButton;
