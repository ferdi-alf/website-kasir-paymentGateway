import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { subHours } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId || !role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const satuJamLalu = subHours(new Date(), 1);

    let whereCondition = {};

    if (role === "PEMBELI") {
      whereCondition = {
        userId,
        createdAt: { gte: satuJamLalu },
      };
    } else if (role === "ADMIN" || role === "KASIR") {
      whereCondition = {
        status: "MenungguKonfirmasi",
        createdAt: { gte: satuJamLalu },
      };
    }

    const penjualan = await prisma.penjualan.findMany({
      where: whereCondition,
      orderBy: { tanggal: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        detail: {
          include: {
            menu: true,
          },
        },
      },
    });

    const data = penjualan.map((p) => ({
      id: p.id,
      tanggal: p.tanggal.toISOString(),
      status: p.status,
      totalHarga: p.totalHarga,
      totalJumlah: p.detail.reduce((acc, item) => acc + item.jumlah, 0),
      pembeli: p.user?.username || "Unknown",
      detail: p.detail.map((d) => ({
        id: d.id,
        image: d.menu.image,
        nama: d.menu.name,
        jumlah: d.jumlah,
        subTotal: d.subtotal,
      })),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching pesanan:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
