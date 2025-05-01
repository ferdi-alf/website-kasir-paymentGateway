import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      {
        error: true,
        message: "Pesanan tidak ditemukan",
        status: 404,
      },
      { status: 404 }
    );
  }

  const response = await prisma.penjualan.update({
    where: { id: params.id },
    data: {
      status: "Dikonfirmasi",
    },
  });

  if (response) {
    return NextResponse.json(
      {
        status: 201,
        message: "Berhasil mengonfirmasi pesanan",
        success: true,
      },
      { status: 201 }
    );
  }
}
