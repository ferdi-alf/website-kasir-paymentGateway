/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import midtransClient from "midtrans-client";
import { auth } from "@/auth";

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey:
    process.env.MIDTRANS_SERVER_KEY ||
    (() => {
      throw new Error("MIDTRANS_SERVER_KEY is not defined");
    })(),
  clientKey:
    process.env.MIDTRANS_CLIENT_KEY ||
    (() => {
      throw new Error("MIDTRANS_CLIENT_KEY is not defined");
    })(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedItems, paymentMethod } = await req.json();
    if (!selectedItems || Object.keys(selectedItems).length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    const total = Object.values(selectedItems).reduce(
      (acc: number, item: any) => acc + item.count * item.price,
      0
    );

    for (const item of Object.values(selectedItems) as {
      id: string;
      count: number;
      price: number;
    }[]) {
      const menu = await prisma.menu.findUnique({
        where: { id: item.id },
        select: { stok: true, name: true },
      });

      if (!menu) {
        return NextResponse.json(
          { error: `Menu tidak ditemukan` },
          { status: 404 }
        );
      }

      if (menu.stok < item.count) {
        return NextResponse.json(
          { error: `Stok untuk ${menu.name} tidak cukup` },
          { status: 400 }
        );
      }
    }

    const penjualan = await prisma.penjualan.create({
      data: {
        totalHarga: total,
        userId:
          session.user.id ??
          (() => {
            throw new Error("User ID is undefined");
          })(),
        detail: {
          create: Object.values(selectedItems).map((item: any) => ({
            menuId: item.id,
            jumlah: item.count,
            subtotal: item.count * item.price,
          })),
        },
        status:
          paymentMethod === "waiter"
            ? "MenungguKonfirmasi"
            : "MenungguPembayaran",
      },
    });

    await Promise.all(
      Object.values(selectedItems).map(async (item: any) => {
        await prisma.menu.update({
          where: { id: item.id },
          data: {
            stok: {
              decrement: item.count,
            },
          },
        });
      })
    );

    if (paymentMethod === "waiter") {
      return NextResponse.json({
        success: true,
        orderId: penjualan.id,
        paymentMethod: "waiter",
      });
    }

    const transactionDetails = {
      transaction_details: {
        order_id: penjualan.id,
        gross_amount: total,
      },
      item_details: Object.values(selectedItems).map((item: any) => ({
        id: item.id,
        price: item.price,
        quantity: item.count,
        name: item.name,
      })),
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || "customer@example.com",
      },
      enabled_payments: ["gopay", "shopeepay", "dana"],
    };

    const midtransResponse = await snap.createTransaction(transactionDetails);
    await prisma.penjualan.update({
      where: { id: penjualan.id },
      data: {
        status: "MenungguKonfirmasi",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: penjualan.id,
      paymentMethod: "e-wallet",
      snapToken: midtransResponse.token,
      redirectUrl: midtransResponse.redirect_url,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
