/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export default function OrderCompletedClient({ order }: { order: any }) {
  console.log("wiei", order);
  const statusClass =
    {
      MenungguPembayaran: "bg-yellow-100 text-yellow-800",
      MenungguKonfirmasi: "bg-blue-100 text-blue-800",
      Dikonfirmasi: "bg-green-100 text-green-800",
      Dibayar: "bg-green-100 text-green-800",
      Gagal: "bg-red-100 text-red-800",
    }[order.status] || "bg-gray-100 text-gray-800";

  const statusLabel =
    {
      MenungguPembayaran: "Menunggu Pembayaran",
      MenungguKonfirmasi: "Menunggu Konfirmasi",
      Dikonfirmasi: "Dikonfirmasi",
      Dibayar: "Dibayar",
      Gagal: "Gagal",
    }[order.status] || order.status;

  // Confetti animasi saat pesanan dibayar atau dikonfirmasi
  useEffect(() => {
    if (
      order.status === "Dikonfirmasi" ||
      order.status === "Dibayar" ||
      order.status === "MenungguKonfirmasi"
    ) {
      const colors = ["#34D399", "#10B981", "#6EE7B7"];
      confetti({
        particleCount: 200,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 200,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });
    }
  }, [order.status]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Detail Pesanan</h1>
            <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
            <p className="text-gray-600">
              {format(order.tanggal, "dd MMMM yyyy, HH:mm", { locale: id })}
            </p>
            <p className="mt-2 font-normal text-lg">
              Pesanan Atas Nama:{" "}
              <span className="font-bold "> {order.user.username}</span>{" "}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${statusClass} mt-2 md:mt-0`}>
            {statusLabel}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold mb-4">Pesanan Anda</h2>
          <div className="space-y-4">
            {order.detail.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.menu.name}</p>
                  <p className="text-gray-600">x{item.jumlah}</p>
                </div>
                <p className="font-semibold">
                  Rp {item.subtotal.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">
              Rp {order.totalHarga.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {order.status === "MenungguPembayaran" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Pesanan Anda sedang menunggu pembayaran. Jika Anda telah melakukan
              pembayaran, mohon tunggu konfirmasi dari sistem.
            </p>
          </div>
        )}

        {(order.status === "Dikonfirmasi" ||
          order.status === "Dibayar" ||
          order.status === "MenungguKonfirmasi") && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Terima kasih! Pesanan Anda telah akan dikonfirmasi dan sedang
              diproses. Jika pesanan sudah selesai Waiter akan memanggil nama
              anda
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/order"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
