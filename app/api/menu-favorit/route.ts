import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const menuFavorit = await prisma.detailPenjualan.groupBy({
      by: ["menuId"],
      _sum: { jumlah: true },
      orderBy: { _sum: { jumlah: "desc" } },
    });

    const data = await Promise.all(
      menuFavorit.map(async (fav) => {
        const menu = await prisma.menu.findUnique({
          where: { id: fav.menuId },
          select: {
            name: true,
            price: true,
            image: true,
          },
        });

        return {
          id: fav.menuId,
          nama: menu?.name || "Tidak ditemukan",
          harga: menu?.price || 0,
          image: menu?.image || "",
          totalDipesan: fav._sum.jumlah || 0,
        };
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching menu favorit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
