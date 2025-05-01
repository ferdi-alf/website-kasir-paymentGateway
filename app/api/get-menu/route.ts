// /api/get-menu/route.ts
import prisma from "@/lib/prisma";

export async function GET() {
  const menus = await prisma.menu.findMany({
    include: {
      penjualan: true, // relasi ke DetailPenjualan[]
    },
  });

  const data = menus.map((menu) => {
    const totalDibeli = menu.penjualan.reduce(
      (total, detail) => total + detail.jumlah,
      0
    );
    return {
      id: menu.id,
      title: menu.name,
      stok: menu.stok,
      price: menu.price,
      image: menu.image,
      totalDibeli,
    };
  });

  return Response.json(
    {
      data,
      message: "Berhasil mendapatkan data menu",
      status: 200,
    },
    { status: 200 }
  );
}
