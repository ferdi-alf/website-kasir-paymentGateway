/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Image from "next/image";
import { Checkbox } from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { showErrorToast } from "./toast/Toast";

interface PaymentProps {
  selectedItems: {
    [id: string]: {
      id: string;
      count: number;
      price: number;
      image: string;
      name: string;
    };
  };
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}

const Payment = ({ selectedItems }: PaymentProps) => {
  const [frame, setFrame] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  console.log("Selected Items:", selectedItems);

  // Load Midtrans Snap JS when component mounts
  useEffect(() => {
    const loadMidtransScript = () => {
      // Check if script is already loaded
      const existingScript = document.getElementById("midtrans-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.id = "midtrans-script";
        script.setAttribute(
          "data-client-key",
          process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
        );
        document.body.appendChild(script);
      }
    };

    loadMidtransScript();
  }, []);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleShowFrame = () => {
    if (Object.keys(selectedItems).length > 0) {
      setFrame((prev) => !prev);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const url = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${url}/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedItems,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Payment failed");
      }

      if (data.error) {
        showErrorToast(data.error);
      }

      if (data.paymentMethod === "waiter") {
        router.push(`/order/completed/${data.orderId}`);
        return;
      }

      if (window.snap && data.snapToken) {
        window.snap.pay(data.snapToken, {
          onSuccess: function () {
            router.push(`/order/completed/${data.orderId}`);
          },
          onPending: function () {
            router.push(`/order/completed/${data.orderId}`);
          },
          onError: function () {
            alert("Payment failed. Please try again.");
            setLoading(false);
          },
          onClose: function () {
            alert("Payment cancelled. Your order is still pending.");
            setLoading(false);
          },
        });
      } else {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const total = Object.values(selectedItems).reduce(
    (acc, item) => acc + item.count * item.price,
    0
  );

  return (
    <div className="relative w-full">
      <div className="bg-white border-t p-2 fixed z-20 left-0 bottom-0 flex justify-between w-full items-center">
        <h2 className="text-lg font-semibold">
          Total Harga:{" "}
          <span className="text-green-500">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </h2>
        <button
          onClick={handleShowFrame}
          disabled={Object.keys(selectedItems).length === 0}
          className={`py-2 px-3 w-40 cursor-pointer rounded-md text-white ${
            Object.keys(selectedItems).length === 0
              ? "opacity-30 bg-green-500 hover:cursor-not-allowed"
              : "bg-green-500 hover:bg-green-700"
          }`}
        >
          Lanjut
        </button>
      </div>
      <div
        className={`fixed top-0 z-30 right-0 h-screen overflow-auto bg-white shadow-lg transition-all duration-300 ease-in-out w-full md:w-1/2 border ${
          frame ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="pl-0 h-screen bg-white">
          <div className="p-3">
            <div className="w-full p-2 border-b">
              <div className="md:w-[60%] w-full flex items-center justify-between">
                <button
                  onClick={handleShowFrame}
                  className="text-xl font-semibold hover:bg-gray-200 rounded-md p-2"
                >
                  <KeyboardBackspace />
                </button>
                <h1>Pembayaran</h1>
              </div>
            </div>
          </div>

          <div className="py-2 px-4">
            {Object.values(selectedItems).map((item, index) => (
              <div key={index} className="flex items-center gap-3 mb-4 pb-2">
                <div className="w-24 relative overflow-hidden rounded">
                  <Image
                    height={80}
                    width={80}
                    src={`/images/uploads/${item.image}`}
                    alt={item.name}
                    objectFit="cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">x{item.count}</p>
                </div>
                <div className="text-right font-semibold">
                  Rp {(item.count * item.price).toLocaleString("id-ID")}
                </div>
              </div>
            ))}

            <div className="mt-6 border-t pt-4">
              <div className="flex flex-col my-2">
                <p className="font-medium">Metode Pembayaran</p>
                <div className="flex flex-nowrap items-center">
                  <Checkbox
                    checked={paymentMethod === "e-wallet"}
                    onChange={() => handlePaymentMethodChange("e-wallet")}
                    color="success"
                  />
                  <p className="font-semibold font-sans">
                    E-Wallet (GoPay, DANA, ShopeePay)
                  </p>
                </div>
                <div className="flex flex-nowrap items-center">
                  <Checkbox
                    checked={paymentMethod === "waiter"}
                    onChange={() => handlePaymentMethodChange("waiter")}
                    color="success"
                  />
                  <p className="font-semibold font-sans">
                    Bayar langsung ke Waiter
                  </p>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || loading}
                className={`w-full py-3 rounded-lg mt-4 text-white ${
                  paymentMethod && !loading
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-green-500 opacity-30 cursor-not-allowed"
                }`}
              >
                {loading ? "Memproses..." : "Lanjutkan Pembayaran"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
