import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const role = session?.user.role;

    if (!userId || !role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereCondition = role === "PEMBELI" ? { userId } : {}; // ADMIN & KASIR ambil semua

    const penjualan = await prisma.penjualan.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      include: {
        user: {
          select: { username: true }, // ambil nama user
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
      namaPembeli: p.user.username, // tambahan nama pembeli
      tanggal: p.tanggal.toISOString(),
      status: p.status,
      totalHarga: p.totalHarga,
      totalJumlah: p.detail.reduce((acc, item) => acc + item.jumlah, 0),
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
