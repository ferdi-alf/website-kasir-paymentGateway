import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import midtransClient from "midtrans-client";

const apiClient = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === "production",
  serverKey:
    process.env.MIDTRANS_SERVER_KEY ||
    (() => {
      throw new Error("MIDTRANS_SERVER_KEY is not defined");
    })(),
  clientKey:
    process.env.MIDTRANS_CLIENT_KEY ||
    (() => {
      throw new Error("MIDTRANS_Client is not defined");
    })(),
});

export async function POST(req: Request) {
  try {
    const notificationBody = await req.json();

    const statusResponse = await apiClient.transaction.notification(
      notificationBody
    );

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        await prisma.penjualan.update({
          where: { id: orderId },
          data: { status: "MenungguKonfirmasi" },
        });
      } else if (fraudStatus == "accept") {
        await prisma.penjualan.update({
          where: { id: orderId },
          data: { status: "Dibayar" },
        });
      }
    } else if (transactionStatus == "settlement") {
      await prisma.penjualan.update({
        where: { id: orderId },
        data: { status: "Dibayar" },
      });
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      await prisma.penjualan.update({
        where: { id: orderId },
        data: { status: "Gagal" },
      });
    } else if (transactionStatus == "pending") {
      await prisma.penjualan.update({
        where: { id: orderId },
        data: { status: "MenungguPembayaran" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
