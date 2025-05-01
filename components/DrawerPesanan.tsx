"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import ButtonUpdateStatus from "./ButtonUpdateStatus";
import { useEffect, useState } from "react";

interface Data {
  id: string;
  tanggal: string;
  status: string;
  totalHarga: number;
  totalJumlah: number;
  pembeli: string;
  detail: {
    id: string;
    image: string;
    nama: string;
    jumlah: number;
    subTotal: number;
  }[];
}

export function DrawerDemo({ order }: { order: Data }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/session");

        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData && sessionData.user && sessionData.user.role) {
            setUserRole(sessionData.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const isAdminOrKasir = () => {
    return userRole === "ADMIN" || userRole === "KASIR";
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="bg-green-500 rounded-lg p-2 shadow-lg text-white cursor-pointer">
          Lihat Detail
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full pb-10 md:w-2/3 p-4">
          <h2 className="text-center font-semibold">
            Pesanan Atas Nama {order.pembeli}
          </h2>
          <DrawerHeader>
            <DrawerTitle>Detail Pesanan</DrawerTitle>
            <DrawerDescription>
              Tanggal:{" "}
              {new Date(order.tanggal).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 overflow-auto h-56 ">
            {order.detail.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b pb-2 items-center"
              >
                <Image
                  height={80}
                  width={80}
                  src={`/images/uploads/${item.image}`}
                  alt={item.nama}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{item.nama}</span>
                  <span className="text-sm text-gray-500">
                    Jumlah: {item.jumlah}
                  </span>
                  <span className="text-sm text-gray-500">
                    Subtotal:{" "}
                    <span className="text-green-500 font-medium">
                      {item.subTotal.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <p className="text-lg font-medium">Total Harga</p>
            <p className="text-lg font-medium text-green-500">
              {order.totalHarga.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
          </div>
          {isAdminOrKasir() && (
            <div className="w-full px-3 flex  justify-center ">
              <ButtonUpdateStatus api="/api/pesanan/" id={order.id} />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
